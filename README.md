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
│   │   ├── tools/        # 工具函数
│   │   ├── graphql/      # GraphQL 模式
│   │   └── workers/      # Cloudflare Workers
├── frontend/             # React 前端
│   ├── src/
│   │   ├── components/   # React 组件
│   │   ├── graphql/      # GraphQL 查询
│   │   └── pages/        # 页面组件
└── docs/                 # 文档
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm
- Cloudflare 账户
- DeepSeek API 密钥
- OpenWeatherMap API 密钥

### 安装和运行

1. **克隆仓库**
   ```bash
   git clone https://github.com/Rexingleung/weather-mastra-ai-agent1.git
   cd weather-mastra-ai-agent1
   ```

2. **安装依赖**
   ```bash
   # 安装后端依赖
   cd backend
   npm install
   
   # 安装前端依赖
   cd ../frontend
   npm install
   ```

3. **配置环境变量**
   
   创建 `backend/.env.development`:
   ```env
   DEEPSEEK_API_KEY=your_deepseek_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   GRAPHQL_ENDPOINT=http://localhost:8787/graphql
   ```
   
   创建 `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8787/graphql
   ```

4. **启动开发服务器**
   ```bash
   # 启动后端 (终端1)
   cd backend
   npm run dev
   
   # 启动前端 (终端2)
   cd frontend
   npm run dev
   ```

5. **访问应用**
   - 前端: http://localhost:3000
   - Mastra 控制台: http://localhost:4111
   - GraphQL Playground: http://localhost:8787/graphql

## 📦 部署

### Cloudflare Workers (后端)

1. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **配置 wrangler.toml**
   ```bash
   cd backend
   wrangler secret put DEEPSEEK_API_KEY
   wrangler secret put OPENWEATHER_API_KEY
   ```

3. **部署**
   ```bash
   npm run deploy
   ```

### Cloudflare Pages (前端)

1. **构建前端**
   ```bash
   cd frontend
   npm run build
   ```

2. **在 Cloudflare Dashboard 中:**
   - 创建新的 Pages 项目
   - 连接 GitHub 仓库
   - 设置构建命令: `npm run build`
   - 设置输出目录: `dist`

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

## 🛠️ 开发指南

### 添加新的天气工具

1. 在 `backend/src/tools/` 目录下创建新工具
2. 注册到主代理中
3. 更新 GraphQL 模式

### 自定义前端组件

1. 在 `frontend/src/components/` 创建组件
2. 使用 TypeScript 定义 props
3. 集成 GraphQL 查询

### 环境变量说明

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | ✅ |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API 密钥 | ✅ |
| `GRAPHQL_ENDPOINT` | GraphQL API 端点 | ✅ |

## 🤝 贡献

欢迎提交 Pull Request 和 Issue！

## 📄 许可证

MIT License

## 🙏 致谢

- [Mastra AI](https://mastra.ai/) - AI Agent 框架
- [DeepSeek](https://www.deepseek.com/) - AI 模型服务
- [OpenWeatherMap](https://openweathermap.org/) - 天气数据API
- [Cloudflare](https://cloudflare.com/) - 部署平台

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
