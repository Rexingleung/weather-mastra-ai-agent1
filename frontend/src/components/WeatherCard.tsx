'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  MapPin,
  Calendar,
  Sunrise
} from 'lucide-react';
import { Weather, ForecastData } from '@/graphql/queries';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface WeatherCardProps {
  weather?: Weather;
  forecast?: ForecastData;
  loading?: boolean;
  error?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  weather, 
  forecast, 
  loading = false, 
  error 
}) => {
  if (loading) {
    return (
      <motion.div 
        className="glass-effect rounded-2xl p-6 animate-pulse"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">天气数据获取失败</span>
        </div>
        <p className="mt-2 text-sm">{error}</p>
      </motion.div>
    );
  }

  if (!weather && !forecast) {
    return (
      <motion.div 
        className="glass-effect rounded-2xl p-6 text-center text-gray-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2">
          <Sunrise className="w-12 h-12 mx-auto text-weather-400" />
          <p className="text-lg font-medium">欢迎使用天气AI助手</p>
          <p className="text-sm">请输入城市名称查询天气信息</p>
        </div>
      </motion.div>
    );
  }

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('晴') || desc.includes('sun')) return '☀️';
    if (desc.includes('云') || desc.includes('cloud')) return '☁️';
    if (desc.includes('雨') || desc.includes('rain')) return '🌧️';
    if (desc.includes('雪') || desc.includes('snow')) return '❄️';
    if (desc.includes('雾') || desc.includes('fog')) return '🌫️';
    if (desc.includes('雷') || desc.includes('thunder')) return '⛈️';
    return '🌤️';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'text-red-500';
    if (temp >= 25) return 'text-orange-500';
    if (temp >= 20) return 'text-yellow-500';
    if (temp >= 15) return 'text-green-500';
    if (temp >= 10) return 'text-blue-500';
    return 'text-blue-700';
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 当前天气卡片 */}
      {weather && (
        <div className="glass-effect rounded-2xl p-6 weather-gradient text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <h2 className="text-xl font-bold">{weather.city}, {weather.country}</h2>
            </div>
            <div className="text-right text-sm opacity-80">
              {format(new Date(), 'MM月dd日 HH:mm', { locale: zhCN })}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">
                {getWeatherIcon(weather.description)}
              </div>
              <div>
                <div className={`text-5xl font-bold ${getTemperatureColor(weather.temperature)}`}>
                  {weather.temperature}°C
                </div>
                <div className="text-lg opacity-90">{weather.description}</div>
                <div className="text-sm opacity-70">
                  体感温度 {weather.feelsLike}°C
                </div>
              </div>
            </div>
          </div>

          {/* 详细信息网格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-xs opacity-80">湿度</span>
              </div>
              <div className="text-lg font-semibold">{weather.humidity}%</div>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Wind className="w-4 h-4" />
                <span className="text-xs opacity-80">风速</span>
              </div>
              <div className="text-lg font-semibold">{weather.windSpeed} m/s</div>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Gauge className="w-4 h-4" />
                <span className="text-xs opacity-80">气压</span>
              </div>
              <div className="text-lg font-semibold">{weather.pressure} hPa</div>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs opacity-80">能见度</span>
              </div>
              <div className="text-lg font-semibold">{weather.visibility} km</div>
            </div>
          </div>
        </div>
      )}

      {/* 天气预报卡片 */}
      {forecast && (
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-weather-600" />
            <h3 className="text-lg font-bold text-gray-800">未来天气预报</h3>
          </div>

          <div className="grid gap-3">
            {forecast.forecast.map((day, index) => (
              <motion.div
                key={day.date}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getWeatherIcon(day.description)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {format(new Date(day.date), 'MM月dd日', { locale: zhCN })}
                    </div>
                    <div className="text-sm text-gray-600">{day.description}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xl font-bold ${getTemperatureColor(day.temperature)}`}>
                    {day.temperature}°C
                  </div>
                  <div className="text-sm text-gray-500">
                    湿度 {day.humidity}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherCard;
