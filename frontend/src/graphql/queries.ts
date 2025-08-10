import { gql } from '@apollo/client';

// 天气数据片段
export const WEATHER_FRAGMENT = gql`
  fragment WeatherData on Weather {
    city
    country
    temperature
    description
    humidity
    windSpeed
    pressure
    feelsLike
    visibility
    uvIndex
  }
`;

// 天气预报片段
export const FORECAST_FRAGMENT = gql`
  fragment ForecastData on ForecastData {
    city
    country
    forecast {
      date
      temperature
      description
      humidity
      windSpeed
    }
  }
`;

// 聊天响应片段
export const CHAT_RESPONSE_FRAGMENT = gql`
  fragment ChatResponseData on ChatResponse {
    message
    timestamp
    agent
    weatherData {
      ...WeatherData
    }
    forecastData {
      ...ForecastData
    }
  }
  ${WEATHER_FRAGMENT}
  ${FORECAST_FRAGMENT}
`;

// 查询：获取当前天气
export const GET_WEATHER = gql`
  query GetWeather($location: String!, $language: String, $units: String) {
    weather(location: $location, language: $language, units: $units) {
      ...WeatherData
    }
  }
  ${WEATHER_FRAGMENT}
`;

// 查询：获取天气预报
export const GET_FORECAST = gql`
  query GetForecast($location: String!, $days: Int, $language: String, $units: String) {
    forecast(location: $location, days: $days, language: $language, units: $units) {
      ...ForecastData
    }
  }
  ${FORECAST_FRAGMENT}
`;

// 查询：健康检查
export const HEALTH_CHECK = gql`
  query HealthCheck {
    health
  }
`;

// 查询：获取AI助手信息
export const GET_AGENT_INFO = gql`
  query GetAgentInfo($agentName: String) {
    agentInfo(agentName: $agentName) {
      name
      description
      capabilities
      model
      version
    }
  }
`;

// 变更：与AI助手对话
export const CHAT_WITH_AGENT = gql`
  mutation ChatWithAgent($message: String!, $agentType: AgentType, $sessionId: String) {
    chat(message: $message, agentType: $agentType, sessionId: $sessionId) {
      ...ChatResponseData
    }
  }
  ${CHAT_RESPONSE_FRAGMENT}
`;

// 变更：重置会话
export const RESET_SESSION = gql`
  mutation ResetSession($sessionId: String!) {
    resetSession(sessionId: $sessionId)
  }
`;

// 订阅：天气更新
export const WEATHER_UPDATES = gql`
  subscription WeatherUpdates($location: String!) {
    weatherUpdates(location: $location) {
      ...WeatherData
    }
  }
  ${WEATHER_FRAGMENT}
`;

// 订阅：AI对话流
export const CHAT_STREAM = gql`
  subscription ChatStream($message: String!, $agentType: AgentType, $sessionId: String) {
    chatStream(message: $message, agentType: $agentType, sessionId: $sessionId) {
      content
      done
      weatherData {
        ...WeatherData
      }
    }
  }
  ${WEATHER_FRAGMENT}
`;

// TypeScript类型定义
export interface Weather {
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
}

export interface WeatherForecast {
  date: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

export interface ForecastData {
  city: string;
  country: string;
  forecast: WeatherForecast[];
}

export interface ChatResponse {
  message: string;
  timestamp: string;
  agent: string;
  weatherData?: Weather;
  forecastData?: ForecastData;
}

export interface StreamResponse {
  content: string;
  done: boolean;
  weatherData?: Weather;
}

export interface AgentInfo {
  name: string;
  description: string;
  capabilities: string[];
  model: string;
  version: string;
}

export type AgentType = 'PROFESSIONAL' | 'CHAT';

// 查询变量类型
export interface WeatherVariables {
  location: string;
  language?: string;
  units?: string;
}

export interface ForecastVariables {
  location: string;
  days?: number;
  language?: string;
  units?: string;
}

export interface ChatVariables {
  message: string;
  agentType?: AgentType;
  sessionId?: string;
}

export interface StreamVariables {
  message: string;
  agentType?: AgentType;
  sessionId?: string;
}
