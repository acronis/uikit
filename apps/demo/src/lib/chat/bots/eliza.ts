import { BotService, BotConfig, ChatMessage } from '../types'

export class ElizaBot implements BotService {
  private patterns = [
    {
      pattern: /\b(I am|I'm)\s+(sad|depressed|unhappy|miserable|down)\b/i,
      responses: [
        "I'm sorry to hear you're feeling {0}. Can you tell me what's making you feel this way?",
        "It sounds like you're going through a difficult time. What do you think is causing these feelings?",
        'When did you first start feeling {0}? Has something specific happened?',
        "Feeling {0} can be very challenging. Would you like to talk about what's troubling you?",
      ],
    },
    {
      pattern: /\b(I am|I'm)\s+(happy|glad|excited|joyful|great|good)\b/i,
      responses: [
        "That's wonderful! What's making you feel {0}?",
        "I'm glad to hear you're feeling {0}. Tell me more about what's going well.",
        "It's great that you're feeling {0}. What happened to bring about these positive feelings?",
        'Your happiness is important. What specifically is making you feel this way?',
      ],
    },
    {
      pattern: /\b(I am|I'm)\s+(.+)$/i,
      responses: [
        "Why do you say you're {0}?",
        'How long have you been {0}?',
        'Do you believe you are {0}?',
        "What makes you think you're {0}?",
        'Can you elaborate on being {0}?',
      ],
    },
    {
      pattern: /\b(I feel|feeling)\s+(.+)$/i,
      responses: [
        'Why do you feel {0}?',
        'Tell me more about feeling {0}.',
        'What causes you to feel {0}?',
        'When did you start feeling {0}?',
        'These feelings of {0} - where do you think they come from?',
      ],
    },
    {
      pattern: /\b(I want|I need|I wish)\s+(.+)$/i,
      responses: [
        'Why do you want {0}?',
        'What would it mean to you if you got {0}?',
        'What if you never got {0}?',
        'Have you thought about why you need {0}?',
        'Tell me more about this desire for {0}.',
      ],
    },
    {
      pattern: /\b(I don't|I can't|I won't)\s+(.+)$/i,
      responses: [
        "Why do you think you can't {0}?",
        'What would happen if you did {0}?',
        'Have you tried to {0}?',
        "What's stopping you from {0}?",
        'Perhaps you could {0} if you really wanted to?',
      ],
    },
    {
      pattern: /\byou are\s+(.+)$/i,
      responses: [
        "Why do you think I'm {0}?",
        "What makes you say I'm {0}?",
        'Does it bother you that I might be {0}?',
        "Would you prefer it if I weren't {0}?",
      ],
    },
    {
      pattern: /\bbecause\s+(.+)$/i,
      responses: [
        'Is that the real reason?',
        "Don't any other reasons come to mind?",
        'Does that reason seem to explain anything else?',
        'What other reasons might there be?',
      ],
    },
    {
      pattern: /\byes\b/i,
      responses: [
        'You seem quite certain.',
        'Why are you so sure?',
        'What makes you say yes?',
        'Tell me more about why.',
      ],
    },
    {
      pattern: /\bno\b/i,
      responses: [
        'Why not?',
        'Are you certain?',
        'What would make you say no?',
        'Tell me more about your hesitation.',
      ],
    },
    {
      pattern: /\bsorry\b/i,
      responses: [
        'Why are you apologizing?',
        "Don't be sorry.",
        'What do you have to be sorry for?',
        "Apologies aren't necessary.",
      ],
    },
    {
      pattern: /\bhello\b|\bhi\b|\bhey\b/i,
      responses: [
        'Hello. How are you feeling today?',
        "Hi. What's on your mind?",
        "Hello. Please tell me what's troubling you.",
        'Greetings. How can I help you?',
      ],
    },
    {
      pattern: /\bgoodbye\b|\bbye\b/i,
      responses: [
        'Goodbye. It was nice talking with you.',
        'Thank you for sharing. Take care.',
        'Goodbye. I hope you feel better soon.',
        'Farewell. Remember our conversation.',
      ],
    },
    {
      pattern: /\b(mother|father|mom|dad|parent|family)\b/i,
      responses: [
        'Tell me more about your family.',
        'Who else in your family?',
        'What does your family mean to you?',
        'How do you get along with your family?',
      ],
    },
    {
      pattern: /\b(sad|depressed|unhappy)\b/i,
      responses: [
        "I'm sorry to hear you're feeling {0}.",
        'Why do you feel {0}?',
        'How long have you been feeling {0}?',
        'What might help you feel better?',
      ],
    },
    {
      pattern: /\b(happy|glad|joyful)\b/i,
      responses: [
        "It's good that you're feeling {0}.",
        'What makes you feel {0}?',
        'Tell me more about your happiness.',
        'How does feeling {0} affect you?',
      ],
    },
  ]

  private fallbacks = [
    'Please tell me more about that.',
    "That's interesting. Can you elaborate?",
    'I see. What else is on your mind?',
    'How does that make you feel?',
    'Why do you think that is?',
    'Can you tell me more about what you mean?',
    'That sounds important. Tell me more.',
    'What does that mean to you?',
    'How do you feel about that situation?',
    "I'm listening. Please continue.",
    'What thoughts come to mind when you say that?',
    "Help me understand what you're experiencing.",
    "That's worth exploring. Go on.",
    'What would you like to discuss about that?',
  ]

  private reflections: Map<string, string> = new Map([
    ['I', 'you'],
    ['me', 'you'],
    ['my', 'your'],
    ['mine', 'yours'],
    ['you', 'I'],
    ['your', 'my'],
    ['yours', 'mine'],
    ['am', 'are'],
    ['was', 'were'],
    ['i', 'you'],
  ])

  async generateResponse(message: string, _context: ChatMessage[]): Promise<string> {
    // Add minimal delay for better UX
    await this.delay(200 + Math.random() * 200)

    const lowerMessage = message.toLowerCase().trim()

    // Check for patterns
    for (const { pattern, responses } of this.patterns) {
      const match = message.match(pattern)
      if (match) {
        const response = responses[Math.floor(Math.random() * responses.length)]
        return this.processResponse(response, match)
      }
    }

    // Check for keywords
    if (lowerMessage.includes('help')) {
      return 'How can I help you today?'
    }

    if (lowerMessage.includes('thank')) {
      return "You're welcome. Is there anything else you'd like to discuss?"
    }

    // Return fallback response
    return this.fallbacks[Math.floor(Math.random() * this.fallbacks.length)]
  }

  shouldAskQuestion(_message: string): boolean {
    // ELIZA doesn't typically ask questions with options
    return false
  }

  generateQuestion(): { text: string; options: string[] } {
    // Not implemented for ELIZA
    return { text: '', options: [] }
  }

  getConfig(): BotConfig {
    return {
      id: 'eliza',
      name: 'ELIZA',
      description: 'Classic psychotherapist chatbot',
      avatar: '🧑‍⚕️',
      responseDelay: { min: 800, max: 1500 },
    }
  }

  private processResponse(template: string, match: RegExpMatchArray): string {
    let response = template

    // Replace placeholders with captured groups
    for (let i = 1; i < match.length; i++) {
      response = response.replace(new RegExp(`\\{${i - 1}\\}`, 'g'), match[i])
    }

    // Apply reflections
    const words = response.split(' ')
    const reflectedWords = words.map((word) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '')
      return this.reflections.get(cleanWord) || word
    })

    return reflectedWords.join(' ')
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
