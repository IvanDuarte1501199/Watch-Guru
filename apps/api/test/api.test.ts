import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import WebSocket from 'ws';
import { createClient, startTestApi, WEB_URL, type TestApi } from './setup.js';

let api: TestApi;

before(async () => {
  api = await startTestApi();
});

after(async () => {
  await api?.close();
});

async function signUp(email: string, name = 'Tester') {
  const client = createClient(api.baseUrl);
  const response = await client.post('/api/auth/sign-up/email', { name, email, password: 'supersecret123' });
  assert.equal(response.status, 200, JSON.stringify(response.body));
  return client;
}

describe('auth and library', () => {
  test('guests cannot read a library', async () => {
    const guest = createClient(api.baseUrl);
    assert.equal((await guest.get('/api/me/library')).status, 401);
  });

  test('status and Guru rating round-trip, with community stats', async () => {
    const ana = await signUp('ana@test.dev', 'Ana');
    const beto = await signUp('beto@test.dev', 'Beto');
    const title = { title: 'Fight Club', posterPath: '/fc.jpg', genreIds: [18] };

    const saved = await ana.put('/api/me/library/movie/550', { ...title, status: 'watched', rating: 9 });
    assert.equal(saved.status, 200);
    assert.equal(saved.body.entry.status, 'watched');
    assert.ok(saved.body.entry.watchedAt, 'watchedAt is set when marked as watched');

    await beto.put('/api/me/library/movie/550', { ...title, rating: 6 });
    const stats = await createClient(api.baseUrl).get('/api/titles/movie/550/stats');
    assert.deepEqual(stats.body, { average: 7.5, count: 2 });

    // Omitted fields keep their value; null clears.
    const ratingOnly = await ana.put('/api/me/library/movie/550', { ...title, rating: 10 });
    assert.equal(ratingOnly.body.entry.status, 'watched');
    const cleared = await ana.put('/api/me/library/movie/550', { ...title, status: null, rating: null });
    assert.equal(cleared.body.entry, null, 'entry is removed when nothing is left');

    const summary = await beto.get('/api/me/library/summary');
    assert.deepEqual(summary.body, { watchlist: 0, watching: 0, watched: 0, rated: 1 });
  });

  test('rejects invalid ratings', async () => {
    const client = await signUp('invalid@test.dev');
    const response = await client.put('/api/me/library/movie/1', { title: 'X', rating: 11 });
    assert.equal(response.status, 400);
  });

  test('episode progress can be marked and unmarked', async () => {
    const client = await signUp('episodes@test.dev');
    await client.put('/api/me/episodes/1399', { seasonNumber: 1, episodes: [1, 2, 3], watched: true });
    await client.put('/api/me/episodes/1399', { seasonNumber: 1, episodes: [2], watched: false });
    const { body } = await client.get('/api/me/episodes/1399');
    assert.deepEqual(
      body.episodes.map((episode: { episodeNumber: number }) => episode.episodeNumber).sort(),
      [1, 3],
    );
  });

  test('sign-out ends the session', async () => {
    const client = await signUp('signout@test.dev');
    assert.equal((await client.post('/api/auth/sign-out')).status, 200);
    assert.equal((await client.get('/api/me/library')).status, 401);
  });
});

