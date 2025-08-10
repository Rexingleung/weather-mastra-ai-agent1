'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RefreshCw,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { 
  CHAT_WITH_AGENT, 
  RESET_SESSION,
  ChatResponse, 
  AgentType 
} from '@/graphql/queries';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import clsx from 'clsx';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  weatherData?: any;
  loading?: boolean;
}

interface ChatInterfaceProps {
  onWeatherData?: (weather: any, forecast: any) => void;
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onWeatherData, 
  className 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: '🌤️ **欢迎使用天气AI助手！**\n\n我是你的专业天气顾问，可以帮你：\n- 查询任意城市的实时天气\n- 获取未来几天的天气预报\n- 提供生活和出行建议\n\n请告诉我你想查询哪个城市的天气吧！',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [agentType, setAgentType] = useState<AgentType>('PROFESSIONAL');
  const [sessionId] = useState(() => `session_${Date.now()}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [chatWithAgent, { loading: chatLoading }] = useMutation(CHAT_WITH_AGENT);
  const [resetSession] = useMutation(RESET_SESSION);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || chatLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // 添加加载状态的助手消息
    const loadingMessage: Message = {
      id: `loading_${Date.now()}`,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      loading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const { data } = await chatWithAgent({
        variables: {
          message: userMessage.content,
          agentType,
          sessionId
        }
      });

      if (data?.chat) {
        const response: ChatResponse = data.chat;
        
        // 移除加载消息，添加实际响应
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
          return [
            ...filtered,
            {
              id: `assistant_${Date.now()}`,
              type: 'assistant',
              content: response.message,
              timestamp: new Date(response.timestamp),
              weatherData: response.weatherData
            }
          ];
        });

        // 如果有天气数据，传递给父组件
        if (response.weatherData || response.forecastData) {
          onWeatherData?.(response.weatherData, response.forecastData);
        }
      }
    } catch (error) {
      console.error('聊天错误:', error);
      
      // 移除加载消息，添加错误消息
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [
          ...filtered,
          {
            id: `error_${Date.now()}`,
            type: 'system',
            content: `❌ 抱歉，发生了错误：${error instanceof Error ? error.message : '未知错误'}`,
            timestamp: new Date()
          }
        ];
      });
    }
  };

  // 重置会话
  const handleResetSession = async () => {
    try {
      await resetSession({ variables: { sessionId } });
      setMessages([
        {
          id: `reset_${Date.now()}`,
          type: 'system',
          content: '🔄 **会话已重置**\n\n你好！我是天气AI助手，有什么可以帮你的吗？',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('重置会话错误:', error);
    }
  };

  // 处理回车发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 获取消息图标
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5" />;
      case 'assistant':
        return <Bot className="w-5 h-5" />;
      case 'system':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  // 自定义Markdown组件
  const MarkdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold mb-4 text-gray-800">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-semibold mb-3 text-gray-800">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-medium mb-2 text-gray-700">{children}</h3>
    ),
    p: ({ children }: any) => (
      <p className="mb-2 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
    ),
    li: ({ children }: any) => (
      <li className="text-sm">{children}</li>
    ),
    code: ({ inline, children }: any) => (
      inline ? (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      ) : (
        <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
          <code className="text-sm font-mono">{children}</code>
        </pre>
      )
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-weather-400 pl-4 italic text-gray-600 mb-2">
        {children}
      </blockquote>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-800">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-700">{children}</em>
    )
  };

  return (
    <div className={clsx('flex flex-col h-full bg-white rounded-2xl shadow-lg', className)}>
      {/* 聊天头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-weather-gradient rounded-full flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">天气AI助手</h3>
            <p className="text-sm text-gray-500">
              {agentType === 'PROFESSIONAL' ? '专业模式' : '聊天模式'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 模式切换 */}
          <select
            value={agentType}
            onChange={(e) => setAgentType(e.target.value as AgentType)}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-weather-400"
          >
            <option value="PROFESSIONAL">专业模式</option>
            <option value="CHAT">聊天模式</option>
          </select>

          {/* 重置按钮 */}
          <button
            onClick={handleResetSession}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="重置会话"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={clsx(
                'flex space-x-3',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type !== 'user' && (
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm',
                  message.type === 'assistant' ? 'bg-weather-500' : 'bg-gray-500'
                )}>
                  {getMessageIcon(message.type)}
                </div>
              )}

              <div className={clsx(
                'max-w-[80%] rounded-2xl p-3',
                message.type === 'user' 
                  ? 'bg-weather-500 text-white' 
                  : message.type === 'assistant'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              )}>
                {message.loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">正在思考...</span>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={MarkdownComponents}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}

                <div className={clsx(
                  'text-xs mt-2 opacity-70',
                  message.type === 'user' ? 'text-white' : 'text-gray-500'
                )}>
                  {format(message.timestamp, 'HH:mm', { locale: zhCN })}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-weather-500 rounded-full flex items-center justify-center text-white text-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息...（如：北京今天天气怎么样？）"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-weather-400 focus:border-transparent"
            disabled={chatLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || chatLoading}
            className="bg-weather-500 text-white px-4 py-2 rounded-lg hover:bg-weather-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
          >
            {chatLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500 text-center">
          支持Markdown格式 • 按Enter发送 • Shift+Enter换行
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
