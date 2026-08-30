import {
  initDatabase,
  closeDatabase,
  getAtemIp,
} from './db/database.js'

import {
  connectAtem,
  disconnectAtem,
} from './atem/atem.js'

async function main(): Promise<void> {
  console.log('ISO builder')
  console.log(`Node ${process.version}`)
  console.log('Server starting...')
  console.log('[DB] Initializing database...')
  initDatabase()

  const atemIp = getAtemIp()

  if(!atemIp) {
    console.log(`[ATEM] No ATEM IP configured`)
    return
  }

  console.log(`[ATEM] Saved ATEM IP: ${atemIp}`)

  await connectAtem(atemIp)
}

async function shutdown(): Promise<void> {
  console.log('\nShutting down...')

  try {
    await disconnectAtem()
  } catch {
  }

  closeDatabase()
  console.log('Database closed')

  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