describe('password reset and email verification', () => {
  const lastEmailTo = async (email: string) => {
    const { outbox } = await import('../src/lib/mailer.js');
    const message = outbox.filter((item) => item.to === email).at(-1);
    assert.ok(message, `an email was sent to ${email}`);
    return message;
  };
  const linkIn = (text: string) => /https?:\/\/\S+/.exec(text)![0];

  test('sign-up sends a verification email that verifies the account', async () => {
    const client = await signUp('verify@test.dev', 'Vera');
    const email = await lastEmailTo('verify@test.dev');
    assert.match(email.subject, /Confirmá tu email/);

    const link = new URL(linkIn(email.text));
    const response = await fetch(`${api.baseUrl}${link.pathname}${link.search}`, { redirect: 'manual' });
    assert.ok([200, 302].includes(response.status), `verify responded ${response.status}`);

    const session = await client.get('/api/auth/get-session');
    assert.equal(session.body.user.emailVerified, true);
  });

  test('reset link changes the password and signs out other sessions', async () => {
    const oldSession = await signUp('reset@test.dev', 'Rita');
    const guest = createClient(api.baseUrl);
    const requested = await guest.post('/api/auth/request-password-reset', {
      email: 'reset@test.dev',
      redirectTo: '/en/reset-password',
    });
    assert.equal(requested.status, 200);

    const email = await lastEmailTo('reset@test.dev');
    assert.match(email.subject, /Reset your WatchGuru password/, 'language follows the redirect path');
    const token = /reset-password\/([^?\s]+)/.exec(linkIn(email.text))![1];

    const reset = await guest.post('/api/auth/reset-password', { newPassword: 'brand-new-pass-456', token });
    assert.equal(reset.status, 200, JSON.stringify(reset.body));

    assert.equal((await oldSession.get('/api/me/library')).status, 401, 'existing sessions are revoked');
    const login = await createClient(api.baseUrl).post('/api/auth/sign-in/email', {
      email: 'reset@test.dev',
      password: 'brand-new-pass-456',
    });
    assert.equal(login.status, 200);

    const reused = await guest.post('/api/auth/reset-password', { newPassword: 'another-pass-789', token });
    assert.notEqual(reused.status, 200, 'tokens are single use');
  });

  test('unknown emails get the same response, without sending anything', async () => {
    const { outbox } = await import('../src/lib/mailer.js');
    const before = outbox.length;
    const response = await createClient(api.baseUrl).post('/api/auth/request-password-reset', {
      email: 'nobody@test.dev',
      redirectTo: '/es/reset-password',
    });
    assert.equal(response.status, 200);
    assert.equal(outbox.length, before);
  });
});

describe('custom lists', () => {
  const fightClub = { title: 'Fight Club', posterPath: '/fc.jpg', releaseDate: '1999-10-15' };

  test('owners build lists that others can read when public', async () => {
    const owner = await signUp('lists@test.dev', 'Lola');
    const created = await owner.post('/api/me/lists', { title: 'Para no dormir', description: 'Terror' });
    assert.equal(created.status, 201);
    const { id } = created.body.list;

    await owner.put(`/api/me/lists/${id}/items/movie/550`, fightClub);
    await owner.put(`/api/me/lists/${id}/items/tv/1399`, { title: 'Game of Thrones' });
    await owner.put(`/api/me/lists/${id}/items/movie/550`, fightClub); // duplicates are ignored

    const mine = await owner.get('/api/me/lists?contains=movie:550');
    assert.equal(mine.body.lists[0].itemCount, 2);
    assert.equal(mine.body.lists[0].hasTitle, true);
    assert.deepEqual(mine.body.lists[0].posters, ['/fc.jpg']);

    const visitor = createClient(api.baseUrl);
    const shared = await visitor.get(`/api/lists/${id}`);
    assert.equal(shared.status, 200);
    assert.equal(shared.body.ownerName, 'Lola');
    assert.equal(shared.body.isOwner, false);
    assert.deepEqual(
      shared.body.items.map((item: { tmdbId: number }) => item.tmdbId).sort((x: number, y: number) => x - y),
      [550, 1399],
    );

    const recent = await visitor.get('/api/lists');
    assert.ok(recent.body.lists.some((list: { id: string }) => list.id === id));

    await owner.put(`/api/me/lists/${id}`, { isPublic: false });
    assert.equal((await visitor.get(`/api/lists/${id}`)).status, 404, 'private lists are hidden');
    assert.equal((await owner.get(`/api/lists/${id}`)).status, 200, 'owners still see private lists');

    await owner.delete(`/api/me/lists/${id}/items/movie/550`);
    const afterRemove = await owner.get(`/api/lists/${id}`);
    assert.equal(afterRemove.body.items.length, 1);
  });

  test("users cannot change other people's lists", async () => {
    const owner = await signUp('owner-list@test.dev');
    const intruder = await signUp('intruder-list@test.dev');
    const { body } = await owner.post('/api/me/lists', { title: 'Mine' });

    assert.equal((await intruder.put(`/api/me/lists/${body.list.id}`, { title: 'Hacked' })).status, 404);
    assert.equal((await intruder.put(`/api/me/lists/${body.list.id}/items/movie/1`, { title: 'X' })).status, 404);
    assert.equal((await intruder.delete(`/api/me/lists/${body.list.id}`)).status, 404);
    assert.equal((await owner.delete(`/api/me/lists/${body.list.id}`)).status, 200);
  });
});

