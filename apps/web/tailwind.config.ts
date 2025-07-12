import { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './providers/**/*.{js,ts,jsx,tsx,mdx}',
        '../../packages/ui/components/**/*.{ts,tsx}',
        '../../packages/ui/lib/**/*.{ts,tsx}',
        '../../packages/ui/index.tsx',
    ],
    darkMode: 'class',
    presets: [sharedConfig],
}
export default config
