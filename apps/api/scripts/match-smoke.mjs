// End-to-end check of a match room with three simulated participants.
// Usage: node scripts/match-smoke.mjs   (API running on localhost:4000)
import WebSocket from 'ws';

const API = process.env.API ?? 'http://localhost:4000';
const WS = API.replace(/^http/, 'ws') + '/api/match/ws';
const ORIGIN = process.env.WEB_URL ?? 'http://localhost:3000';

const post = async (path, body) => {
  const response = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`${path} → ${response.status} ${JSON.stringify(data)}`);
  return data;
};

function connect(code, token, name) {
  const socket = new WebSocket(WS, { headers: { origin: ORIGIN } });
  const client = { name, state: null, errors: [], waiters: [] };
  socket.on('open', () => socket.send(JSON.stringify({ type: 'auth', code, token })));
  socket.on('message', (raw) => {
    const message = JSON.parse(raw.toString());
    if (message.type === 'error') client.errors.push(message.error);
    if (message.type === 'state') {
      client.state = message.state;
      client.waiters = client.waiters.filter(({ predicate, resolve }) => !(predicate(message.state) && (resolve(message.state), true)));
    }
  });
  client.send = (message) => socket.send(JSON.stringify(message));
  client.until = (predicate, label) =>
    new Promise((resolve, reject) => {
      if (client.state && predicate(client.state)) return resolve(client.state);
      const timer = setTimeout(() => reject(new Error(`${name}: timed out waiting for ${label}`)), 15000);
      client.waiters.push({ predicate, resolve: (state) => (clearTimeout(timer), resolve(state)) });
    });
  client.close = () => socket.close();
  return client;
}

const assert = (condition, message) => {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
  console.log(`  ✓ ${message}`);
};

const host = await post('/api/match/rooms', { mediaType: 'movie', lang: 'es', nickname: 'Host' });
console.log('room', host.code);
const preview = await (await fetch(`${API}/api/match/rooms/${host.code.toLowerCase()}`)).json();
assert(preview.joinable && preview.host === 'Host', 'preview works with a lowercase code');

const ana = await post(`/api/match/rooms/${host.code}/join`, { nickname: 'Ana' });
const beto = await post(`/api/match/rooms/${host.code}/join`, { nickname: 'Beto' });

const clients = [connect(host.code, host.token, 'Host'), connect(host.code, ana.token, 'Ana'), connect(host.code, beto.token, 'Beto')];
const [h, a, b] = clients;

await h.until((s) => s.participants.length === 3 && s.participants.every((p) => p.online), 'everyone online');
assert(true, 'three participants online in the lobby');

a.send({ type: 'start' });
await new Promise((r) => setTimeout(r, 300));
assert(a.errors.includes('not_host'), 'guests cannot start the room');

h.send({ type: 'start' });
await b.until((s) => s.status === 'genres', 'genres step');
assert(true, 'host moved the room to the genres step');

h.send({ type: 'genres', genres: [878, 28] });
a.send({ type: 'genres', genres: [878, 35] });
b.send({ type: 'genres', genres: [27, 878] });
const [swiping] = await Promise.all(clients.map((c) => c.until((s) => s.status === 'swiping' && s.deck.length > 0, 'deck')));
assert(swiping.voterCount === 3 && swiping.majority === 2, `swiping started with 3 voters, majority 2 (${swiping.deck.length} cards)`);
assert(
  clients.every((c) => c.state.deck[0]?.tmdbId === swiping.deck[0].tmdbId),
  `everyone got the same first card: ${swiping.deck[0].title}`,
);

h.send({ type: 'vote', index: 0, liked: true });
a.send({ type: 'vote', index: 0, liked: false });
await h.until((s) => s.participants.filter((p) => p.votes > 0).length === 2, 'two votes');
assert(h.state.status === 'swiping', 'one like out of three is not a match');

b.send({ type: 'vote', index: 0, liked: true });
const matched = await a.until((s) => s.status === 'matched', 'match');
assert(matched.matches[0]?.index === 0 && matched.matches[0].likes === 2, `match on "${matched.matches[0].card.title}" with 2 likes`);

b.send({ type: 'vote', index: 1, liked: true });
await new Promise((r) => setTimeout(r, 300));
assert(b.errors.includes('invalid_state'), 'no voting while the match screen is shown');

h.send({ type: 'keep-swiping' });
await a.until((s) => s.status === 'swiping', 'keep swiping');
assert(true, 'host can keep looking after a match');

// Everyone dislikes the rest of the deck → podium.
for (const client of clients) {
  for (let index = 1; index < swiping.deck.length; index++) client.send({ type: 'vote', index, liked: index === 5 && client !== b });
}
const finished = await h.until((s) => s.status === 'finished' || s.status === 'matched', 'end of deck');
assert(finished.status === 'matched' && finished.matches.some((m) => m.index === 5), 'second match detected on card 5');
h.send({ type: 'keep-swiping' });
await Promise.all(clients.map((c) => c.until((s) => s.status === 'swiping', 'swiping again')));
// Votes sent while the match screen was up were rejected; vote the remaining cards.
for (const client of clients) {
  const voted = new Set(client.state.me.votedCards);
  for (let index = 0; index < swiping.deck.length; index++) {
    if (!voted.has(index)) client.send({ type: 'vote', index, liked: false });
  }
}
const done = await h.until((s) => s.status === 'finished', 'finished');
assert(done.ranking[0].likes >= 2, `podium ready (top: ${done.ranking[0].card.title})`);

h.send({ type: 'more-cards' });
const extended = await b.until((s) => s.status === 'swiping' && s.deck.length > swiping.deck.length, 'more cards');
const keys = extended.deck.map((c) => `${c.mediaType}:${c.tmdbId}`);
assert(new Set(keys).size === keys.length, `deck extended to ${extended.deck.length} cards without duplicates`);

const late = await fetch(`${API}/api/match/rooms/${host.code}/join`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nickname: 'Tarde' }),
});
assert(late.status === 409, 'cannot join once swiping has started');

const bad = connect(host.code, 'not-a-token', 'Intruso');
await new Promise((r) => setTimeout(r, 500));
assert(!bad.state, 'invalid token gets no room state');

clients.forEach((client) => client.close());
bad.close();
console.log('All match checks passed');
process.exit(0);
