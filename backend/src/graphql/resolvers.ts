import { weatherAgent, weatherChatAgent } from '../agents/weather-agent.js';
import { getCurrentWeatherTool, getWeatherForecastTool } from '../tools/weather-tool.js';
import { deepseekModelInfo } from '../config/deepseek.js';

// 会话存储（实际项目中应该使用持久化存储）
const sessions = new Map<string, any[]>();

/**
 * GraphQL 解析器
 */
export const resolvers = {
  Query: {
    // 获取当前天气
    weather: async (_: any, { location, language = 'zh', units = 'metric' }: any) => {
      try {
        const result = await getCurrentWeatherTool.execute({
          location,
          language,
          units
        });
        return result;
      } catch (error) {
        throw new Error(`获取天气数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    },

    // 获取天气预报
    forecast: async (_: any, { location, days = 3, language = 'zh', units = 'metric' }: any) => {
      try {
        const result = await getWeatherForecastTool.execute({
          location,
          days,
          language,
          units
        });
        return result;
      } catch (error) {
        throw new Error(`获取天气预报失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    },

    // 健康检查
    health: () => {
      return `天气AI助手服务运行正常 - ${new Date().toISOString()}`;
    },

    // 获取AI助手信息
    agentInfo: (_: any, { agentName }: any) => {
      const agentInfoMap: Record<string, any> = {
        'weather': {
          name: '天气AI助手',
          description: '专业的天气信息查询助手，提供准确的天气数据和生活建议',
          capabilities: [
            '实时天气查询',
            '天气预报',
            '生活建议',
            '多语言支持',
            '智能对话'
          ],
          model: deepseekModelInfo.name,
          version: '1.0.0'
        },
        'chat': {
          name: '天气聊天助手',
          description: '友好的天气聊天助手，用自然对话方式提供天气信息',
          capabilities: [
            '自然对话',
            '天气查询',
            '生活建议',
            '情感交流',
            'emoji表达'
          ],
          model: deepseekModelInfo.name,
          version: '1.0.0'
        }
      };

      return agentInfoMap[agentName || 'weather'] || agentInfoMap['weather'];
    }
  },

  Mutation: {
    // 与AI助手对话
    chat: async (_: any, { message, agentType = 'PROFESSIONAL', sessionId }: any) => {
      try {
        // 选择代理
        const agent = agentType === 'CHAT' ? weatherChatAgent : weatherAgent;
        
        // 获取或创建会话历史
        const sessionKey = sessionId || 'default';
        let history = sessions.get(sessionKey) || [];

        // 添加用户消息到历史
        history.push({ role: 'user', content: message });

        // 调用AI代理生成响应
        const response = await agent.generate(history);
        
        // 添加助手响应到历史
        history.push({ role: 'assistant', content: response.text });
        sessions.set(sessionKey, history);

        // 尝试提取天气数据（如果AI调用了天气工具）
        let weatherData = null;
        let forecastData = null;

        // 检查是否包含工具调用结果
        if (response.toolCalls && response.toolCalls.length > 0) {
          for (const toolCall of response.toolCalls) {
            if (toolCall.toolName === 'getCurrentWeatherTool') {
              weatherData = toolCall.result;
            } else if (toolCall.toolName === 'getWeatherForecastTool') {
              forecastData = toolCall.result;
            }
          }
        }

        return {
          message: response.text,
          weatherData,
          forecastData,
          timestamp: new Date().toISOString(),
          agent: agentType === 'CHAT' ? '天气聊天助手' : '天气AI助手'
        };
      } catch (error) {
        throw new Error(`AI对话失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    },

    // 重置会话
    resetSession: (_: any, { sessionId }: any) => {
      try {
        sessions.delete(sessionId);
        return true;
      } catch (error) {
        return false;
      }
    }
  },

  Subscription: {
    // 天气更新订阅
    weatherUpdates: {
      subscribe: async function* (_, { location }: any) {
        // 简单的轮询实现，实际项目中可以使用WebSocket或SSE
        while (true) {
          try {
            const weather = await getCurrentWeatherTool.execute({ location });
            yield { weatherUpdates: weather };
            await new Promise(resolve => setTimeout(resolve, 300000)); // 5分钟更新一次
          } catch (error) {
            yield { 
              weatherUpdates: { 
                error: `获取天气更新失败: ${error instanceof Error ? error.message : '未知错误'}` 
              } 
            };
            break;
          }
        }
      }
    },

    // AI对话流订阅
    chatStream: {
      subscribe: async function* (_, { message, agentType = 'PROFESSIONAL', sessionId }: any) {
        try {
          const agent = agentType === 'CHAT' ? weatherChatAgent : weatherAgent;
          const sessionKey = sessionId || 'default';
          let history = sessions.get(sessionKey) || [];

          history.push({ role: 'user', content: message });

          // 使用流式生成
          const stream = await agent.stream(history);
          
          let fullContent = '';
          let weatherData = null;

          for await (const chunk of stream) {
            if (chunk.type === 'text') {
              fullContent += chunk.content;
              yield {
                chatStream: {
                  content: chunk.content,
                  done: false,
                  weatherData: null
                }
              };
            } else if (chunk.type === 'tool_call' && chunk.toolName === 'getCurrentWeatherTool') {
              weatherData = chunk.result;
            }
          }

          // 发送最终消息
          yield {
            chatStream: {
              content: '',
              done: true,
              weatherData
            }
          };

          // 保存到会话历史
          history.push({ role: 'assistant', content: fullContent });
          sessions.set(sessionKey, history);

        } catch (error) {
          yield {
            chatStream: {
              content: `流式对话失败: ${error instanceof Error ? error.message : '未知错误'}`,
              done: true,
              weatherData: null
            }
          };
        }
      }
    }
  }
};
