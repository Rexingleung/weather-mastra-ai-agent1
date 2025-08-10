/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用严格模式
  reactStrictMode: true,
  
  // 启用SWC压缩
  swcMinify: true,
  
  // 实验性功能
  experimental: {
    // 启用App Router
    appDir: true,
  },

  // 输出配置（用于静态导出到Cloudflare Pages）
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',

  // 图片优化配置
  images: {
    unoptimized: true, // Cloudflare Pages需要
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  },

  // 编译器选项
  compiler: {
    // 移除console.log（仅在生产环境）
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // 重写规则
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:8787/graphql',
      },
    ];
  },
};

module.exports = nextConfig;
