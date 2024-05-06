import type { Config } from 'drizzle-kit'
import env from './env'

export default {
  schema: './db/schema.ts',
  out: './db/drizzle',
  driver: 'pg',
  dbCredentials: {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
} satisfies Config
