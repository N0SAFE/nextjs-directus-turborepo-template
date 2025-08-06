const { beforeAll, beforeEach, afterAll, vi } = require('vitest')

// Global test setup for Node.js packages

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
})

// Mock console methods in tests if needed
const originalConsole = global.console

beforeAll(() => {
  global.console = {
    ...originalConsole,
    // Uncomment to suppress console logs in tests
    // log: vi.fn(),
    // error: vi.fn(),
    // warn: vi.fn(),
    // info: vi.fn(),
  }
})

afterAll(() => {
  global.console = originalConsole
})