describe('taste and recommendations', () => {
  test('personal pick respects liked genres and skips watched titles', async () => {
    const client = await signUp('taste@test.dev');
    const saved = await client.put('/api/me/taste', {
      likedGenres: [878],
      dislikedGenres: [27, 878],
      providers: [],
      region: 'AR',
    });
    assert.deepEqual(saved.body.taste.dislikedGenres, [27], 'a genre cannot be liked and disliked');

    const pick = await client.get('/api/me/recommendations/random?type=movie');
    assert.equal(pick.status, 200);
    assert.ok(pick.body.genres.includes(878));

    const discover = api.tmdb.requests.filter((url) => url.pathname === '/discover/movie').at(-1)!;
    assert.equal(discover.searchParams.get('with_genres'), '878');
    assert.equal(discover.searchParams.get('without_genres'), '27');
  });
});

/* ------------------------------------------------------------------ */
/* Match rooms                                                         */
/* ------------------------------------------------------------------ */

interface RoomState {
  status: string;
  voterCount: number;
  majority: number;
  deck: { tmdbId: number; mediaType: string }[];
  participants: { online: boolean; votes: number }[];
  matches: { index: number; likes: number }[];
  ranking: { index: number; likes: number }[];
  me: { votedCards: number[] };
}

function connect(code: string, token: string) {
  const socket = new WebSocket(api.wsUrl, { headers: { origin: WEB_URL } });
  const client = {
    state: null as RoomState | null,
    errors: [] as string[],
    closeCode: null as number | null,
    closed: null as unknown as Promise<number>,
    waiters: [] as { predicate: (state: RoomState) => boolean; resolve: (state: RoomState) => void }[],
    send: (message: unknown) => socket.send(JSON.stringify(message)),
    close: () => socket.close(),
    until(predicate: (state: RoomState) => boolean): Promise<RoomState> {
      if (this.state && predicate(this.state)) return Promise.resolve(this.state);
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Timed out waiting for room state')), 5000);
        this.waiters.push({ predicate, resolve: (state) => (clearTimeout(timer), resolve(state)) });
      });
    },
    waitForError(code: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`Timed out waiting for error ${code}`)), 5000);
        const check = setInterval(() => {
          if (client.errors.includes(code)) {
            clearTimeout(timer);
            clearInterval(check);
            resolve();
          }
        }, 20);
      });
    },
  };
  socket.on('open', () => socket.send(JSON.stringify({ type: 'auth', code, token })));
  client.closed = new Promise<number>((resolve) =>
    socket.on('close', (closeCode) => {
      client.closeCode = closeCode;
      resolve(closeCode);
    }),
  );
  socket.on('message', (raw) => {
    const message = JSON.parse(raw.toString());
    if (message.type === 'error') client.errors.push(message.error);
    if (message.type !== 'state') return;
    client.state = message.state;
    client.waiters = client.waiters.filter(({ predicate, resolve }) => {
      if (!predicate(message.state)) return true;
      resolve(message.state);
      return false;
    });
  });
  return client;
}

