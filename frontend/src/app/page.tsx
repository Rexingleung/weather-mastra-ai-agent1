'use client';

import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Search, 
  Settings, 
  Github,
  ExternalLink,
  Zap
} from 'lucide-react';
import apolloClient from '@/lib/apollo-client';
import WeatherCard from '@/components/WeatherCard';
import ChatInterface from '@/components/ChatInterface';
import { Weather, ForecastData } from '@/graphql/queries';

const HomePage: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<Weather | undefined>();
  const [currentForecast, setCurrentForecast] = useState<ForecastData | undefined>();
  const [showSettings, setShowSettings] = useState(false);

  // 处理来自聊天的天气数据
  const handleWeatherData = (weather: Weather, forecast: ForecastData) => {
    if (weather) setCurrentWeather(weather);
    if (forecast) setCurrentForecast(forecast);
  };

  return (
    <ApolloProvider client={apolloClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* 头部 */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 h-10 bg-weather-gradient rounded-xl flex items-center justify-center text-white">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">天气AI助手</h1>
                  <p className="text-xs text-gray-500">智能天气查询与预报</p>
                </div>
              </motion.div>

              {/* 导航按钮 */}
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="设置"
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                <a
                  href="https://github.com/Rexingleung/weather-mastra-ai-agent1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="GitHub仓库"
                >
                  <Github className="w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
            {/* 左侧：天气卡片 */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* 欢迎卡片 */}
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-weather-gradient rounded-xl flex items-center justify-center text-white">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">欢迎使用</h2>
                      <p className="text-sm text-gray-600">基于Mastra + DeepSeek的智能天气助手</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-weather-600">AI</div>
                    <div className="text-xs text-gray-600">智能对话</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">实时</div>
                    <div className="text-xs text-gray-600">天气数据</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">预报</div>
                    <div className="text-xs text-gray-600">未来天气</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-600">建议</div>
                    <div className="text-xs text-gray-600">生活指导</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>服务正常</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>DeepSeek AI</span>
                  </div>
                </div>
              </div>

              {/* 天气显示区域 */}
              <div className="flex-1">
                <WeatherCard 
                  weather={currentWeather}
                  forecast={currentForecast}
                />
              </div>

              {/* 快速查询 */}
              <div className="glass-effect rounded-2xl p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  快速查询
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {['北京', '上海', '广州', '深圳'].map((city) => (
                    <button
                      key={city}
                      className="text-sm px-3 py-2 bg-white/50 hover:bg-white/80 rounded-lg transition-colors text-gray-700 hover:text-gray-900"
                      onClick={() => {
                        // 这里可以触发快速查询
                        console.log(`快速查询: ${city}`);
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 右侧：聊天界面 */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ChatInterface 
                onWeatherData={handleWeatherData}
                className="flex-1 min-h-0"
              />
            </motion.div>
          </div>
        </main>

        {/* 设置面板 */}
        {showSettings && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">设置</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API端点
                  </label>
                  <input
                    type="text"
                    value={process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    项目信息
                  </label>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>框架:</span>
                      <span>Mastra + Next.js</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI模型:</span>
                      <span>DeepSeek</span>
                    </div>
                    <div className="flex justify-between">
                      <span>部署:</span>
                      <span>Cloudflare</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <a
                    href="https://github.com/Rexingleung/weather-mastra-ai-agent1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>查看源码</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 页脚 */}
        <footer className="mt-8 py-6 border-t border-gray-200 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>
                基于 <strong>Mastra</strong> + <strong>DeepSeek AI</strong> 构建
              </p>
              <p>
                部署在 <strong>Cloudflare</strong> 平台
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ApolloProvider>
  );
};

export default HomePage;
