const { spawnSync } = require('child_process')

;(async () => {
    spawnSync('npx --yes auth secret', {
        stdio: 'inherit',
        shell: true,
    })
})()
