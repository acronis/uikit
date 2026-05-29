/**
 * AI Service for generating realistic chat responses
 * This is a demo implementation that generates contextual responses
 * based on keywords and patterns in the user's input
 */

type BadgeVariant = 'default' | 'outline' | 'secondary'

interface AIResponse {
  content: string
  badges?: Array<{ text: string; variant?: BadgeVariant }>
}

/**
 * Generate a realistic AI response based on user input
 */
export async function generateAIResponse(userMessage: string): Promise<AIResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

  const lowerMessage = userMessage.toLowerCase()

  // Contextual responses based on keywords
  if (lowerMessage.includes('feedback') || lowerMessage.includes('triage')) {
    const responses: AIResponse[] = [
      {
        content: `Okay so customer feedback triage - this is actually fascinating because most companies completely mess this up. Let me break down what actually works:

The RICE framework is your friend here. Reach × Impact × Confidence ÷ Effort. Sounds simple but people forget the Confidence part and end up chasing shiny features that nobody wants.

Here's what I've seen work in practice:
- Tag everything immediately (bug, feature, improvement, question)
- Use sentiment analysis to catch the angry customers first
- Weekly triage meetings, not daily - daily is overkill
- The Kano Model helps separate "must-haves" from "delighters"

The HEART framework (Happiness, Engagement, Adoption, Retention, Task Success) is great for measuring impact after you ship. Don't sleep on it.

Oh and if you're dealing with scale, definitely look into automated categorization with NLP. We're talking BERT models fine-tuned on your domain. Game changer.

What's your current volume looking like? That'll determine if you need the fancy ML stuff or can stick with manual tagging.`,
        badges: [{ text: 'Product Management', variant: 'outline' }],
      },
      {
        content: `Customer feedback triage! Right, so this is one of those things that seems straightforward until you actually try to do it at scale.

First off - RICE prioritization. Everyone talks about it, fewer people actually use it correctly. The formula is (Reach × Impact × Confidence) / Effort. The Confidence score is what separates good PMs from great ones.

Real talk though? The frameworks are just tools. What matters is:

1. Speed of initial categorization (automate this if you can)
2. Consistent severity levels across your team
3. Actually closing the loop with customers who gave feedback

For the ML/AI angle - sentiment analysis is table stakes now. You can use pre-trained models or fine-tune on your data. I'd recommend starting with something like DistilBERT for classification, it's fast and good enough for most use cases.

The Kano Model is underrated for understanding which features will actually move the needle vs which ones customers just expect to work.

Are you building this from scratch or integrating with existing tools?`,
        badges: [{ text: 'AI/ML', variant: 'outline' }],
      },
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (lowerMessage.includes('security') || lowerMessage.includes('cybersecurity')) {
    const responses: AIResponse[] = [
      {
        content: `Cybersecurity in 2025 is wild. Zero Trust isn't just a buzzword anymore - it's basically mandatory if you're handling any sensitive data.

The core idea: never trust, always verify. Every request gets authenticated and authorized, even if it's coming from inside your network. Because let's be honest, the perimeter is dead. Everyone's remote, everything's in the cloud.

Defense in depth is still your best friend - multiple layers so if one fails, you're not completely screwed. Think endpoint protection, network segmentation, application firewalls, the whole stack.

MFA everywhere. Non-negotiable. And I mean real MFA, not SMS codes (those can be SIM-swapped). Use authenticator apps or hardware keys.

The scary stuff right now? AI-powered attacks are getting sophisticated. Supply chain compromises (remember SolarWinds?). Cloud misconfigurations - seriously, so many breaches are just S3 buckets left open.

Ransomware is evolving too. It's not just encryption anymore, they're exfiltrating data first for double extortion.

What's your threat model? Enterprise, startup, personal?`,
        badges: [{ text: 'Security', variant: 'outline' }],
      },
      {
        content: `Security! Okay so the landscape has changed a lot. Zero Trust Architecture is the new standard - basically assume everything is compromised until proven otherwise.

Key things to focus on:
- MFA on everything (and I mean EVERYTHING)
- Encrypt data at rest and in transit
- Regular pen testing and security audits
- Have an actual incident response plan (not just "we'll figure it out")
- Security awareness training for your team (humans are always the weakest link)

The threat landscape is getting nastier. AI-powered attacks can now bypass traditional detection. Supply chain attacks are huge - attackers compromise a vendor to get to you. Cloud misconfigs are still the #1 cause of breaches (seriously, check your S3 buckets).

Ransomware groups are now doing double extortion - encrypt your data AND threaten to leak it if you don't pay.

Defense in depth is your strategy - multiple layers of security so a single failure doesn't sink you. Endpoint, network, application, data - protect at every level.

What specific area are you most concerned about?`,
        badges: [{ text: 'Best Practices', variant: 'outline' }],
      },
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (lowerMessage.includes('design') || lowerMessage.includes('ui') || lowerMessage.includes('ux')) {
    const responses: AIResponse[] = [
      {
        content: `UI/UX design right now is all about systems thinking. You can't just design screens anymore - you need a whole design system or you'll end up with inconsistent garbage.

User-centered design sounds obvious but most teams skip the research part and jump straight to wireframes. Bad move. Talk to actual users first. Build personas. Map their journeys. Find the pain points BEFORE you start designing.

Visual hierarchy is your secret weapon. Size, color, spacing - use them to guide attention. If everything is emphasized, nothing is emphasized. Learn this or your designs will be chaotic.

Accessibility isn't optional anymore. WCAG 2.1 AA is the baseline. 4.5:1 contrast ratio for text, keyboard navigation, screen reader support, visible focus indicators. It's not just about compliance - it makes your product better for everyone.

Current trends worth following:
- Design systems (Figma + Storybook combo is chef's kiss)
- Dark mode (but do it right, not just inverted colors)
- Micro-interactions that feel good
- Responsive design that actually adapts, not just scales

Tailwind CSS has changed the game for implementation. Utility-first styling means designers and devs speak the same language.

What are you building?`,
        badges: [{ text: 'Design', variant: 'outline' }],
      },
      {
        content: `Design! Okay so modern UI/UX is way more sophisticated than it used to be.

First principle: user-centered design. Sounds basic but you'd be surprised how many teams skip this. Do the research. Build personas. Map user journeys. Test early and often. Your assumptions are probably wrong.

Visual hierarchy - this is what separates good designers from great ones. Use size, color, whitespace to create a clear path for the eye. Every element should have a purpose in the hierarchy.

Accessibility is non-negotiable now. WCAG guidelines exist for a reason:
- 4.5:1 contrast minimum for normal text
- Keyboard navigation for everything
- Screen reader compatibility
- Proper focus states

The tooling has gotten so good. Figma for collaboration, design systems for consistency, Tailwind for implementation. If you're not using a design system yet, start building one.

Dark mode is expected now, not a nice-to-have. But do it properly - don't just invert colors, rethink the whole palette.

Micro-interactions matter more than you think. That little animation when you click a button? It makes the UI feel alive.

Are you designing for web, mobile, or both?`,
        badges: [{ text: 'UX', variant: 'outline' }],
      },
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('development')) {
    const responses: AIResponse[] = [
      {
        content: `Development best practices! Alright, let's talk about what actually matters vs what people argue about on Twitter.

Clean code is real. Meaningful names, small functions, self-documenting code. If you need comments to explain what your code does, your code isn't clear enough. (Exception: WHY something is done, not WHAT it does.)

SOLID principles are good guidelines but don't be dogmatic. Single Responsibility is gold. The others... use them when they make sense, not because you memorized the acronym.

Testing pyramid: lots of unit tests, some integration tests, few e2e tests. Unit tests are fast and catch most bugs. Integration tests catch the stuff that breaks when things connect. E2e tests are slow but test real user flows.

Modern dev workflow:
- Git for version control (learn rebase, your history will thank you)
- CI/CD pipelines (automate everything you can)
- Code reviews (best way to share knowledge and catch bugs)
- Pair programming for complex stuff
- Document your APIs properly (OpenAPI/Swagger is your friend)

Current tech stacks that don't suck:
- Frontend: React/Next.js with TypeScript (or Vue if that's your thing)
- Backend: Node.js, Python (FastAPI is great), or Go for performance
- Database: PostgreSQL for relational, MongoDB if you really need document store, Redis for caching

What are you building?`,
        badges: [{ text: 'Development', variant: 'outline' }],
      },
      {
        content: `Software development! Let's cut through the noise and talk about what actually works.

Clean code isn't about being fancy - it's about being clear. Name things well. Keep functions small and focused. If your function does more than one thing, split it up. Future you will be grateful.

SOLID principles are useful but don't worship them. Single Responsibility Principle is probably the most important - one class/function should have one reason to change. The rest are good guidelines but use judgment.

Testing: write tests. Seriously. Unit tests for your functions, integration tests for your APIs, e2e tests for critical user flows. The testing pyramid is real - lots of unit tests, fewer integration tests, even fewer e2e tests.

Version control: Git. Learn it properly. Commit messages should explain WHY, not what (the diff shows what). Use branches. Rebase to keep history clean.

CI/CD is not optional anymore. Automate your builds, tests, and deployments. If you're manually deploying in 2025, you're doing it wrong.

Code reviews are gold. They catch bugs, share knowledge, and improve code quality. Don't skip them.

Tech stack recommendations:
- TypeScript > JavaScript (the type safety is worth it)
- React/Next.js or Vue for frontend
- Node.js, Python, or Go for backend
- PostgreSQL for most use cases, Redis for caching

What's your stack looking like?`,
        badges: [{ text: 'Best Practices', variant: 'outline' }],
      },
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // ELIZA-style responses for unknown messages
  return generateElizaResponse(userMessage)
}

/**
 * Generate ELIZA-style conversational responses
 * Based on classic pattern matching and reflection techniques
 */
function generateElizaResponse(input: string): AIResponse {
  const lowerInput = input.toLowerCase()

  // Pattern: "I am/I'm ..."
  if (lowerInput.match(/\b(i am|i'm)\b/)) {
    const responses = [
      `How long have you been ${input.toLowerCase().replace(/.*\b(i am|i'm)\s+/, '')}?`,
      `Why do you tell me you're ${input.toLowerCase().replace(/.*\b(i am|i'm)\s+/, '')}?`,
      `Do you believe it's normal to be ${input.toLowerCase().replace(/.*\b(i am|i'm)\s+/, '')}?`,
    ]
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
    }
  }

  // Pattern: "I feel ..."
  if (lowerInput.match(/\bi feel\b/)) {
    return {
      content: `Tell me more about these feelings. What makes you feel this way?`,
    }
  }

  // Pattern: "I need ..."
  if (lowerInput.match(/\bi need\b/)) {
    const need = input.toLowerCase().replace(/.*\bi need\s+/, '')
    return {
      content: `Why do you need ${need}? What would having ${need} mean to you?`,
    }
  }

  // Pattern: "Why ..."
  if (lowerInput.startsWith('why')) {
    return {
      content: `That's an interesting question. Why do you think that might be? What's your intuition telling you?`,
    }
  }

  // Pattern: "Can you ..."
  if (lowerInput.match(/\bcan you\b/)) {
    return {
      content: `I can certainly try to help. What specific aspect would you like me to focus on? The more details you provide, the better I can assist you.`,
    }
  }

  // Pattern: Questions with "what", "how", "when", "where"
  if (lowerInput.match(/\b(what|how|when|where)\b/)) {
    const responses = [
      `That's a thoughtful question. Let me help you explore this. Could you provide more context about what you're trying to achieve?`,
      `Interesting question! To give you the most relevant answer, could you tell me more about your specific situation or use case?`,
      `I'd be happy to help with that. What's the broader context? Understanding your goals will help me provide better guidance.`,
    ]
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
    }
  }

  // Pattern: Short inputs (1-3 words)
  if (input.trim().split(/\s+/).length <= 3) {
    const responses = [
      `Could you elaborate on that? I'd like to understand better so I can provide more helpful insights.`,
      `Tell me more about what you mean by "${input}". What specific aspect interests you?`,
      `That's quite concise! Could you expand on what you'd like to know about "${input}"?`,
    ]
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
    }
  }

  // Default conversational response
  const defaultResponses = [
    {
      content: `I understand you're asking about: "${input}"

I can help you with:
- **Analysis and Research** - Deep dive into topics with structured insights
- **Best Practices** - Industry standards and recommendations
- **Technical Guidance** - Implementation strategies and frameworks
- **Problem Solving** - Breaking down complex challenges

Could you provide more details about what specific aspect you'd like to explore? For example:
- What's your main goal or challenge?
- Are you looking for strategic guidance or technical implementation?
- Do you have any specific constraints or requirements?

I'm here to provide detailed, actionable insights tailored to your needs.`,
    },
    {
      content: `That's an interesting topic! To give you the most relevant response, could you help me understand:

**What's your context?**
- Are you exploring this for a project, learning, or solving a specific problem?
- What's your current level of familiarity with this topic?

**What's your goal?**
- Are you looking for an overview, detailed implementation, or best practices?
- Do you have any specific constraints or requirements?

The more context you provide, the more tailored and useful my response can be!`,
    },
    {
      content: `I'd love to help you with that! Let me ask a few clarifying questions to ensure I give you the most relevant information:

**Scope:**
- Are you looking for a high-level overview or detailed technical guidance?
- Is this for a specific use case or general understanding?

**Background:**
- What do you already know about this topic?
- What's prompted this question?

Feel free to share as much or as little as you'd like - I'll adapt my response accordingly!`,
    },
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}
