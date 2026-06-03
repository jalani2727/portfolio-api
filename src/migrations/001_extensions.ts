// Postgres ships with optional features that aren't enabled by default. Before you can use them you have to turn them on with CREATE EXTENSION. 
import {sql, type Kysely} from 'kysely';

export async function up(db: Kysely<any>) {
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`.execute(db);
    await sql`CREATE EXTENSION IF NOT EXISTS citext`.execute(db);
}

export async function down(db: Kysely<any>){
    await sql`DROP EXTENSION IF EXISTS citext`.execute(db);
    await sql`DROP EXTENSION IF EXISTS pgcrypto`.execute(db);
}