const fs = require('fs')
const prompts = require('prompts')
const { generateHash } = require('random-hash')

const envTemplate = fs.readFileSync('.env.template').toString()

// read all value between ${: } in the template

;(async () => {
    const RANDOM_NEXTAUTH_SECRET = generateHash({ length: 20 })

    console.log('NextAuth Secret: ', RANDOM_NEXTAUTH_SECRET)

    const envValue = {
        NEXTAUTH_SECRET: RANDOM_NEXTAUTH_SECRET,
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
        throw new Error('NEXT_PUBLIC_APP_URL is not defined')
    } else {
        envValue.NEXTAUTH_URL = process.env.NEXT_PUBLIC_APP_URL
    }

    let env = envTemplate

    Object.entries(envValue).forEach(([key, value]) => {
        env = env.replace(`\${:${key}}`, value)
    })

    console.log('generating .env')

    fs.writeFileSync('.env', env)
})()
