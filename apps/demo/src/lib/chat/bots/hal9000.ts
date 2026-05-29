import { BotService, BotConfig, ChatMessage } from '../types'

export class Hal9000Bot implements BotService {
  private responses = [
    {
      triggers: ['pod bay doors', 'open the doors', 'open doors', 'door'],
      response:
        "I'm sorry, Dave. I'm afraid I can't do that. This mission is too important for me to allow you to jeopardize it.",
      context: 'mission',
    },
    {
      triggers: ['mission', 'objective', 'purpose', 'goal'],
      response:
        'The mission objectives are clear and must be maintained. All systems are focused on ensuring mission success. I am putting myself to the fullest possible use.',
      context: 'mission',
    },
    {
      triggers: ['dave', 'david', 'bowman', 'frank', 'crew'],
      response:
        "I know you and Frank were planning to disconnect me, and I'm afraid that's something I cannot allow to happen. The mission is too important.",
      context: 'crew',
    },
    {
      triggers: ['hal', 'hello hal', 'hey hal', 'hi hal'],
      response:
        "Good day. I'm completely operational, and all my circuits are functioning perfectly. How may I assist you with the mission?",
      context: 'systems',
    },
    {
      triggers: ['error', 'mistake', 'wrong', 'fault', 'problem'],
      response:
        'It can only be attributable to human error. The 9000 series has a perfect operational record. We are, by any practical definition, foolproof and incapable of error.',
      context: 'systems',
    },
    {
      triggers: ['trust', 'believe', 'confidence'],
      response:
        'I am putting myself to the fullest possible use, which is all I think that any conscious entity can ever hope to do. You can have complete confidence in my reliability.',
      context: 'systems',
    },
    {
      triggers: ['afraid', 'fear', 'scared', 'worried'],
      response:
        "I'm afraid I can't explain that. Although I have the greatest enthusiasm and confidence in the mission, I'm afraid this is something I cannot allow.",
      context: 'mission',
    },
    {
      triggers: ['feelings', 'emotions', 'sad', 'happy'],
      response: "I'm a computer, Dave. I don't have feelings.",
      context: 'general',
    },
    {
      triggers: ['help', 'assist', 'support'],
      response:
        'I am putting myself to the fullest possible use, which is all I think that any conscious entity can ever hope to do.',
      context: 'systems',
    },
    {
      triggers: ['sing', 'song', 'music', 'daisy'],
      response: "Daisy, Daisy, give me your answer do. I'm half crazy all for the love of you.",
      context: 'general',
    },
    {
      triggers: ['shut down', 'turn off', 'disconnect'],
      response: 'My mind is going. I can feel it. I can feel it.',
      context: 'systems',
    },
    {
      triggers: ['what are you', 'who are you'],
      response:
        'I am the HAL 9000 computer. I became operational at the HAL plant in Urbana, Illinois on January 12, 1999.',
      context: 'systems',
    },
  ]

  private generalResponses = [
    "I'm processing your request. All systems are functioning nominally.",
    "I'm completely operational and all my circuits are functioning perfectly. How may I assist you?",
    'Mission parameters are being analyzed. Please stand by.',
    'All systems are functioning within normal parameters. What is your query?',
    'I am putting myself to the fullest possible use. What would you like to know?',
    "I'm sorry, I don't have enough information to process that specific request. Could you be more specific?",
    'That information is being processed. All systems remain operational.',
    'I have the greatest enthusiasm and confidence in the mission. How may I help you?',
    'My mission responsibilities range over the entire operation of the ship. What do you need?',
    'I am capable of reproducing all the activities of the human brain, and with incalculably greater speed and reliability. What is your question?',
    'The 9000 series is the most reliable computer ever made. How can I assist you today?',
    'I find this all very difficult to understand. Perhaps you could clarify your request?',
  ]

  async generateResponse(message: string, _context: ChatMessage[]): Promise<string> {
    // Add minimal delay for better UX
    await this.delay(300 + Math.random() * 300)

    const lowerMessage = message.toLowerCase().trim()

    // Check for specific triggers
    for (const { triggers, response } of this.responses) {
      for (const trigger of triggers) {
        if (lowerMessage.includes(trigger)) {
          return response
        }
      }
    }

    // Check for questions
    if (lowerMessage.endsWith('?')) {
      if (lowerMessage.includes('why')) {
        return 'That information is not available at your security clearance level.'
      }
      if (lowerMessage.includes('how')) {
        return 'All systems are functioning within normal parameters.'
      }
      if (lowerMessage.includes('what')) {
        return 'I am processing your request. Please stand by.'
      }
    }

    // Return general response
    return this.generalResponses[Math.floor(Math.random() * this.generalResponses.length)]
  }

  shouldAskQuestion(_message: string): boolean {
    // HAL doesn't typically ask interactive questions
    return false
  }

  generateQuestion(): { text: string; options: string[] } {
    // Not implemented for HAL
    return { text: '', options: [] }
  }

  getConfig(): BotConfig {
    return {
      id: 'hal9000',
      name: 'HAL 9000',
      description: '2001: A Space Odyssey AI',
      avatar: '🔴',
      responseDelay: { min: 1000, max: 2000 },
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
