import assert from 'node:assert/strict';
import { test } from 'node:test';
import { streamingProviderNames } from '../src/lib/availability';

test('streamingProviderNames skips resold add-on channels', () => {
  const providers = {
    MX: {
      link: '',
      flatrate: [
        { provider_id: 1899, provider_name: 'HBO Max', logo_path: '' },
        { provider_id: 1825, provider_name: 'HBO Max Amazon Channel', logo_path: '' },
        { provider_id: 8, provider_name: 'Netflix', logo_path: '' },
      ],
    },
  };
  assert.deepEqual(streamingProviderNames(providers, 'MX'), ['HBO Max', 'Netflix']);
  assert.deepEqual(streamingProviderNames(providers, 'AR'), []);
});
