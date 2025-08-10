export const typeDefs = `
  # 天气数据类型定义
  type Weather {
    city: String!
    country: String!
    temperature: Float!
    description: String!
    humidity: Int!
    windSpeed: Float!
    pressure: Int!
    feelsLike: Float!
    visibility: Float!
    uvIndex: Float
  }

  # 天气预报类型定义
  type WeatherForecast {
    date: String!
    temperature: Float!
    description: String!
    humidity: Int!
    windSpeed: Float!
  }

  # 预报数据包装类型
  type ForecastData {
    city: String!
    country: String!
    forecast: [WeatherForecast!]!
  }

  # AI助手对话响应类型
  type ChatResponse {
    message: String!
    weatherData: Weather
    forecastData: ForecastData
    timestamp: String!
    agent: String!
  }

  # AI助手流式响应类型
  type StreamResponse {
    content: String!
    done: Boolean!
    weatherData: Weather
  }

  # 查询类型
  type Query {
    # 获取当前天气
    weather(
      location: String!
      language: String = "zh"
      units: String = "metric"
    ): Weather

    # 获取天气预报
    forecast(
      location: String!
      days: Int = 3
      language: String = "zh"
      units: String = "metric"
    ): ForecastData

    # 健康检查
    health: String!

    # 获取AI助手信息
    agentInfo(agentName: String): AgentInfo
  }

  # 变更类型
  type Mutation {
    # 与AI助手对话
    chat(
      message: String!
      agentType: AgentType = PROFESSIONAL
      sessionId: String
    ): ChatResponse

    # 重置对话会话
    resetSession(sessionId: String!): Boolean
  }

  # 订阅类型（用于实时更新）
  type Subscription {
    # 订阅天气更新
    weatherUpdates(location: String!): Weather

    # 订阅AI对话流
    chatStream(
      message: String!
      agentType: AgentType = PROFESSIONAL
      sessionId: String
    ): StreamResponse
  }

  # AI助手类型枚举
  enum AgentType {
    PROFESSIONAL  # 专业天气助手
    CHAT         # 聊天天气助手
  }

  # AI助手信息类型
  type AgentInfo {
    name: String!
    description: String!
    capabilities: [String!]!
    model: String!
    version: String!
  }

  # 输入类型定义
  input WeatherInput {
    location: String!
    language: String = "zh"
    units: String = "metric"
  }

  input ChatInput {
    message: String!
    agentType: AgentType = PROFESSIONAL
    sessionId: String
    context: ChatContext
  }

  input ChatContext {
    location: String
    preferredLanguage: String
    timezone: String
  }
`;
