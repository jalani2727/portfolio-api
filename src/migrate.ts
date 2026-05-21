// https://kysely.dev/docs/migrations
import * as path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { Migrator } from 'kysely';
import { db } from './db.ts';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationFolder = path.join(currentDirectory, 'migrations');

const migrator = new Migrator({
    db,
    provider: {
        async getMigrations() {
            const files = await fs.readdir(migrationFolder);
            const migrations = {};
            for (const fileName of files.filter((file) => file.endsWith('.ts'))) {
                const fileUrl = pathToFileURL(path.join(migrationFolder, fileName)).href;
                migrations[fileName.replace('.ts', '')] = await import(fileUrl);
            }
            return migrations;
        }
    },
});

const { error, results } = await migrator.migrateToLatest();

results?.forEach((result) => {
    if (result.status === 'Success') {
        console.log(`Migration "${result.migrationName}" ran successfully.`);
    } else if (result.status === 'Error') {
        console.error(`Migration "${result.migrationName}" failed.`);
    }
});

if (error) {
    console.error('Migration failed:', error);
    await db.destroy();
    process.exit(1);
}

console.log('All migrations complete.');
await db.destroy();
