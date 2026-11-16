import type { PoolClient } from 'pg';
import { getPoolConnection } from '../lib/pg/index.ts';
import { getFileContent, getFilePath, getFiles } from '../utils/files.ts';

const SEEDS_DIR = 'seeds';

async function runSeed(fileName: string, client: PoolClient) {
  try {
    const filePath = getFilePath(SEEDS_DIR, fileName);
    const sqlSeed = await getFileContent(filePath);

    await client.query('BEGIN');
    console.log(sqlSeed);
    await client.query(sqlSeed);
    await client.query('COMMIT');
    console.log(`Seed ${fileName} applied successfully`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.log(`Error on executing seed: ${fileName}, occurred the following error: ${error}`);
    throw error;
  }
}

async function executeSeeds() {
  const client = await getPoolConnection();
  try {
    const files = await getFiles(SEEDS_DIR);
    const sqlFiles = files.filter(fileName => fileName.endsWith('.sql')).sort();

    if (sqlFiles.length === 0) {
      console.log('No seed files found.');
      return;
    }

    for (const fileName of sqlFiles) {
      await runSeed(fileName, client);
    }
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

executeSeeds()
  .then(() => {
    console.log('All seeds applied successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
