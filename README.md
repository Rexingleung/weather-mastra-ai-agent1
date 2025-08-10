# 天气AI助手 - Weather Mastra AI Agent

基于Mastra框架构建的智能天气查询助手，集成DeepSeek API，支持GraphQL查询和Cloudflare部署。

## 🌟 特性

- 🤖 **智能天气查询**: 使用DeepSeek AI模型提供智能天气信息查询
- 🌍 **实时天气数据**: 集成OpenWeatherMap API获取准确的天气信息
- 📱 **现代化界面**: React + TypeScript构建的响应式前端
- 🚀 **GraphQL API**: 高效的数据查询接口
- ☁️ **Cloudflare部署**: 支持Workers后端和Pages前端部署
- 📝 **Markdown渲染**: 支持丰富的文本格式展示
- 🔧 **TypeScript**: 完整的类型安全支持

## 🏗️ 项目架构

```
weather-mastra-ai-agent1/
├── backend/              # Mastra AI Agent 后端
│   ├── src/
│   │   ├── agents/       # AI 代理
│   │   │   └── weather-agent.ts
│   │   ├── tools/        # 工具函数
│   │   │   └── weather-tool.ts
│   │   ├── config/       # 配置文件
│   │   │   └── deepseek.ts
│   │   ├── graphql/      # GraphQL 模式
│   │   │   ├── schema.ts
│   │   │   └── resolvers.ts
│   │   └── workers/      # Cloudflare Workers
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.toml
├── frontend/             # React 前端
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/   # React 组件
│   │   │   ├── WeatherCard.tsx
│   │   │   └── ChatInterface.tsx
│   │   ├── lib/          # 工具库
│   │   │   └── apollo-client.ts
│   │   └── graphql/      # GraphQL 查询
│   │       └── queries.ts
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
├── .github/workflows/    # CI/CD 工作流
│   └── deploy.yml
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm
- Cloudflare 账户
- DeepSeek API 密钥
- OpenWeatherMap API 密钥

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/Rexingleung/weather-mastra-ai-agent1.git
   cd weather-mastra-ai-agent1
   ```

2. **安装后端依赖**
   ```bash
   cd backend
   npm install
   ```

3. **配置后端环境变量**
   ```bash
   cp .env.development.template .env.development
   ```
   
   编辑 `.env.development`:
   ```env
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   GRAPHQL_ENDPOINT=http://localhost:8787/graphql
   NODE_ENV=development
   PORT=4111
   ```

4. **启动后端开发服务器**
   ```bash
   npm run dev
   ```
   
   服务将在以下地址启动：
   - Mastra 控制台: http://localhost:4111
   - GraphQL API: http://localhost:8787/graphql

5. **安装前端依赖**
   ```bash
   cd ../frontend
   npm install
   ```

6. **配置前端环境变量**
   ```bash
   cp .env.local.template .env.local
   ```
   
   编辑 `.env.local`:
   ```env
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8787/graphql
   NEXT_PUBLIC_APP_NAME=天气AI助手
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NODE_ENV=development
   ```

7. **启动前端开发服务器**
   ```bash
   npm run dev
   ```
   
   前端将在 http://localhost:3000 启动

## 📦 部署

### 准备工作

