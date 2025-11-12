await import('./src/env.mjs')

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ['images.clerk.dev', 'oaidalleapiprodscus.blob.core.windows.net'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
}
export default config
