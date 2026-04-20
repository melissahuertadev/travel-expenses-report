import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        zlib: false,
        'worker_threads': false,
      }
      config.externals = [
        ...config.externals,
        'fflate',
        'fflate/pkg/variant/esm',
      ]
    }
    return config
  },
}

export default withNextIntl(nextConfig)
