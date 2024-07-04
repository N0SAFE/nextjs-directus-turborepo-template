import { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config/tailwind.config'

const config: Config = {
    content: [
        './**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './providers/**/*.{js,ts,jsx,tsx,mdx}',
        '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    prefix: 'ui-',
    darkMode: 'class',
    presets: [sharedConfig],
}
export default config
