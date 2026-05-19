import pg from 'pg';
import { Kysely, PostgresDialect, type Generated } from 'kysely';

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

interface SubmissionsTable {
  id: Generated<string>,
  created_at: Generated<Date>,
  status: Generated<string>,
  name: string,
  email: string,
  phone: string | null,
  message: string,

}

interface Database {
  submissions: SubmissionsTable
}

export const db = new Kysely<Database>({
  dialect,
});
