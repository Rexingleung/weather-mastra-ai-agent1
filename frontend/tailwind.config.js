/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 天气主题色彩
        'weather': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // AI聊天气泡色彩
        'chat': {
          user: '#3b82f6',
          assistant: '#10b981',
          system: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'typing': 'typing 1s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        typing: {
          '0%': { opacity: '0.2' },
          '100%': { opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'weather': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // 自定义插件：天气卡片效果
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-effect': {
          'background': 'rgba(255, 255, 255, 0.25)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.weather-gradient': {
          'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        '.chat-bubble': {
          'position': 'relative',
          'padding': '0.75rem 1rem',
          'border-radius': '1rem',
          'max-width': '80%',
          'word-wrap': 'break-word',
        },
        '.chat-bubble::after': {
          'content': '""',
          'position': 'absolute',
          'bottom': '0',
          'width': '0',
          'height': '0',
          'border': '10px solid transparent',
        },
        '.chat-bubble-user': {
          'background-color': '#3b82f6',
          'color': 'white',
          'margin-left': 'auto',
        },
        '.chat-bubble-user::after': {
          'right': '-10px',
          'border-left-color': '#3b82f6',
        },
        '.chat-bubble-assistant': {
          'background-color': '#f3f4f6',
          'color': '#1f2937',
        },
        '.chat-bubble-assistant::after': {
          'left': '-10px',
          'border-right-color': '#f3f4f6',
        },
      }
      addUtilities(newUtilities)
    }
  ],
  darkMode: 'class',
}
