import { openai } from '@ai-sdk/openai';

/**
 * DeepSeek AI 模型配置
 * 使用OpenAI兼容的API接口
 */
export const deepseekModel = openai('deepseek-chat', {
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

/**
 * DeepSeek API 配置选项
 */
export const deepseekConfig = {
  model: 'deepseek-chat',
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
  maxTokens: 4000,
  temperature: 0.7,
  topP: 0.9,
};

/**
 * 验证DeepSeek API配置
 */
export function validateDeepSeekConfig(): boolean {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error('❌ DEEPSEEK_API_KEY 环境变量未设置');
    return false;
  }
  
  console.log('✅ DeepSeek API 配置验证通过');
  return true;
}

/**
 * DeepSeek模型信息
 */
export const deepseekModelInfo = {
  name: 'DeepSeek Chat',
  version: 'v1',
  description: '深度求索(DeepSeek)开发的高性能对话模型',
  maxTokens: 32768,
  inputCost: 0.0014, // 每千tokens成本 (USD)
  outputCost: 0.0028, // 每千tokens成本 (USD)
  supportedLanguages: ['中文', '英文', '日文', '韩文', '法文', '德文', '西班牙文'],
  capabilities: [
    '自然语言对话',
    '代码生成与解释',
    '文本分析与总结',
    '创意写作',
    '问题解答',
    '多语言翻译'
  ]
};