1. **获取API密钥**
   - [DeepSeek API](https://platform.deepseek.com/): 注册并获取API密钥
   - [OpenWeatherMap API](https://openweathermap.org/api): 注册并获取API密钥

2. **Cloudflare账户设置**
   - 注册 [Cloudflare](https://cloudflare.com/) 账户
   - 获取账户ID和API令牌

### 自动部署（推荐）

1. **配置GitHub Secrets**
   
   在GitHub仓库设置中添加以下Secrets：
   ```
   CLOUDFLARE_API_TOKEN=你的Cloudflare_API令牌
   CLOUDFLARE_ACCOUNT_ID=你的Cloudflare账户ID
   DEEPSEEK_API_KEY=你的DeepSeek_API密钥
   OPENWEATHER_API_KEY=你的OpenWeatherMap_API密钥
   CLOUDFLARE_WORKERS_URL=https://your-worker.your-subdomain.workers.dev
   CLOUDFLARE_PAGES_URL=https://your-project.pages.dev
   ```

2. **推送代码触发部署**
   ```bash
   git push origin main
   ```
   
   GitHub Actions将自动：
   - 构建并部署后端到Cloudflare Workers
   - 构建并部署前端到Cloudflare Pages
   - 执行健康检查

### 手动部署

#### 部署后端到Cloudflare Workers

1. **安装Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **配置环境变量**
   ```bash
   cd backend
   wrangler secret put DEEPSEEK_API_KEY
   wrangler secret put OPENWEATHER_API_KEY
   ```

3. **部署**
   ```bash
   npm run build
   npm run deploy
   ```

#### 部署前端到Cloudflare Pages

1. **构建前端**
   ```bash
   cd frontend
   npm run build
   ```

2. **在Cloudflare Dashboard中**
   - 创建新的Pages项目
   - 连接GitHub仓库
   - 设置构建命令: `npm run build`
   - 设置输出目录: `dist`
   - 配置环境变量:
     ```
     NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-worker.your-subdomain.workers.dev/graphql
     ```

## 🔧 使用方法

### 基本天气查询

```typescript
// GraphQL 查询示例
const WEATHER_QUERY = gql`
  query GetWeather($location: String!) {
    weather(location: $location) {
      city
      temperature
      description
      humidity
      windSpeed
      forecast {
        date
        temperature
        description
      }
    }
  }
`;
```

### AI 助手对话

```typescript
// 与AI助手对话
const CHAT_MUTATION = gql`
  mutation Chat($message: String!) {
    chat(message: $message) {
      response
      weatherData {
        city
        temperature
        description
      }
    }
  }
`;
```

### 使用示例

1. **查询天气**: "北京今天天气怎么样？"
2. **获取预报**: "上海未来三天的天气预报"
3. **生活建议**: "明天去爬山穿什么衣服？"
4. **对比查询**: "北京和上海哪个城市今天更暖和？"

## 🛠️ 开发指南

### 添加新的天气工具

1. 在 `backend/src/tools/` 目录下创建新工具
2. 注册到主代理中
3. 更新GraphQL模式

```typescript
// 示例：添加空气质量工具
export const airQualityTool = createTool({
  id: 'get-air-quality',
  description: '获取城市空气质量信息',
  inputSchema: z.object({
    location: z.string().describe('城市名称')
  }),
  execute: async ({ location }) => {
    // 实现空气质量查询逻辑
  }
});
```

### 自定义前端组件

1. 在 `frontend/src/components/` 创建组件
2. 使用TypeScript定义props
3. 集成GraphQL查询

```typescript
// 示例组件
interface AirQualityCardProps {
  airQuality?: AirQualityData;
  loading?: boolean;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality, loading }) => {
  // 组件实现
};
```

### 环境变量说明

| 变量名 | 描述 | 必需 | 示例 |
|--------|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | ✅ | `sk-...` |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API 密钥 | ✅ | `abc123...` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | GraphQL API 端点 | ✅ | `https://api.example.com/graphql` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌 | ✅ | `...` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户ID | ✅ | `...` |

## 🧪 测试

### 运行单元测试
```bash
# 后端测试
cd backend
npm test

# 前端测试
cd frontend
npm test
```

### 手动测试
```bash
# 健康检查
curl https://your-worker.your-subdomain.workers.dev/health

# GraphQL查询测试
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"query { health }"}' \
  https://your-worker.your-subdomain.workers.dev/graphql
```

## 🔍 故障排除

### 常见问题

1. **API密钥错误**
   - 检查DeepSeek和OpenWeatherMap API密钥是否正确
   - 确保API密钥有足够的权限

2. **CORS错误**
   - 检查GraphQL端点配置
   - 确保前端和后端URL配置正确

3. **部署失败**
   - 检查Cloudflare配置
   - 查看GitHub Actions日志
   - 验证环境变量设置

### 调试技巧

1. **查看日志**
   ```bash
   # Cloudflare Workers日志
   wrangler tail

   # 本地开发日志
   npm run dev
   ```

2. **GraphQL调试**
   - 使用GraphQL Playground: `http://localhost:8787/graphql`
   - 检查查询语法和变量

## 🤝 贡献

欢迎提交Pull Request和Issue！请遵循以下流程：

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启Pull Request

### 代码规范

- 使用TypeScript
- 遵循ESLint规则
- 编写单元测试
- 更新文档

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Mastra AI](https://mastra.ai/) - AI Agent 框架
- [DeepSeek](https://www.deepseek.com/) - AI 模型服务
- [OpenWeatherMap](https://openweathermap.org/) - 天气数据API
- [Cloudflare](https://cloudflare.com/) - 部署平台
- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL客户端

## 📞 联系方式

- GitHub: [@Rexingleung](https://github.com/Rexingleung)
- 项目链接: [https://github.com/Rexingleung/weather-mastra-ai-agent1](https://github.com/Rexingleung/weather-mastra-ai-agent1)

## 🎯 路线图

- [ ] 添加多语言支持
- [ ] 集成更多天气数据源
- [ ] 添加天气图表可视化
- [ ] 支持语音交互
- [ ] 移动端PWA支持
- [ ] 地理位置自动检测
- [ ] 天气预警推送
- [ ] 历史天气数据查询

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
