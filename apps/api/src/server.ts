import { buildApp } from './app.js';
import { runMigrations } from './db/migrations.js';
import { env } from './env.js';

// Migrate before accepting traffic, whatever command the host uses to start us.
if (process.env.SKIP_MIGRATIONS !== 'true') {
  await runMigrations();
  console.log('Migrations applied');
}

const app = await buildApp();

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
}

try {
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
