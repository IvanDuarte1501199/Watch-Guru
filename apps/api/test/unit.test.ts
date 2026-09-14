import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

// These modules read env at import time; unit tests only need it to be valid.
process.env.DATABASE_URL ||= 'postgres://watchguru:watchguru@localhost:5432/watchguru_test';
process.env.WEB_URL ||= 'http://localhost:3000';
process.env.BETTER_AUTH_SECRET ||= 'test-secret-that-is-long-enough-for-better-auth';
process.env.TMDB_API_KEY ||= 'test';

const { genresFor } = await import('../src/lib/recommendations.js');
const { majorityOf, normalizeCode } = await import('../src/match/service.js');

describe('genresFor', () => {
  test('keeps genres valid for the media type', () => {
    assert.deepEqual(genresFor('movie', [28, 35]), [28, 35]);
  });

  test('maps TV-only genres to their movie equivalents', () => {
    assert.deepEqual(genresFor('movie', [10759]).sort(), [12, 28]);
    assert.deepEqual(genresFor('movie', [10765]).sort(), [14, 878]);
  });

  test('maps movie genres to TV equivalents and drops ones without a match', () => {
    assert.deepEqual(genresFor('tv', [28, 12, 27]), [10759]);
  });
});

describe('majorityOf', () => {
  test('needs more than half of the voters', () => {
    assert.equal(majorityOf(1), 1);
    assert.equal(majorityOf(2), 2);
    assert.equal(majorityOf(3), 2);
    assert.equal(majorityOf(4), 3);
    assert.equal(majorityOf(5), 3);
  });
});

test('normalizeCode trims and upper-cases room codes', () => {
  assert.equal(normalizeCode('  ab3cd9 '), 'AB3CD9');
});
