const { spawn } = require('child_process')

;(async () => {
    const child = spawn('npx --yes auth secret', {
        stdio: 'pipe',
        shell: true,
    })
    child.stdout.pipe(process.stdout)
    child.stdin.write('Y\n')
    child.stdin.end()
})()
