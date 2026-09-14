import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { safeNextPath } from '../src/lib/api';
import { format, hasLocale } from '../src/lib/i18n/config';
import { nextCardIndex, type RoomState } from '../src/lib/match';
import { parseIdParam, routes, slugify } from '../src/lib/routes';
import { rotatingPick } from '../src/lib/site';

describe('routes', () => {
  test('slugify strips accents and punctuation', () => {
    assert.equal(slugify('El club de la lucha'), 'el-club-de-la-lucha');
    assert.equal(slugify('Amélie: ¿qué pasó?'), 'amelie-que-paso');
    assert.equal(slugify('千と千尋の神隠し'), '');
  });

  test('media URLs include a slug when the title has one', () => {
    assert.equal(routes.media('es', 'movie', 550, 'Fight Club'), '/es/movie/550-fight-club');
    assert.equal(routes.media('en', 'tv', 1, '千と千尋'), '/en/tv-show/1');
  });

  test('parseIdParam reads the leading id', () => {
    assert.equal(parseIdParam('550-fight-club'), 550);
    assert.equal(parseIdParam('550'), 550);
    assert.equal(parseIdParam('fight-club'), null);
    assert.equal(parseIdParam('550abc'), null);
  });
});

describe('safeNextPath', () => {
  test('allows same-site relative paths', () => {
    assert.equal(safeNextPath('/es/my-list', '/'), '/es/my-list');
  });

  test('rejects absolute and protocol-relative URLs', () => {
    for (const value of ['https://evil.com', '//evil.com', '/\\evil.com', 'javascript:alert(1)', null, '']) {
      assert.equal(safeNextPath(value, '/es'), '/es', String(value));
    }
  });
});

describe('i18n', () => {
  test('format replaces known placeholders only', () => {
    assert.equal(format('{count} de {total}', { count: 2, total: 3 }), '2 de 3');
    assert.equal(format('Hola {name}', {}), 'Hola {name}');
  });

  test('hasLocale', () => {
    assert.ok(hasLocale('es'));
    assert.ok(!hasLocale('fr'));
  });
});

test('rotatingPick returns distinct items', () => {
  const items = Array.from({ length: 19 }, (_, i) => i);
  const picked = rotatingPick(items, 5);
  assert.equal(picked.length, 5);
  assert.equal(new Set(picked).size, 5);
  assert.deepEqual(rotatingPick([1, 2], 5), [1, 2]);
});

test('nextCardIndex skips voted and pending cards', () => {
  const state = {
    deck: [{}, {}, {}, {}],
    me: { votedCards: [0, 2] },
  } as unknown as RoomState;
  assert.equal(nextCardIndex(state, new Set()), 1);
  assert.equal(nextCardIndex(state, new Set([1])), 3);
  assert.equal(nextCardIndex(state, new Set([1, 3])), null);
});
