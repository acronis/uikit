import type { AIModel } from '../types'

export const mockModels: AIModel[] = [
  {
    id: 'auto',
    name: 'Auto',
    tier: 'auto',
  },
  {
    id: 'chatgpt-5-2-thinking',
    name: 'ChatGPT 5.2 Thinking',
    tier: 'premium',
    usage: 25,
    usageColor: 'green',
  },
  {
    id: 'claude-opus-4-5',
    name: 'Claude Opus 4.5',
    tier: 'premium',
    usage: 75,
    usageColor: 'red',
  },
  {
    id: 'google-gemini-3-5-pro',
    name: 'Google Gemini 3.5 Pro',
    tier: 'premium',
    usage: 50,
    usageColor: 'yellow',
  },
  {
    id: 'chatgpt-4-0-turbo',
    name: 'ChatGPT 4.0 Turbo',
    tier: 'default',
  },
  {
    id: 'chatgpt-5-1-mini',
    name: 'ChatGPT 5.1 Mini',
    tier: 'default',
  },
]
