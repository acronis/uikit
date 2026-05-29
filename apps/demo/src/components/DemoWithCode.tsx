import * as React from 'react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { CheckIcon, ChevronDownIcon, CopyIcon } from '@acronis-platform/shadcn-uikit'
interface DemoWithCodeProps {
  title: string
  description?: string
  children: React.ReactNode
  code: string
  defaultExpanded?: boolean
}

export function DemoWithCode({ 
  title, 
  description, 
  children, 
  code,
  defaultExpanded = false 
}: DemoWithCodeProps) {
  const [copied, setCopied] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Custom style that adapts to the theme
  const customStyle = {
    margin: 0,
    padding: '1rem',
    background: 'transparent',
    fontSize: '0.75rem',
    lineHeight: '1.5',
    maxHeight: '500px',
    overflow: 'auto',
  }

  return (
    <div className="demo-item space-y-4">
      <div>
        <h3>{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
      </div>
      
      <div className="space-y-3">
        {/* Demo Preview */}
        <div className="p-6 rounded-lg border border-border bg-background">
          {children}
        </div>

        {/* Code Section */}
        <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <span className="text-muted-foreground">View Code</span>
            <ChevronDownIcon 
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {isExpanded && (
            <div className="border-t border-border">
              <div className="relative bg-[#1e1e1e]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="absolute right-2 top-2 h-7 px-2 z-10 bg-black/20 hover:bg-black/40 text-white"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </Button>
                <SyntaxHighlighter
                  language="tsx"
                  style={vscDarkPlus}
                  customStyle={customStyle}
                  showLineNumbers={false}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
