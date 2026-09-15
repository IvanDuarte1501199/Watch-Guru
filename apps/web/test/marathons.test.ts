import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { entryKey, marathons } from '../src/lib/marathons/data';
import { applyFilters, defaultFilters, erasAreGrouped, formatDuration, topProvider, type ViewItem } from '../src/lib/marathons/view';

describe('marathon data', () => {
  test('slugs are unique and URL-safe', () => {
    const slugs = marathons.map((marathon) => marathon.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/);
  });

  for (const marathon of marathons) {
    test(`${marathon.slug} is consistent`, () => {
      const keys = marathon.entries.map(entryKey);
      assert.equal(new Set(keys).size, keys.length, 'no title listed twice');

      for (const key of [marathon.cover, ...marathon.posters]) {
        assert.ok(keys.includes(key), `${key} is one of the entries`);
      }

      const eras = new Set(marathon.eras.map((era) => era.id));
      const arcs = new Set(marathon.arcs.map((arc) => arc.id));
      for (const entry of marathon.entries) {
        if (eras.size) assert.ok(entry.era && eras.has(entry.era), `${entryKey(entry)} has a known era`);
        else assert.equal(entry.era, undefined);
        for (const arc of entry.arcs) assert.ok(arcs.has(arc), `${entryKey(entry)} uses unknown arc "${arc}"`);
      }
      for (const arc of arcs) assert.ok(marathon.entries.some((entry) => entry.arcs.includes(arc)), `arc "${arc}" is used`);
      for (const era of eras) assert.ok(marathon.entries.some((entry) => entry.era === era), `era "${era}" is used`);
      assert.ok(marathon.entries.some((entry) => entry.essential), 'has an essential cut');
    });
  }
});

describe('marathon view', () => {
  const item = (key: string, chrono: number, releaseDate: string | null, extra: Partial<ViewItem> = {}): ViewItem => ({
    key,
    kind: 'movie',
    chrono,
    releaseDate,
    runtime: 120,
    era: null,
    arcs: [],
    essential: false,
    providers: {},
    ...extra,
  });

  const items = [
    item('a', 0, '2011-07-22', { arcs: ['captain-america'], essential: true, providers: { AR: [337] } }),
    item('b', 1, '2019-03-06', { kind: 'tv', providers: { AR: [337, 8] } }),
    item('c', 2, '2008-04-30', { essential: true, providers: { AR: [8], US: [8] } }),
    item('d', 3, null),
  ];
  const keys = (list: ViewItem[]) => list.map((entry) => entry.key);

  test('orders chronologically or by release, unreleased last', () => {
    assert.deepEqual(keys(applyFilters(items, defaultFilters, () => false)), ['a', 'b', 'c', 'd']);
    assert.deepEqual(keys(applyFilters(items, { ...defaultFilters, order: 'release' }, () => false)), ['c', 'a', 'b', 'd']);
  });

  test('combines filters', () => {
    assert.deepEqual(keys(applyFilters(items, { ...defaultFilters, essentialOnly: true }, () => false)), ['a', 'c']);
    assert.deepEqual(keys(applyFilters(items, { ...defaultFilters, kind: 'tv' }, () => false)), ['b']);
    assert.deepEqual(keys(applyFilters(items, { ...defaultFilters, arc: 'captain-america' }, () => false)), ['a']);
    assert.deepEqual(keys(applyFilters(items, { ...defaultFilters, hideWatched: true }, (entry) => entry.key === 'a')), ['b', 'c', 'd']);
  });

  test('era headings only when eras form blocks', () => {
    const era = (key: string, value: string) => item(key, 0, null, { era: value });
    assert.equal(erasAreGrouped([era('a', 'x'), era('b', 'x'), era('c', 'y')]), true);
    assert.equal(erasAreGrouped([era('a', 'x'), era('b', 'y'), era('c', 'x')]), false);
    assert.equal(erasAreGrouped([era('a', 'x'), era('b', 'x')]), false);
  });

  test('summarizes duration and the main service', () => {
    assert.equal(formatDuration(45), '45 min');
    assert.equal(formatDuration(8 * 60 + 20), '8 h');
    assert.deepEqual(topProvider(items, 'AR'), { providerId: 337, count: 2 });
    assert.equal(topProvider(items, 'ES'), null);
  });
});
