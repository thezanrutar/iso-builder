import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.resolve('data')
const DATABASE_PATH = path.join(DATA_DIR, 'iso-builder.sqlite')

fs.mkdirSync(DATA_DIR, { recursive: true })

export const db = new Database(DATABASE_PATH)

export function initDatabase(): void {
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      atem_ip TEXT,
      me_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO settings (id)
    VALUES (1);
  `)
}

interface SettingsRow {
  atem_ip: string | null
  me_index: number
}

export function getSettings(): SettingsRow {
  const row = db
    .prepare(`
      SELECT atem_ip, me_index
      FROM settings
      WHERE id = 1
    `)
    .get() as SettingsRow | undefined

  if (!row) {
    throw new Error('Settings row does not exist')
  }

  return row
}

export function getAtemIp(): string | null {
  return getSettings().atem_ip
}

export function setAtemIp(ip: string | null): void {
  db.prepare(`
    UPDATE settings
    SET
      atem_ip = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `)
  .run(ip)
}

export function closeDatabase(): void {
  db.close()
}
