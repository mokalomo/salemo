import { neon } from "@neondatabase/serverless"

let _sql: any

function getSql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Create a .env.local with DATABASE_URL=<your_connection_string>"
      )
    }
    _sql = neon(url)
  }
  return _sql
}

// Supports both tagged template usage (sql`...`) and function calls (sql(query, params))
export const sql = (...args: any[]) => {
  return (getSql() as any)(...args)
}
