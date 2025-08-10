import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import axios from 'axios';

// 天气数据接口定义
interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  visibility: number;
  uvIndex?: number;
  forecast?: Array<{
    date: string;
    temperature: number;
    description: string;
    humidity: number;
  }>;
}

// 输入参数验证模式
const WeatherInputSchema = z.object({
  location: z.string().describe('城市名称，可以是中文或英文，例如：北京、Beijing、上海、Shanghai'),
  language: z.string().optional().default('zh').describe('返回语言，zh=中文，en=英文'),
  units: z.string().optional().default('metric').describe('温度单位，metric=摄氏度，imperial=华氏度')
});

// 输出数据验证模式
const WeatherOutputSchema = z.object({
  city: z.string().describe('城市名称'),
  country: z.string().describe('国家'),
  temperature: z.number().describe('当前温度'),
  description: z.string().describe('天气描述'),
  humidity: z.number().describe('湿度百分比'),
  windSpeed: z.number().describe('风速'),
  pressure: z.number().describe('气压'),
  feelsLike: z.number().describe('体感温度'),
  visibility: z.number().describe('能见度'),
  uvIndex: z.number().optional().describe('紫外线指数'),
  forecast: z.array(z.object({
    date: z.string().describe('日期'),
    temperature: z.number().describe('温度'),
    description: z.string().describe('天气描述'),
    humidity: z.number().describe('湿度')
  })).optional().describe('未来几天预报')
});

/**
 * 获取当前天气信息的工具
 */
export const getCurrentWeatherTool = createTool({
  id: 'get-current-weather',
  description: '获取指定城市的当前天气信息，支持中英文城市名称查询',
  inputSchema: WeatherInputSchema,
  outputSchema: WeatherOutputSchema,
  execute: async ({ location, language = 'zh', units = 'metric' }) => {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenWeatherMap API key 未配置');
      }

      // 调用 OpenWeatherMap API
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather`;
      const response = await axios.get(weatherUrl, {
        params: {
          q: location,
          appid: apiKey,
          units: units,
          lang: language
        },
        timeout: 10000
      });

      const data = response.data;
      
      // 格式化天气数据
      const weatherData: WeatherData = {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
        visibility: data.visibility ? Math.round(data.visibility / 1000) : 0,
      };

      return weatherData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`找不到城市"${location}"的天气信息，请检查城市名称是否正确`);
        }
        if (error.response?.status === 401) {
          throw new Error('API 密钥无效，请检查 OpenWeatherMap API 配置');
        }
        throw new Error(`获取天气数据失败: ${error.message}`);
      }
      throw new Error(`获取天气信息时发生错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
});

/**
 * 获取天气预报的工具
 */
export const getWeatherForecastTool = createTool({
  id: 'get-weather-forecast',
  description: '获取指定城市未来5天的天气预报',
  inputSchema: WeatherInputSchema.extend({
    days: z.number().min(1).max(5).default(3).describe('预报天数，1-5天')
  }),
  outputSchema: z.object({
    city: z.string(),
    country: z.string(),
    forecast: z.array(z.object({
      date: z.string(),
      temperature: z.number(),
      description: z.string(),
      humidity: z.number(),
      windSpeed: z.number()
    }))
  }),
  execute: async ({ location, language = 'zh', units = 'metric', days = 3 }) => {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenWeatherMap API key 未配置');
      }

      // 调用 5天预报 API
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast`;
      const response = await axios.get(forecastUrl, {
        params: {
          q: location,
          appid: apiKey,
          units: units,
          lang: language
        },
        timeout: 10000
      });

      const data = response.data;
      
      // 处理预报数据 - 每天取一个时间点的数据
      const dailyForecasts = [];
      const processedDates = new Set();
      
      for (const item of data.list) {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        
        if (!processedDates.has(date) && dailyForecasts.length < days) {
          dailyForecasts.push({
            date: date,
            temperature: Math.round(item.main.temp),
            description: item.weather[0].description,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed
          });
          processedDates.add(date);
        }
      }

      return {
        city: data.city.name,
        country: data.city.country,
        forecast: dailyForecasts
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`找不到城市"${location}"的天气预报，请检查城市名称是否正确`);
        }
        throw new Error(`获取天气预报失败: ${error.message}`);
      }
      throw new Error(`获取天气预报时发生错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
});
