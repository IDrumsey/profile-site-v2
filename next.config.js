const {withContentLayer} = require('next-contentlayer')


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // https://stackoverflow.com/a/73059798/17712310
  // https://levelup.gitconnected.com/deploy-your-nextjs-application-on-a-different-base-path-i-e-not-root-1c4d210cce8a
  basePath: process.env.NODE_ENV == 'development' ? '' : '/profile-site-v2'
}

module.exports = withContentLayer(nextConfig)
