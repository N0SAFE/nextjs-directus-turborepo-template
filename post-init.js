const fs = require('fs')

fs.writeFileSync(".initiated", "");
if (!fs.existsSync(".env")) {
    fs.writeFileSync(".env", "");
}
const data = fs.readFileSync('.env').toString()
const parsed = data.split('\n').filter((line) => line !== '').map((line) => line.split('=')
).filter(([key, v]) => !key.startsWith('TEMP') && key && v).map(([key, v]) => `${key}=${v}`).join('\n')
fs.writeFileSync('.env', parsed)