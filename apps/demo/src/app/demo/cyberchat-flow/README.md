# CyberChat Flow Demo

A complete authentication-to-chat demo showcasing shadcn UI components working together to create a pixel-perfect implementation based on design mockups.

## Overview

This demo implements a full user flow from login to chat interaction, demonstrating:

- Clean login page with email/password inputs
- Post-authentication landing state with suggestion chips
- Interactive chat interface with AI responses
- Web search toggle functionality
- Responsive message display

## Routes

- `/demo/cyberchat-flow` - Login page (entry point)
- `/demo/cyberchat-flow/app` - Authenticated chat interface

## User Flow

1. **Login Screen** (`/demo/cyberchat-flow`)
   - Enter any email and password (no validation)
   - Click "Sign in" to authenticate
   - Redirects to the app

2. **Landing State** (first visit to `/demo/cyberchat-flow/app`)
   - Greeting: "Hey Alex, what are gonna do today?"
   - 8 suggestion chips in a grid layout
   - Click any chip to populate the input

3. **Chat Interaction**
   - Type or use suggestion chips to compose messages
   - Click Send to submit
   - View AI responses with action buttons (Copy, Like, Dislike, Regenerate)
   - Toggle Web search mode
   - Select different AI models

## Components

### Core Components

- `LoginPage` - Authentication UI
- `AppPage` - Main authenticated shell
- `LandingState` - Empty state with suggestions
- `ChatMessages` - Message display area
- `ChatInput` - Message composition with controls
- `ChatHeader` - Top navigation bar
- `Sidebar` - Recent chats navigation

### State Management

- `useChatFlowStore` - Zustand store for app state
- Handles authentication, messages, and UI state

### Data

- `suggestions.ts` - Mock suggestion chip data
- All interactions are simulated (no backend)

## shadcn Components Used

- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Input`
- `Button`
- `Switch`
- `ScrollArea`

## Key Features

- **Simulated Authentication** - Any credentials work, state managed in Zustand
- **Dynamic UI States** - Landing vs chat display based on message count
- **Auto-scroll** - Messages automatically scroll into view
- **Auto-resize Input** - Textarea expands with content
- **Loading States** - Animated typing indicator
- **Responsive Layout** - Sidebar + main content area

## Technical Details

Built with:

- React 18
- TypeScript
- Zustand (state management)
- React Router (navigation)
- shadcn UI components
- Tailwind CSS

## Mockups Reference

Located in `apps/demo/specs/mockups/`:

- `CyberChat-Concept--1.png` - Login screen
- `CyberChat-Concept--2.png` - Landing with suggestions
- `CyberChat-Concept--3.png` - Suggestion chip interaction
- `CyberChat-Concept--4.png` - Active chat with message
- `CyberChat-Concept--5.png` - Chat with sidebar and Web search

## Scenario

See `apps/demo/specs/scenarios/01-auth-and-first-chat-interaction.md` for the complete user flow specification.
