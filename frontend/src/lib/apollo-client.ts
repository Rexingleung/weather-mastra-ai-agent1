import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// GraphQL端点
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:8787/graphql',
});

// 认证链接（如果需要的话）
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // 可以在这里添加认证头
      'Content-Type': 'application/json',
    }
  }
});

// 错误处理链接
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL错误: 消息: ${message}, 位置: ${locations}, 路径: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`网络错误: ${networkError}`);
    
    // 可以在这里添加重试逻辑
    if (networkError.statusCode === 500) {
      // 服务器错误，可以尝试重试
      return forward(operation);
    }
  }
});

// Apollo客户端配置
export const apolloClient = new ApolloClient({
  link: from([
    errorLink,
    authLink,
    httpLink
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // 天气数据缓存策略
          weather: {
            keyArgs: ['location', 'language', 'units'],
            // 缓存5分钟
            merge(existing, incoming) {
              return incoming;
            }
          },
          // 预报数据缓存策略
          forecast: {
            keyArgs: ['location', 'days', 'language', 'units'],
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      },
      // 聊天消息类型策略
      ChatResponse: {
        fields: {
          timestamp: {
            read(timestamp) {
              return timestamp ? new Date(timestamp) : new Date();
            }
          }
        }
      }
    }
  }),
  // 默认查询选项
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first'
    },
    mutate: {
      errorPolicy: 'all'
    }
  },
  // 开发模式下启用连接到DevTools
  connectToDevTools: process.env.NODE_ENV === 'development'
});

// 导出默认客户端
export default apolloClient;
