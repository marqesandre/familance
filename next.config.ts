import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  metadata: {
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Familance',
      startupImage: [
        {
          url: '/splash-828x1792.png',
          media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)'
        },
      ]
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
      viewportFit: 'cover'
    }
  }
}

export default nextConfig
