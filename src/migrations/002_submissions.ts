import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>) {
    // Create columns for 
    // id
    // name
    // email
    // phone
    // message
    // created_at (timestamp)
    // status
    await db.schema
        .createTable('submissions')
        .addColumn('id', 'uuid', (col) => col.notNull().defaultTo(sql`gen_random_uuid()`).primaryKey())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('email', 'text', (col) => col.notNull())
        .addColumn('phone', 'text')
        .addColumn('message', 'text', (col) => col.notNull())
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('status', 'text', (col) => col.notNull().defaultTo('new'))
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema
        .dropTable('submissions')
        .execute();
}