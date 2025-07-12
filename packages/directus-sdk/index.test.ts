import { describe, expect, it } from 'vitest'

describe('Directus SDK Package Structure', () => {
  it('should export from @directus/sdk', async () => {
    const module = await import('./index')
    
    // Check that the module exports something
    expect(module).toBeDefined()
    
    // Since it's a re-export, we can check that some common Directus exports exist
    expect(module).toHaveProperty('createDirectus')
    expect(module).toHaveProperty('rest')
    expect(module).toHaveProperty('readItem')
    expect(module).toHaveProperty('readItems')
  })

  it('should export utils', async () => {
    const module = await import('./utils')
    
    // Check that the utils module exports something
    expect(module).toBeDefined()
  })

  it('should export client', async () => {
    const module = await import('./client')
    
    // Check that the client module exports something
    expect(module).toBeDefined()
  })

  it('should export commands', async () => {
    const module = await import('./commands')
    
    // Check that the commands module exports something
    expect(module).toBeDefined()
  })
})
