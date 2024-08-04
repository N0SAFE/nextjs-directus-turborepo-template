const fs = require('fs')

fs.writeFileSync(".initiated", "");
const data = fs.readFileSync('.env').toString()
const parsed = data.split('\n').map((line) => line.split('=')
).filter(([key, v]) => !key.startsWith('TEMP') && key && v).map(([key, v]) => `${key}=${v}`).join('\n')
fs.writeFileSync('.env', parsed)