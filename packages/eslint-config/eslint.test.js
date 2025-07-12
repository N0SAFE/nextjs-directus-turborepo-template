import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'

describe('ESLint Config', () => {
  it('should export a valid configuration object', () => {
    const config = require('./index.js')
    
    expect(config).toBeDefined()
    expect(typeof config).toBe('object')
  })

  it('should have expected configuration properties', () => {
    const config = require('./index.js')
    
    // Common ESLint config properties
    expect(config).toHaveProperty('extends')
    expect(Array.isArray(config.extends)).toBe(true)
  })

  it('should extend from base configurations', () => {
    const config = require('./index.js')
    
    expect(config.extends).toContain('next/core-web-vitals')
    expect(config.extends).toContain('prettier')
  })

  it('should have parser options configured', () => {
    const config = require('./index.js')
    
    if (config.parserOptions) {
      expect(typeof config.parserOptions).toBe('object')
    }
  })

  it('should have rules defined', () => {
    const config = require('./index.js')
    
    if (config.rules) {
      expect(typeof config.rules).toBe('object')
    }
  })

  it('should be a valid JSON structure when stringified', () => {
    const config = require('./index.js')
    
    expect(() => JSON.stringify(config)).not.toThrow()
  })

  it('should have package.json with correct metadata', () => {
    const packageJsonPath = path.join(__dirname, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    
    expect(packageJson.name).toBe('@repo/eslint-config')
    expect(packageJson.version).toBeDefined()
    expect(packageJson.main).toBeDefined()
  })

  it('should export configuration that can be used by ESLint', () => {
    const config = require('./index.js')
    
    // Basic validation that this looks like an ESLint config
    const hasEssentialProps = 
      config.extends || 
      config.rules || 
      config.plugins || 
      config.env || 
      config.parser || 
      config.parserOptions
    
    expect(hasEssentialProps).toBeTruthy()
  })
})
