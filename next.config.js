// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { 
//     unoptimized: true,
//     fontLoaders: [
//       { loader: '@next/font/google', options: { timeout: 20000 } }
//     ]
//   },
//   optimizeFonts: false,
//   webpack: (config, { isServer }) => {
//     config.cache = false;
//     return config;
//   }
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
  },
  optimizeFonts: false,
  webpack: (config, { isServer }) => {
    config.cache = false;
    return config;
  }
};

module.exports = nextConfig;

