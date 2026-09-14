import { runMigrations } from './db/migrations.js';
import { pool } from './db/index.js';

/** Applies pending migrations and exits (the server also runs them on boot). */
await runMigrations();
await pool.end();
console.log('Migrations applied');
