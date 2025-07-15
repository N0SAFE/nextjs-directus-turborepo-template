import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { BackgroundJob } = require('../bin/background-job.js')

describe('Background Job', () => {
  let job;
  let consoleSpy;

  beforeEach(() => {
    job = new BackgroundJob()
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    // Clean up any running jobs
    if (job.isRunning) {
      job.stop()
    }
    consoleSpy.mockRestore()
  })

  it('should create a background job instance', () => {
    expect(job).toBeInstanceOf(BackgroundJob)
    expect(job.isRunning).toBe(false)
    expect(job.intervalId).toBeNull()
  })

  it('should start the background job', () => {
    job.start()
    
    expect(job.isRunning).toBe(true)
    expect(job.intervalId).not.toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('[Background Job] Starting background job...')
    expect(consoleSpy).toHaveBeenCalledWith('[Background Job] Background job started successfully')
  })

  it('should not start if already running', () => {
    job.start()
    const firstIntervalId = job.intervalId
    
    job.start() // Try to start again
    
    expect(job.intervalId).toBe(firstIntervalId)
    expect(consoleSpy).toHaveBeenCalledWith('[Background Job] Already running')
  })

  it('should stop the background job', () => {
    job.start()
    expect(job.isRunning).toBe(true)
    
    job.stop()
    
    expect(job.isRunning).toBe(false)
    expect(job.intervalId).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('[Background Job] Stopping background job...')
    expect(consoleSpy).toHaveBeenCalledWith('[Background Job] Background job stopped')
  })

  it('should not stop if not running', () => {
    job.stop()
    
    expect(consoleSpy).toHaveBeenCalledWith('[Background Job] Job is not running')
  })

  it('should execute the job and output "Hello World"', async () => {
    await job.execute()
    
    expect(consoleSpy).toHaveBeenCalledWith('[Background Job] Executing job...')
    expect(consoleSpy).toHaveBeenCalledWith('Hello World')
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[Background Job] Job completed at'))
  })

  it('should handle errors during execution', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock the delay method to throw an error
    const originalDelay = job.delay
    job.delay = vi.fn().mockRejectedValue(new Error('Test error'))
    
    await job.execute()
    
    expect(errorSpy).toHaveBeenCalledWith('[Background Job] Error executing job:', expect.any(Error))
    
    // Restore original method and spy
    job.delay = originalDelay
    errorSpy.mockRestore()
  })

  it('should have a working delay utility function', async () => {
    const start = Date.now()
    await job.delay(100)
    const end = Date.now()
    
    // Allow some tolerance for timing
    expect(end - start).toBeGreaterThanOrEqual(90)
    expect(end - start).toBeLessThan(200)
  })

  it('should run job multiple times when started', async () => {
    // Use fake timers to control the interval
    vi.useFakeTimers()
    
    job.start()
    
    // Fast-forward time to trigger multiple executions
    await vi.advanceTimersByTimeAsync(25000) // 25 seconds should trigger 2 more executions
    
    // Should have logged "Hello World" at least 3 times (initial + 2 interval executions)
    const helloWorldCalls = consoleSpy.mock.calls.filter(call => call[0] === 'Hello World')
    expect(helloWorldCalls.length).toBeGreaterThanOrEqual(3)
    
    vi.useRealTimers()
  })
})