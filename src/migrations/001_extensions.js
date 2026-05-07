// Postgres ships with optional features that aren't enabled by default. Before you can use them you have to turn them on with CREATE EXTENSION. 

export async function up(db) {
    await db.schema.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto').execute();
    await db.schema.raw('CREATE EXTENSION IF NOT EXISTS citext').execute();
}

export async function down(db){
    await db.schema.raw('DROP EXTENSION IF EXISTS citext').execute();
    await db.schema.raw('DROP EXTENSION IF EXISTS pgcrypto').execute();
}