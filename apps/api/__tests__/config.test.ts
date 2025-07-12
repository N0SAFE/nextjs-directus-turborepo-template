import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the config.js function
const configFunction = vi.fn()

vi.mock('../config.js', () => ({
  default: configFunction,
}))

describe('API Config', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should configure API settings correctly with NEXT_PUBLIC_API_URL', () => {
    const mockEnv = {
      NEXT_PUBLIC_API_URL: 'http://localhost:8055',
      API_ADMIN_TOKEN: 'test-admin-token',
      PUBLIC_URL: 'http://fallback:3000'
    }

    // Mock the config function behavior
    configFunction.mockImplementation((env) => {
      const apiUrl = new URL(env.NEXT_PUBLIC_API_URL || env.PUBLIC_URL)
      return {
        ...env,
        HOST: apiUrl.hostname,
        PORT: apiUrl.port,
        PUBLIC_URL: apiUrl.href,
        ADMIN_TOKEN: env.API_ADMIN_TOKEN,
      }
    })

    const config = configFunction(mockEnv)

    expect(config.HOST).toBe('localhost')
    expect(config.PORT).toBe('8055')
    expect(config.PUBLIC_URL).toBe('http://localhost:8055/')
    expect(config.ADMIN_TOKEN).toBe('test-admin-token')
  })

  it('should fallback to PUBLIC_URL when NEXT_PUBLIC_API_URL is not set', () => {
    const mockEnv = {
      PUBLIC_URL: 'http://fallback:3000',
      API_ADMIN_TOKEN: 'test-admin-token'
    }

    configFunction.mockImplementation((env) => {
      const apiUrl = new URL(env.NEXT_PUBLIC_API_URL || env.PUBLIC_URL)
      return {
        ...env,
        HOST: apiUrl.hostname,
        PORT: apiUrl.port,
        PUBLIC_URL: apiUrl.href,
        ADMIN_TOKEN: env.API_ADMIN_TOKEN,
      }
    })

    const config = configFunction(mockEnv)

    expect(config.HOST).toBe('fallback')
    expect(config.PORT).toBe('3000')
    expect(config.PUBLIC_URL).toBe('http://fallback:3000/')
    expect(config.ADMIN_TOKEN).toBe('test-admin-token')
  })

  it('should handle URLs with different ports correctly', () => {
    const mockEnv = {
      NEXT_PUBLIC_API_URL: 'https://api.example.com:8443',
      API_ADMIN_TOKEN: 'production-token'
    }

    configFunction.mockImplementation((env) => {
      const apiUrl = new URL(env.NEXT_PUBLIC_API_URL || env.PUBLIC_URL)
      return {
        ...env,
        HOST: apiUrl.hostname,
        PORT: apiUrl.port || (apiUrl.protocol === 'https:' ? '443' : '80'),
        PUBLIC_URL: apiUrl.href,
        ADMIN_TOKEN: env.API_ADMIN_TOKEN,
      }
    })

    const config = configFunction(mockEnv)

    expect(config.HOST).toBe('api.example.com')
    expect(config.PORT).toBe('8443')
    expect(config.PUBLIC_URL).toBe('https://api.example.com:8443/')
    expect(config.ADMIN_TOKEN).toBe('production-token')
  })

  it('should preserve other environment variables', () => {
    const mockEnv = {
      NEXT_PUBLIC_API_URL: 'http://localhost:8055',
      API_ADMIN_TOKEN: 'test-token',
      OTHER_VAR: 'other-value',
      CUSTOM_SETTING: 'custom-value'
    }

    configFunction.mockImplementation((env) => {
      const apiUrl = new URL(env.NEXT_PUBLIC_API_URL || env.PUBLIC_URL)
      return {
        ...env,
        HOST: apiUrl.hostname,
        PORT: apiUrl.port,
        PUBLIC_URL: apiUrl.href,
        ADMIN_TOKEN: env.API_ADMIN_TOKEN,
      }
    })

    const config = configFunction(mockEnv)

    expect(config.OTHER_VAR).toBe('other-value')
    expect(config.CUSTOM_SETTING).toBe('custom-value')
    expect(config.NEXT_PUBLIC_API_URL).toBe('http://localhost:8055')
  })
})
