import { ChatState, ChatAction, ChatMessage } from './types'

const generateSessionId = (): string => {
  return `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const createInitialState = (): ChatState => ({
  messages: [],
  botMode: 'hal9000',
  isTyping: false,
  inputMode: 'edit',
  userInput: '',
  metadata: {
    sessionId: generateSessionId(),
    lastActivity: new Date(),
    messageCount: 0,
  },
})

export const chatReducer = (
  state: ChatState = createInitialState(),
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case 'SEND_MESSAGE': {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: action.payload,
        sender: 'user',
        timestamp: new Date(),
        type: 'text',
      }

      return {
        ...state,
        messages: [...state.messages, userMessage],
        isTyping: true,
        userInput: '',
        metadata: {
          ...state.metadata,
          lastActivity: new Date(),
          messageCount: state.metadata.messageCount + 1,
        },
      }
    }

    case 'RECEIVE_MESSAGE': {
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isTyping: false,
        metadata: {
          ...state.metadata,
          lastActivity: new Date(),
        },
      }
    }

    case 'SET_BOT_MODE': {
      return {
        ...state,
        botMode: action.payload,
      }
    }

    case 'SET_TYPING': {
      return {
        ...state,
        isTyping: action.payload,
      }
    }

    case 'SET_INPUT_MODE': {
      return {
        ...state,
        inputMode: action.payload,
      }
    }

    case 'SET_USER_INPUT': {
      return {
        ...state,
        userInput: action.payload,
      }
    }

    case 'ANSWER_QUESTION': {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: action.payload,
        sender: 'user',
        timestamp: new Date(),
        type: 'text',
      }

      return {
        ...state,
        messages: [...state.messages, userMessage],
        isTyping: true,
        metadata: {
          ...state.metadata,
          lastActivity: new Date(),
          messageCount: state.metadata.messageCount + 1,
        },
      }
    }

    case 'CLEAR_ERROR': {
      return {
        ...state,
        error: undefined,
      }
    }

    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload,
      }
    }

    case 'LOAD_SESSION': {
      return action.payload
    }

    case 'CLEAR_SESSION': {
      return createInitialState()
    }

    default:
      return state
  }
}

export { createInitialState }