describe('match rooms', () => {
  test('three people reach a majority match, keep looking, and get a podium', async () => {
    const guest = createClient(api.baseUrl);
    const host = await guest.post('/api/match/rooms', { mediaType: 'movie', nickname: 'Host' });
    assert.equal(host.status, 201);
    const { code } = host.body;

    const preview = await guest.get(`/api/match/rooms/${code.toLowerCase()}`);
    assert.equal(preview.body.host, 'Host');

    const ana = await guest.post(`/api/match/rooms/${code}/join`, { nickname: 'Ana' });
    const beto = await guest.post(`/api/match/rooms/${code}/join`, { nickname: 'Beto' });
    const clients = [connect(code, host.body.token), connect(code, ana.body.token), connect(code, beto.body.token)];
    const [h, a, b] = clients;
    await h.until((s) => s.participants.length === 3 && s.participants.every((p) => p.online));

    a.send({ type: 'start' });
    await a.waitForError('not_host');

    h.send({ type: 'start' });
    await b.until((s) => s.status === 'genres');
    h.send({ type: 'genres', genres: [878] });
    a.send({ type: 'genres', genres: [35] });
    b.send({ type: 'genres', genres: [878, 28] });

    const [deckState] = await Promise.all(clients.map((c) => c.until((s) => s.status === 'swiping' && s.deck.length > 0)));
    assert.equal(deckState.voterCount, 3);
    assert.equal(deckState.majority, 2);
    assert.equal(deckState.deck.length, 40);
    for (const c of clients) assert.equal(c.state!.deck[0].tmdbId, deckState.deck[0].tmdbId);

    h.send({ type: 'vote', index: 0, liked: true });
    a.send({ type: 'vote', index: 0, liked: false });
    await h.until((s) => s.participants.filter((p) => p.votes > 0).length === 2);
    assert.equal(h.state!.status, 'swiping', 'one like of three is not a match');

    b.send({ type: 'vote', index: 0, liked: true });
    const matched = await a.until((s) => s.status === 'matched');
    assert.deepEqual(matched.matches, [{ ...matched.matches[0], index: 0, likes: 2 }]);

    b.send({ type: 'vote', index: 1, liked: true });
    await b.waitForError('invalid_state');

    h.send({ type: 'keep-swiping' });
    await Promise.all(clients.map((c) => c.until((s) => s.status === 'swiping')));

    for (const c of clients) {
      const voted = new Set(c.state!.me.votedCards);
      for (let index = 0; index < deckState.deck.length; index++) {
        if (!voted.has(index)) c.send({ type: 'vote', index, liked: index === 3 && c === a });
      }
    }
    const finished = await h.until((s) => s.status === 'finished');
    assert.equal(finished.ranking[0].index, 0, 'the matched title tops the podium');

    h.send({ type: 'more-cards' });
    const extended = await b.until((s) => s.status === 'swiping' && s.deck.length === 80);
    const keys = extended.deck.map((card) => `${card.mediaType}:${card.tmdbId}`);
    assert.equal(new Set(keys).size, keys.length, 'no duplicate cards after extending');

    const late = await guest.post(`/api/match/rooms/${code}/join`, { nickname: 'Late' });
    assert.equal(late.status, 409);

    clients.forEach((c) => c.close());
  });

  test("deck prioritizes titles on the group's streaming services", async () => {
    const guest = createClient(api.baseUrl);
    const host = await guest.post('/api/match/rooms', { mediaType: 'tv', nickname: 'Host', region: 'AR' });
    const ana = await guest.post(`/api/match/rooms/${host.body.code}/join`, { nickname: 'Ana' });
    const h = connect(host.body.code, host.body.token);
    const a = connect(host.body.code, ana.body.token);
    await h.until((s) => s.participants.length === 2);

    h.send({ type: 'start' });
    await a.until((s) => s.status === 'genres');
    h.send({ type: 'genres', genres: [35], providers: [8] });
    a.send({ type: 'genres', genres: [35], providers: [337, 8] });

    const state = (await h.until((s) => s.status === 'swiping' && s.deck.length > 0)) as RoomState & {
      deck: { onGroupProviders?: boolean }[];
    };
    assert.ok(state.deck.every((card) => card.onGroupProviders), 'all cards come from the services query');

    const providerQuery = api.tmdb.requests.find(
      (url) => url.pathname === '/discover/tv' && url.searchParams.has('with_watch_providers'),
    );
    assert.ok(providerQuery, 'discover was filtered by providers');
    assert.deepEqual(providerQuery.searchParams.get('with_watch_providers')!.split('|').sort(), ['337', '8']);
    assert.equal(providerQuery.searchParams.get('watch_region'), 'AR');

    h.close();
    a.close();
  });

  test('bad tokens and foreign origins are rejected', async () => {
    const guest = createClient(api.baseUrl);
    const { body } = await guest.post('/api/match/rooms', { mediaType: 'both', nickname: 'Host' });

    const intruder = connect(body.code, 'not-a-real-token');
    assert.equal(await intruder.closed, 4003);
    assert.equal(intruder.state, null);

    const foreign = new WebSocket(api.wsUrl, { headers: { origin: 'https://evil.example' } });
    const closeCode = await new Promise<number>((resolve) => foreign.on('close', resolve));
    assert.equal(closeCode, 1008);
  });

  test('signed-in users rejoin with the same seat', async () => {
    const client = await signUp('match-host@test.dev', 'Carla');
    const created = await client.post('/api/match/rooms', { mediaType: 'tv' });
    const rejoined = await client.post(`/api/match/rooms/${created.body.code}/join`, {});
    assert.equal(rejoined.body.participantId, created.body.participantId);

    const socket = connect(created.body.code, created.body.token);
    assert.equal(await socket.closed, 4003, 'the previous token is revoked on rejoin');
  });
});
