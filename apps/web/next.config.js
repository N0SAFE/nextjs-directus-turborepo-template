const MillionLint = require('@million/lint');
/**
 * @type {import('next').NextConfig}
 */
module.exports = MillionLint.next({
  rsc: true
})({
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],
  images: {
    dangerouslyAllowSVG: true,
    domains: [new URL(process.env.NEXT_PUBLIC_API_URL).hostname]
  }
});