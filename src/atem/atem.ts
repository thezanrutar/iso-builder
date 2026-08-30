import { Atem } from 'atem-connection'

export const atem = new Atem()

atem.on('error', (error) => {
  console.error('[ATEM] Error:', error)
})

atem.on('info', (message) => {
  console.log('[ATEM]', message)
})

atem.on('connected', () => {
  console.log('[ATEM] Connected')

  const me = atem.state?.video.mixEffects[0]

  console.log('[ATEM] Initial state:', {
    program: me?.programInput,
    preview: me?.programInput,
  })
})

atem.on('disconnected', () => {
  console.warn('[ATEM] Disconnected')
})

atem.on('stateChanged', (state, paths) => {
  if (paths.includes('video.mixEffects.0.programInput')) {
    const programInput = 
      state.video.mixEffects[0]?.programInput
    console.log(
      '[ATEM] Program changed:',
      programInput,
    )
  }
})

export async function connectAtem(ip: string): Promise<void> {
  console.log(`[ATEM] Connecting to ${ip}...`)

  await atem.connect(ip)
}

export async function disconnectAtem(): Promise<void> {
  await atem.disconnect()
}
