# CyberChat Interactive Prototype - Specifications

## Design Analysis from Figma

### Layout Structure

- **Total Width**: 1440px
- **Sidebar**: 256px (left, fixed)
- **Main Chat Area**: 1184px (right, scrollable)
- **Background**: Sidebar has rgba(244,247,252,0.5), Main area is white

### Color Palette (Cyber-Chat Theme)

- **Primary**: #0285FF (Cyber blue)
- **Secondary**: #00204D (Deep navy - "Nav/nav-primary")
- **Background**: #FFFFFF
- **Muted Background**: rgba(244,247,252,0.5)
- **Border**: rgba(181,185,196,0.5)
- **Text Primary**: #0A0A0A
- **Text Muted**: rgba(10,10,10,0.6)
- **Success**: #65BA74 (green for progress)
- **Warning**: #FFBA18 (yellow for progress)
- **Danger**: #E5484D (red for progress)

---

## Component Specifications

### 1. SIDEBAR (256px width)

#### 1.1 Logo Section

- **Height**: 60px (16px padding top/bottom, 44px content)
- **Content**: "Acronis" (with icon) + "CyberChat" text
- **Font**: Acronis Cyber Light, 22px for "CyberChat"
- **Colors**: "Acronis" in primary (#0285FF), "CyberChat" in navy (#00204D)

#### 1.2 Search Input

- **Position**: 16px from left, 64px from top
- **Size**: 224px width, 36px height
- **Border**: 1px solid rgba(181,185,196,0.5)
- **Border Radius**: 8px
- **Icon**: Search icon (16px) at left with 12px padding
- **Placeholder**: "Search..."
- **States**:
  - Default: border rgba(181,185,196,0.5)
  - Focus: border primary color
  - Hover: subtle background change

#### 1.3 Projects Section

- **Divider**: 1px rgba(38,104,197,0.05) at top (116px from top)
- **Header**: "Projects" (14px, semi-bold) with + button (24px)
- **Items**: Collapsible tree structure
  - **Collapsed items**: ChevronRight icon (16px)
  - **Expanded items**: ChevronDown icon (16px)
  - **Nested items**: 28px left indent
  - **Item height**: 36px
  - **Item states**:
    - Default: text rgba(10,10,10,0.6)
    - Hover: background rgba(38,104,197,0.05)
    - Active/Selected: text #0A0A0A, background rgba(38,104,197,0.1)
- **Example structure**:
  - Network infrastructure (expanded)
    - VPN configuration guide
    - Firewall policies
    - DLP January audit
  - 2025 Wrapped overview (collapsed)
  - Agent skill tree (collapsed)

#### 1.4 Skills Section

- **Divider**: 1px rgba(38,104,197,0.05)
- **Header**: "Skills" (14px, semi-bold) with + button (24px)
- **Similar structure to Projects**

#### 1.5 Recent Chats Section

- **Divider**: 1px rgba(38,104,197,0.05)
- **Header**: "Recent chats" (14px, semi-bold) with + button (24px)
- **Items**: List of chat conversations
  - **Item height**: 36px
  - **Item padding**: 12px horizontal, 8px vertical
  - **Item states**:
    - Default: text rgba(10,10,10,0.6)
    - Hover: background rgba(38,104,197,0.05)
    - Active: background rgba(38,104,197,0.1), text #0A0A0A
  - **Alert indicator**: Clock icon (16px) in red for urgent items
- **Items**:
  - Sales follow-up
  - Customer feedback triage (active, has alert)
  - Marketing campaign strategy
  - Feature demo

#### 1.6 User Profile Footer

- **Position**: Bottom of sidebar, 60px height
- **Border**: 1px top border rgba(181,185,196,0.5)
- **Content**:
  - Avatar (32x32px) with initials "JB"
  - Name: "Jorge Borloni" (14px)
  - Settings icon button (24x24px)
- **States**:
  - Settings button hover: background rgba(38,104,197,0.05)

---

### 2. MAIN CHAT AREA (1184px width)

#### 2.1 Header Bar

- **Height**: 56px
- **Background**: white
- **Border Bottom**: 1px rgba(181,185,196,0.5)
- **Content**:
  - **Left**: Chat title "Customer feedback triage" (16px, semi-bold)
  - **Right**:
    - Switch: "Temporary chat" toggle
    - Button: "Share & Export" with dropdown icon
- **Padding**: 24px horizontal

#### 2.2 Chat Messages Area

- **Padding**: 24px all sides
- **Max Width**: 896px (centered)
- **Scrollable**: vertical scroll

**Message Types**:

##### User Message

- **Layout**: Flex row with 12px gap
- **Avatar**: 32x32px circle with "U" initial, primary background
- **Content**:
  - Text in 14px regular
  - No background card
  - Timestamp below (12px, muted)

##### AI Message

- **Layout**: Flex row with 12px gap
- **Avatar**: 32x32px circle with "AI" initial, default background
- **Content**:
  - Text in 14px regular
  - Can include:
    - Tables (with borders, muted header background)
    - Badges (outline style, 12px text)
    - Action buttons row (copy, like, dislike, share, regenerate, more)
  - Action buttons: 24x24px ghost buttons with 16px icons

##### Loading/Processing Message

- **Layout**: Flex row with 12px gap
- **Icon**: 24x24px rounded square with spinning loader (16px)
- **Content**:
  - Title: "Gathering info" (14px, semi-bold)
  - Description: Multi-line text (14px, muted)

##### Table Component

- **Border**: 1px rgba(181,185,196,0.5), 8px border radius
- **Header**: Background rgba(244,247,252,0.5)
- **Cells**: 12px padding
- **Font**: 14px
- **Columns**: Left-aligned except last (right-aligned)

#### 2.3 Input Area

- **Position**: Bottom, fixed
- **Height**: ~140px
- **Background**: white
- **Border Top**: 1px rgba(181,185,196,0.5)
- **Padding**: 24px

**Input Container**:

- **Border**: 1px rgba(181,185,196,0.5)
- **Border Radius**: 16px (rounded-2xl)
- **Padding**: 12px
- **Min Height**: 64px

**Textarea**:

- **Placeholder**: "Ask anything"
- **Font**: 14px
- **Resize**: none
- **Background**: transparent

**Bottom Row**:

- **Left Side**:
  - Attach file button (36x36px, outline)
  - Deep research button (36x36px, outline, brain icon)
  - Web search button (36x36px, outline, globe icon)
- **Right Side**:
  - Model selector dropdown (outline button, "Model: Auto")
  - Send button (36x36px, primary, send icon)

---

### 3. MODEL SELECTOR DROPDOWN

**Trigger Button**:

- **Text**: "Model: Auto"
- **Icon**: ChevronDown (16px)
- **Style**: Outline button
- **Size**: Auto width, 36px height

**Dropdown Panel**:

- **Width**: 280px
- **Background**: white
- **Border**: 1px rgba(181,185,196,0.5)
- **Border Radius**: 8px
- **Shadow**: Box shadow (0 2px 4px -2px, 0 4px 6px -1px) rgba(0,0,0,0.1)
- **Padding**: 8px

**Sections**:

##### Auto Section

- **Item**: "Auto" with toggle switch (on state)
- **Height**: 32px
- **Padding**: 8px horizontal

##### Premium Section

- **Header**: "Premium" (14px, semi-bold)
- **Items**:
  - ChatGPT 5.2 Thinking - Progress indicator (25%, green)
  - Claude Opus 4.5 - Progress indicator (75%, red)
  - Google Gemini 3.5 Pro - Progress indicator (50%, yellow)
- **Item height**: 32px
- **Progress indicators**: 16x16px radial progress circles

##### Default Section

- **Divider**: 8px height, subtle gray
- **Header**: "Default" (14px, semi-bold)
- **Items**:
  - ChatGPT 4.0 Turbo
  - ChatGPT 5.1 Mini
- **Item height**: 32px

**Item States**:

- **Default**: transparent background
- **Hover**: rgba(38,104,197,0.05) background
- **Selected**: rgba(38,104,197,0.1) background, semi-bold text

**Progress Indicators**:

- **Circle**: 16x16px, 2px border
- **Colors**:
  - Green (#65BA74) for low usage (0-33%)
  - Yellow (#FFBA18) for medium usage (34-66%)
  - Red (#E5484D) for high usage (67-100%)
- **Border**: rgba(181,185,196,0.4) for unfilled portion

---

## Interactive Behaviors

### Sidebar Interactions

1. **Search Input**
   - Focus: Show cursor, highlight border
   - Type: Filter projects, skills, and chats in real-time
   - Clear: X button appears when text is entered

2. **Collapsible Sections**
   - Click chevron: Toggle expand/collapse with smooth animation
   - Click item name: Also toggles if it has children
   - Nested items: Slide in/out with 200ms transition

3. **Add Buttons (+)**
   - Hover: Background rgba(38,104,197,0.05)
   - Click: Open modal/form to add new item

4. **Chat List Items**
   - Click: Switch to that chat, update main area
   - Hover: Show background highlight
   - Active: Persistent highlight
   - Alert icon: Pulse animation for urgent items

5. **Settings Button**
   - Click: Open settings dropdown/modal

### Main Chat Area Interactions

1. **Temporary Chat Toggle**
   - Click: Toggle on/off with smooth transition
   - State persists during session

2. **Share & Export Button**
   - Click: Open dropdown menu with export options
   - Options: PDF, Markdown, Copy link, etc.

3. **Message Actions**
   - Copy: Copy message text to clipboard, show toast
   - Like/Dislike: Toggle state, send feedback
   - Share: Open share dialog
   - Regenerate: Request new response
   - More: Show additional options menu

4. **Table Interactions**
   - "Copy table" link: Copy table data to clipboard
   - Hover rows: Subtle highlight

### Input Area Interactions

1. **Textarea**
   - Auto-resize: Grow up to max height (200px)
   - Shift+Enter: New line
   - Enter: Send message (if not empty)
   - Placeholder: Disappear on focus

2. **Attach Button**
   - Click: Open file picker
   - Drag & drop: Accept files on textarea

3. **Deep Research Button**
   - Click: Toggle deep research mode
   - Active state: Primary color background

4. **Web Search Button**
   - Click: Toggle web search mode
   - Active state: Primary color background

5. **Model Selector**
   - Click: Open dropdown
   - Select model: Update button text, close dropdown
   - Click outside: Close dropdown

6. **Send Button**
   - Disabled: When textarea is empty (muted colors)
   - Enabled: Primary color
   - Click: Send message, clear textarea, show loading state
   - Loading: Show spinner in button

### Model Dropdown Interactions

1. **Auto Toggle**
   - Click: Toggle auto mode on/off
   - When on: Disable manual model selection

2. **Model Selection**
   - Click item: Select model, close dropdown
   - Show checkmark: On selected item
   - Progress indicators: Update in real-time

3. **Hover States**
   - Items: Background highlight
   - Progress circles: Show tooltip with percentage

---

## State Management Requirements

### Application State

```typescript
interface ChatState {
  // Sidebar
  searchQuery: string;
  expandedProjects: string[];
  expandedSkills: string[];
  activeChat: string;
  chats: Chat[];
  projects: Project[];
  skills: Skill[];

  // Main area
  messages: Message[];
  isTyping: boolean;
  tempChatEnabled: boolean;

  // Input
  inputValue: string;
  attachedFiles: File[];
  deepResearchEnabled: boolean;
  webSearchEnabled: boolean;
  selectedModel: string;
  autoModelEnabled: boolean;

  // UI
  modelDropdownOpen: boolean;
  shareDropdownOpen: boolean;
}

interface Chat {
  id: string;
  title: string;
  hasAlert: boolean;
  lastActivity: Date;
}

interface Message {
  id: string;
  type: 'user' | 'ai' | 'loading';
  content: string | TableData;
  timestamp: Date;
  actions?: MessageAction[];
}

interface Project {
  id: string;
  name: string;
  children?: Project[];
  expanded: boolean;
}
```

### Animation Timings

- **Sidebar collapse/expand**: 200ms ease-in-out
- **Dropdown open/close**: 150ms ease-out
- **Button hover**: 100ms ease
- **Message appear**: 300ms fade-in + slide-up
- **Typing indicator**: Continuous bounce animation
- **Progress circles**: 500ms ease for updates

---

## Mock Data Requirements

1. **Chat History**: 10-15 sample chats with varied timestamps
2. **Projects**: 3-5 top-level projects with nested items
3. **Skills**: 3-5 skill categories
4. **Messages**: Sample conversation with:
   - User questions
   - AI responses with tables
   - Loading states
   - Various message types
5. **Models**: List of AI models with usage percentages
6. **Sample Tables**: Feedback triage data, statistics, etc.

---

## Accessibility Requirements

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Arrow keys in dropdowns
   - Escape to close modals/dropdowns

2. **Screen Reader Support**
   - ARIA labels on all icons
   - ARIA live regions for messages
   - Role attributes for custom components

3. **Focus Management**
   - Visible focus indicators
   - Focus trap in modals
   - Return focus after dropdown close

4. **Color Contrast**
   - All text meets WCAG AA standards
   - Interactive elements clearly distinguishable
