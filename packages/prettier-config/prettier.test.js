import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'

describe('Prettier Config', () => {
  describe('Base Configuration', () => {
    it('should export a valid base configuration', () => {
      const baseConfig = require('./prettierrc.base.js')
      
      expect(baseConfig).toBeDefined()
      expect(typeof baseConfig).toBe('object')
    })

    it('should have essential prettier options', () => {
      const baseConfig = require('./prettierrc.base.js')
      
      // Check for common prettier options
      expect(baseConfig).toHaveProperty('semi')
      expect(baseConfig).toHaveProperty('singleQuote')
      expect(baseConfig).toHaveProperty('tabWidth')
    })

    it('should have consistent formatting rules', () => {
      const baseConfig = require('./prettierrc.base.js')
      
      expect(typeof baseConfig.semi).toBe('boolean')
      expect(typeof baseConfig.singleQuote).toBe('boolean')
      expect(typeof baseConfig.tabWidth).toBe('number')
    })
  })

  describe('Tailwind Configuration', () => {
    it('should export a valid tailwind configuration', () => {
      const tailwindConfig = require('./prettierrc.tailwind.js')
      
      expect(tailwindConfig).toBeDefined()
      expect(typeof tailwindConfig).toBe('object')
    })

    it('should include tailwind plugin', () => {
      const tailwindConfig = require('./prettierrc.tailwind.js')
      
      expect(tailwindConfig).toHaveProperty('plugins')
      expect(Array.isArray(tailwindConfig.plugins)).toBe(true)
      
      const hasTailwindPlugin = tailwindConfig.plugins.some(plugin => 
        typeof plugin === 'string' && plugin.includes('tailwind')
      )
      expect(hasTailwindPlugin).toBe(true)
    })

    it('should extend base configuration', () => {
      const baseConfig = require('./prettierrc.base.js')
      const tailwindConfig = require('./prettierrc.tailwind.js')
      
      // Should have all base config properties
      Object.keys(baseConfig).forEach(key => {
        if (key !== 'plugins') {
          expect(tailwindConfig[key]).toEqual(baseConfig[key])
        }
      })
    })
  })

  describe('Package Structure', () => {
    it('should have correct package.json exports', () => {
      const packageJsonPath = path.join(__dirname, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      
      expect(packageJson.name).toBe('@repo/prettier-config')
      expect(packageJson.exports).toHaveProperty('./base')
      expect(packageJson.exports).toHaveProperty('./tailwind')
      expect(packageJson.exports['./base']).toBe('./prettierrc.base.js')
      expect(packageJson.exports['./tailwind']).toBe('./prettierrc.tailwind.js')
    })

    it('should have prettier as a dependency', () => {
      const packageJsonPath = path.join(__dirname, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      
      const hasPrettier = 
        packageJson.dependencies?.prettier ||
        packageJson.devDependencies?.prettier ||
        packageJson.peerDependencies?.prettier
      
      expect(hasPrettier).toBeDefined()
    })
  })

  describe('Configuration Validation', () => {
    it('should be valid JSON serializable objects', () => {
      const baseConfig = require('./prettierrc.base.js')
      const tailwindConfig = require('./prettierrc.tailwind.js')
      
      expect(() => JSON.stringify(baseConfig)).not.toThrow()
      expect(() => JSON.stringify(tailwindConfig)).not.toThrow()
    })

    it('should have reasonable default values', () => {
      const baseConfig = require('./prettierrc.base.js')
      
      // Check for reasonable defaults
      expect(baseConfig.tabWidth).toBeGreaterThan(0)
      expect(baseConfig.tabWidth).toBeLessThanOrEqual(8)
      
      if (baseConfig.printWidth) {
        expect(baseConfig.printWidth).toBeGreaterThan(40)
        expect(baseConfig.printWidth).toBeLessThanOrEqual(200)
      }
    })
  })

  describe('File Structure', () => {
    it('should have base config file', () => {
      expect(() => require('./prettierrc.base.js')).not.toThrow()
    })

    it('should have tailwind config file', () => {
      expect(() => require('./prettierrc.tailwind.js')).not.toThrow()
    })
  })
})
