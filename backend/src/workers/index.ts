import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { validateDeepSeekConfig } from './config/deepseek.js';

// 创建GraphQL模式
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// 创建GraphQL Yoga服务器
const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  // 启用GraphQL Playground
  landingPage: false,
  // 跨域配置
  cors: {
    origin: ['http://localhost:3000', 'https://*.pages.dev'],
    credentials: true,
  },
  // 自定义上下文
  context: async ({ request }) => ({
    request,
    timestamp: new Date().toISOString(),
  }),
});

/**
 * Cloudflare Workers 导出对象
 */
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    // 设置环境变量
    if (env.DEEPSEEK_API_KEY) {
      process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
    }
    if (env.OPENWEATHER_API_KEY) {
      process.env.OPENWEATHER_API_KEY = env.OPENWEATHER_API_KEY;
    }

    // 验证配置
    if (!validateDeepSeekConfig()) {
      return new Response('服务配置错误：缺少必要的API密钥', { status: 500 });
    }

    const url = new URL(request.url);

    // 健康检查端点
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: '天气AI助手',
        version: '1.0.0'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // API信息端点
    if (url.pathname === '/info') {
      return new Response(JSON.stringify({
        name: '天气AI助手 API',
        description: '基于Mastra框架和DeepSeek AI的智能天气查询服务',
        version: '1.0.0',
        endpoints: {
          graphql: '/graphql',
          health: '/health',
          info: '/info'
        },
        features: [
          '实时天气查询',
          '天气预报',
          'AI智能对话',
          'GraphQL API',
          '多语言支持'
        ]
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 所有其他请求都路由到GraphQL Yoga
    try {
      const response = await yoga.fetch(request, {
        env,
        ctx,
        waitUntil: ctx.waitUntil?.bind(ctx),
      });

      // 添加CORS头
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      // 创建新的响应对象并添加CORS头
      const corsResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          ...corsHeaders,
        },
      });

      return corsResponse;
    } catch (error) {
      console.error('Workers错误:', error);
      return new Response(JSON.stringify({
        error: '服务器内部错误',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

/**
 * 定时任务（可选）- 用于清理会话等
 */
export const scheduled = async (event: any, env: any, ctx: any) => {
  // 这里可以添加定时任务逻辑
  // 比如清理过期的会话数据
  console.log('定时任务执行:', new Date().toISOString());
};
