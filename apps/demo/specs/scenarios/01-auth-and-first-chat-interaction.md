# Scenario 01 — Authentication and First Chat Interaction

## Overview

This scenario describes the primary “happy path” user flow from the authentication screen to sending the first message in chat, then enabling Web search.

## References (Figma)

- **Sign in screen (form):** https://www.figma.com/design/VY9X9tJHZDu7MZvB4VoZjL/CyberChat-Concept--1?node-id=467-1019
- **Post sign-in landing screen:** https://www.figma.com/design/VY9X9tJHZDu7MZvB4VoZjL/CyberChat-Concept--1?node-id=448-182
- **Suggestion chips (“Not sure where to start”) interaction:** https://www.figma.com/design/VY9X9tJHZDu7MZvB4VoZjL/CyberChat-Concept--1?node-id=451-397
- **Chat after sending message (assistant response rendered):** https://www.figma.com/design/VY9X9tJHZDu7MZvB4VoZjL/CyberChat-Concept--1?node-id=441-862
- **Web search toggle enabled (results pending):** https://www.figma.com/design/VY9X9tJHZDu7MZvB4VoZjL/CyberChat-Concept--1?node-id=527-13510

## Preconditions

- The user has access to the application.
- The Sign in screen is displayed.

## Scenario Steps

### 1) Sign in with arbitrary credentials

- **User action**
  - Enter any email address into the email field.
  - Enter any password into the password field.
  - Click the **Sign in** button.

- **Expected result**
  - The application navigates to the post sign-in landing screen.

### 2) Choose a suggested prompt

- **User action**
  - In the section **Not sure where to start**, click the first suggestion chip.

- **Expected result**
  - The selected chip text is inserted into the message input field.
  - The message input receives focus (becomes active).

### 3) Send the message

- **User action**
  - Click **Send**.

- **Expected result**
  - The chat view transitions into the “active conversation” state.
  - The user message is displayed in the conversation.
  - An assistant response is displayed as shown in the design.

### 4) Enable Web search

- **User action**
  - Select **Web search**.

- **Expected result**
  - The Web search control switches to the enabled/active visual state as shown in the design.
  - The conversation updates to include Web search results.

## Notes / Open Items

- Web search results layout and content are pending an updated design screenshot.
