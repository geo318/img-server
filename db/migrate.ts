import 'dotenv/config'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { db, connection } from '/db'

export async function migratePg() {
  await migrate(db, { migrationsFolder: './db/drizzle' })

  // Don't forget to close the connection, otherwise the script will hang
  await connection.end()
}
