#!/usr/bin/env node

/**
 * Simple background job that outputs "Hello World"
 * Demonstrates basic asynchronous execution
 */

// Simple background job implementation
class BackgroundJob {
    constructor() {
        this.isRunning = false;
        this.intervalId = null;
    }

    // Start the background job
    start() {
        if (this.isRunning) {
            console.log('[Background Job] Already running');
            return;
        }

        console.log('[Background Job] Starting background job...');
        this.isRunning = true;

        // Run the job immediately
        this.execute();

        // Schedule the job to run every 10 seconds
        this.intervalId = setInterval(() => {
            this.execute();
        }, 10000);

        console.log('[Background Job] Background job started successfully');
    }

    // Stop the background job
    stop() {
        if (!this.isRunning) {
            console.log('[Background Job] Job is not running');
            return;
        }

        console.log('[Background Job] Stopping background job...');
        this.isRunning = false;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        console.log('[Background Job] Background job stopped');
    }

    // Execute the actual job logic
    async execute() {
        try {
            console.log('[Background Job] Executing job...');
            
            // Simulate some async work
            await this.delay(1000);
            
            // Main job output
            console.log('Hello World');
            
            // Add timestamp for better logging
            const timestamp = new Date().toISOString();
            console.log(`[Background Job] Job completed at ${timestamp}`);
        } catch (error) {
            console.error('[Background Job] Error executing job:', error);
        }
    }

    // Utility function for async delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Handle graceful shutdown
function setupGracefulShutdown(job) {
    const shutdown = () => {
        console.log('\n[Background Job] Received shutdown signal, stopping job...');
        job.stop();
        process.exit(0);
    };

    // Handle various shutdown signals
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('SIGQUIT', shutdown);
}

// Main execution
if (require.main === module) {
    const job = new BackgroundJob();
    
    // Setup graceful shutdown
    setupGracefulShutdown(job);
    
    // Start the background job
    job.start();
    
    // Keep the process alive
    console.log('[Background Job] Press Ctrl+C to stop the job');
}

// Export for testing purposes
module.exports = { BackgroundJob };