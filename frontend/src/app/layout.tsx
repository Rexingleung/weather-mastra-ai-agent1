import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '天气AI助手 | Weather Mastra AI Agent',
  description: '基于Mastra框架和DeepSeek AI构建的智能天气查询助手，支持实时天气查询、预报和生活建议',
  keywords: [
    '天气',
    '天气预报',
    'AI助手',
    '人工智能',
    'Mastra',
    'DeepSeek',
    'GraphQL',
    'Cloudflare',
    '实时天气',
    '天气查询'
  ],
  authors: [{ name: 'Rexingleung' }],
  creator: 'Rexingleung',
  publisher: 'Rexingleung',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://weather-mastra-ai-agent.pages.dev',
    title: '天气AI助手 - 智能天气查询与预报',
    description: '基于Mastra框架和DeepSeek AI构建的智能天气查询助手',
    siteName: '天气AI助手',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '天气AI助手',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '天气AI助手 - 智能天气查询与预报',
    description: '基于Mastra框架和DeepSeek AI构建的智能天气查询助手',
    images: ['/og-image.png'],
    creator: '@rexingleung',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#0ea5e9',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Import fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        
        {/* Apple specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="天气AI助手" />
        
        {/* Additional meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 rounded-br-lg z-50"
        >
          跳转到主要内容
        </a>
        
        {/* Main content */}
        <div id="main-content">
          {children}
        </div>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        
        {/* Analytics (可选) */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics 或其他分析工具 */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                    `,
                  }}
                />
              </>
            )}
          </>
        )}
      </body>
    </html>
  );
}
