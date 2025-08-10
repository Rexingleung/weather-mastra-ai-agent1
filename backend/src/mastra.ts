import { Mastra } from '@mastra/core';
import { weatherAgent, weatherChatAgent } from './agents/weather-agent.js';
import { getCurrentWeatherTool, getWeatherForecastTool } from './tools/weather-tool.js';
import { validateDeepSeekConfig } from './config/deepseek.js';

// 验证配置
validateDeepSeekConfig();

/**
 * Mastra 实例配置
 */
export const mastra = new Mastra({
  // 注册AI代理
  agents: {
    weatherAgent,
    weatherChatAgent
  },
  
  // 注册工具
  tools: {
    getCurrentWeatherTool,
    getWeatherForecastTool
  },

  // 日志配置
  logs: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    destination: process.env.NODE_ENV === 'production' ? 'console' : 'file'
  }
});

export default mastra;
