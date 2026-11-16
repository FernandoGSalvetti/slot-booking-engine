import { getPoolConnection } from "../lib/pg/index.ts";
import { getFileContent, getFilePath, getFiles } from "../utils/files.ts";
import type { PoolClient } from "pg";

const MIGRATION_DIR = 'migrations'
const MIGRATION_SCHEMA_MIGRATION_FILE = '02-create-schema-migration-table.sql'

async function recordMigration(poolClient: PoolClient, name: string) {
    await poolClient.query('INSERT INTO schema_migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [name])
}

async function ensureMigrationsTableExists(poolClient: PoolClient) {
    await runMigration(MIGRATION_SCHEMA_MIGRATION_FILE, poolClient)
}


async function runMigration(fileName: string, client: PoolClient) {
    try {
        const filePath = getFilePath(MIGRATION_DIR, fileName);

        const sqlMigration = await getFileContent(filePath);
        await client.query('BEGIN')
        console.log(sqlMigration);
        await client.query(sqlMigration);
        await recordMigration(client, fileName);
        await client.query('COMMIT');
        console.log(`Migration ${fileName} applied succesfully`)
    } catch (error) {
        await client.query('ROLLBACK');
        console.log(`Error on creating migration: ${fileName}, occurred the following error: ${error}`)
        throw error;
    }
}

async function getUnregistredMigrations(client: PoolClient, files: string[]) {
    const migrations = (await client.query('SELECT name FROM schema_migrations')).rows || [];
    return files.filter(fileName => !migrations.some(migration => migration?.name === fileName));
}

async function executeMigrations() {
    const client = await getPoolConnection();
    await ensureMigrationsTableExists(client);
    const files = await getFiles(MIGRATION_DIR);
    try {
        const unregisteredMigrations = await getUnregistredMigrations(client, files);
        if (unregisteredMigrations.length === 0) {
            return;
        }
        for (const fileName of unregisteredMigrations) {
            await runMigration(fileName, client)
        }
    } catch (error) {
        throw error;
    } finally {
        client.release()
    }
}

executeMigrations()
  .then(() => {
    console.log('All migrations applied successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });