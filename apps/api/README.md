# Background Job - Hello World

This directory contains a simple background job implementation that demonstrates basic asynchronous execution.

## Overview

The background job is implemented in `./bin/background-job.js` and provides:
- Asynchronous execution in the background
- Outputs "Hello World" message every 10 seconds
- Graceful shutdown handling
- Simple logging with timestamps

## Usage

### Run the background job directly:
```bash
cd apps/api
node ./bin/background-job.js
```

### Run via npm script:
```bash
# From the root of the project
npm run job:hello

# Or from the api directory
cd apps/api
npm run job:hello
```

### Stop the job:
Press `Ctrl+C` to gracefully stop the background job.

## Features

- **Asynchronous execution**: Runs continuously in the background
- **Scheduled execution**: Executes every 10 seconds after the initial run
- **Error handling**: Catches and logs any execution errors
- **Graceful shutdown**: Properly handles shutdown signals (SIGINT, SIGTERM, SIGQUIT)
- **Logging**: Provides detailed logging with timestamps
- **Testable**: Exports the BackgroundJob class for testing purposes

## Implementation Details

The background job:
1. Starts immediately when executed
2. Runs the job logic (outputs "Hello World")
3. Schedules subsequent runs every 10 seconds
4. Handles shutdown signals gracefully
5. Provides proper cleanup when stopped

## Output Example

```
[Background Job] Starting background job...
[Background Job] Executing job...
[Background Job] Background job started successfully
[Background Job] Press Ctrl+C to stop the job
Hello World
[Background Job] Job completed at 2025-07-15T08:30:08.547Z
[Background Job] Executing job...
Hello World
[Background Job] Job completed at 2025-07-15T08:30:18.556Z
```