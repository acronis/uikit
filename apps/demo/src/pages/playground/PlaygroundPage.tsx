import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlaygroundStore } from '@/store/playground/playgroundStore.ts'
import { applyTokenSet, applyTypographySettings, TypographySettings } from '@/lib/playground/cssVariables.ts'
import { ThemeMode } from '@/types/playground/index.ts'
import { ThemeSwitcher } from '@/components/playground/ThemeSwitcher.tsx'
import { TokenSelector } from '@/components/playground/TokenSelector.tsx'
import { TokenEditor } from '@/components/playground/TokenEditor.tsx'
import { TypographyEditor } from '@/components/playground/TypographyEditor.tsx'
import { ComponentShowcase } from '@/components/playground/ComponentShowcase.tsx'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@acronis-platform/shadcn-uikit/react'
import { ChatComponentsShowcase } from '@/components/playground/ChatComponentsShowcase.tsx'
import { ChartsShowcase } from '@/components/playground/ChartsShowcase.tsx';
import { AppLayout } from '@/app/layout/AppLayout.tsx';
import { LocaleProvider } from '@/app/context/LocaleContext';
import { AuthProvider } from '@/app/context/AuthContext';

import { ArrowLeftIcon } from '@acronis-platform/shadcn-uikit'
const PlaygroundPage: React.FC = () => {
  const { theme, activeTokenSetId, tokenSets, customTokenSet } = usePlaygroundStore()
  const [activeTab, setActiveTab] = useState('components')

  // Initialize typography settings on mount
  useEffect(() => {
    const DEFAULT_TYPOGRAPHY: TypographySettings = {
      fontFamily: 'system-ui',
      fontFamilyStack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.5',
      letterSpacing: '0',
    }

    const stored = localStorage.getItem('playground-typography')
    let settings = DEFAULT_TYPOGRAPHY

    if (stored) {
      try {
        settings = JSON.parse(stored)
      } catch {
        settings = DEFAULT_TYPOGRAPHY
      }
    }

    applyTypographySettings(settings)
  }, [])

  useEffect(() => {
    const activeTokenSet = customTokenSet || tokenSets[activeTokenSetId]
    if (activeTokenSet) {
      const effectiveTheme =
        theme.mode === ThemeMode.SYSTEM
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? ThemeMode.DARK
            : ThemeMode.LIGHT
          : theme.mode
      applyTokenSet(activeTokenSet, effectiveTheme)
    }
  }, [theme, activeTokenSetId, tokenSets, customTokenSet])

  return (
    <div className="playground-page h-screen bg-background text-foreground flex flex-col">
      <header className="flex-shrink-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Components
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold">Theme Playground</h1>
                <p className="text-xs text-muted-foreground">
                  Customize and preview your design tokens
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TokenSelector />
              <ThemeSwitcher showLabel />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel
            id="token-editor"
            defaultSize={40}
            minSize={20}
            collapsible={false}
          >
            <section className="bg-background overflow-y-auto h-full">
              <Tabs defaultValue="tokens" className="h-full flex flex-col">
                <div className="flex-shrink-0 p-6 pb-4 border-b border-border">
                  <div className="max-w-3xl mx-auto space-y-4">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">
                        Design System
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Customize colors, typography, and other design tokens
                      </p>
                    </div>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="tokens">Tokens</TabsTrigger>
                      <TabsTrigger value="typography">Typography</TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-3xl mx-auto">
                    <TabsContent value="tokens" className="mt-0">
                      <TokenEditor />
                    </TabsContent>
                    <TabsContent value="typography" className="mt-0">
                      <TypographyEditor />
                    </TabsContent>
                  </div>
                </div>
              </Tabs>
            </section>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            id="component-preview"
            defaultSize={60}
            minSize={30}
            collapsible={false}
          >
            <section className="bg-muted/30 flex flex-col h-full overflow-y-auto">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex flex-col h-full"
              >
                <div className="flex-shrink-0 p-6 pb-4 border-b border-border">
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">
                        Component Preview
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        See how your tokens affect all components in real-time
                      </p>
                    </div>

                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="components">Components</TabsTrigger>
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger value="showcase3">
                        Demo
                      </TabsTrigger>
                      <TabsTrigger value="showcase4">
                        Charts
                      </TabsTrigger>
                      <TabsTrigger value="showcase5" disabled>
                        Showcase 5
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  <div className="max-w-4xl mx-auto">
                    <TabsContent value="components" className="mt-0">
                      <ComponentShowcase />
                    </TabsContent>
                    <TabsContent value="chat" className="mt-0">
                      <ChatComponentsShowcase />
                    </TabsContent>
                    <TabsContent value="showcase3" className="mt-0">
                      <LocaleProvider>

                        <AuthProvider>
                        <AppLayout />
                        </AuthProvider>
                      </LocaleProvider>
                    </TabsContent>
                    <TabsContent value="showcase4" className="mt-0">
                      <ChartsShowcase />
                    </TabsContent>
                    <TabsContent value="showcase5" className="mt-0">
                      <div className="text-center text-muted-foreground py-8">
                        Showcase 5 - Coming soon
                      </div>
                    </TabsContent>
                  </div>
                </div>
              </Tabs>
            </section>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}

export { PlaygroundPage }
