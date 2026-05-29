import { useState } from 'react'
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Progress,
  ScrollArea,
  Separator,
  Switch,
} from '@acronis-platform/shadcn-uikit/react'
import {
  SendIcon,
  RotateIcon,
  ClockIcon,
  CopyIcon,
  EllipsisHIcon,
  PlusIcon,
  SettingsIcon,
  SearchIcon,
  ChevronDownIcon,
  FileTextIcon,
  GlobeIcon,
} from '@acronis-platform/shadcn-uikit'
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  Share2Icon,
  BrainIcon,
} from '@/components/icons/missing-icons'

export const ChatComponentsShowcase: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false)
  const [message, setMessage] = useState('')
  const [tempChatEnabled, setTempChatEnabled] = useState(true)

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-2xl font-bold my-2">CyberChat Components Showcase</h3>
        <p className="text-sm text-muted-foreground">
          All components used in the CyberChat application, demonstrating the
          cyber-chat theme.
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Buttons</h3>
        <p className="text-sm text-muted-foreground">
          Various button variants and sizes used in chat interface
        </p>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Icon Buttons - Default (36x36px)
              </p>
              <div className="flex gap-3">
                <Button size="icon" className="h-9 w-9">
                  <PlusIcon className="h-5 w-5" />
                </Button>
                <Button size="icon" className="h-9 w-9">
                  <SendIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" className="h-9 w-9">
                  <SettingsIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Icon Buttons - Outline (36x36px)
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <GlobeIcon className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <BrainIcon className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <FileTextIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Small Icon Buttons (24x24px)
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="h-6 w-6">
                  <SearchIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <PlusIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <SettingsIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Buttons with Icons
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Model: Auto
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  Share & Export
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Link Button</p>
              <Button variant="link" className="h-auto p-0 text-primary">
                Copy table
              </Button>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Ghost Icon Buttons (24x24px)
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <CopyIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ThumbsUpIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ThumbsDownIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Share2Icon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <RotateIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <EllipsisHIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Switch</h3>
        <p className="text-sm text-muted-foreground">
          Toggle switch for temporary chat mode
        </p>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={tempChatEnabled}
                onCheckedChange={setTempChatEnabled}
              />
              <span className="text-sm">Temporary chat</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Input Fields</h3>
        <p className="text-sm text-muted-foreground">
          Search and message input components
        </p>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Search Input</p>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 h-9" />
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Message Input Area
              </p>
              <div className="relative border border-border rounded-2xl bg-background p-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything"
                  className="w-full min-h-[64px] resize-none bg-transparent text-sm focus:outline-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <FileTextIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <BrainIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <GlobeIcon className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Model: Auto
                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="icon" className="h-9 w-9">
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Avatars</h3>
        <p className="text-sm text-muted-foreground">
          User and AI avatars in different sizes
        </p>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Standard Avatars (32x32px)
              </p>
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">JB</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">AI</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    U
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Small Avatars (24x24px)
              </p>
              <div className="flex gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">AI</AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">JB</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Progress</h3>
        <p className="text-sm text-muted-foreground">
          Progress indicators for loading states
        </p>
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing</span>
                <span className="text-muted-foreground">13%</span>
              </div>
              <Progress value={13} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing</span>
                <span className="text-muted-foreground">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Badges</h3>
        <p className="text-sm text-muted-foreground">
          Custom badges with icons for sources and metadata
        </p>
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Source Badge with Icon
              </p>
              <Badge className="gap-1 rounded-full px-3 py-1">
                <GlobeIcon className="h-3 w-3" />
                google.../ai+nl
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Standard Badges
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  Source: Web
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Confidence: High
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Icons</h3>
        <p className="text-sm text-muted-foreground">
          Icon sizes used throughout the interface
        </p>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="border border-border rounded-md p-2 inline-block">
                  <SearchIcon className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">16px</p>
              </div>
              <div className="text-center">
                <div className="border border-border rounded-md p-2 inline-block">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">20px</p>
              </div>
              <div className="text-center">
                <div className="border border-border rounded-md p-2 inline-block">
                  <SearchIcon className="h-6 w-6" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">24px</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Feed Items</h3>
        <p className="text-sm text-muted-foreground">
          Custom feed components showing AI processing states
        </p>
        <div className="space-y-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <RotateIcon className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-sm">Gathering info</p>
                  <p className="text-sm text-muted-foreground">
                    I&apos;m gathering info on triaging customer feedback for
                    SaaS software, focusing on feedback collection,
                    categorization, prioritization, and the use of modern
                    frameworks and AI/NLP solutions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">AI</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-sm">Response</p>
                  <p className="text-sm text-muted-foreground">
                    Based on the information gathered, here are the key aspects
                    of triaging customer feedback for SaaS applications...
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Source: Web
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Confidence: High
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <p className="text-sm">
                    Can you provide more details about AI/NLP solutions for
                    categorization?
                  </p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Sidebar Preview</h3>
        <p className="text-sm text-muted-foreground">
          256px sidebar with chat list and user profile
        </p>
        <Card className="w-64">
          <CardContent className="p-0">
            <div className="flex flex-col h-[500px]">
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-lg font-light text-primary">Acronis</div>
                  <div className="text-lg font-light">CyberChat</div>
                </div>
              </div>

              <div className="p-3 border-b border-border/50">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 h-9" />
                </div>
              </div>

              <div className="border-b border-border/50">
                <div className="flex items-center justify-between px-4 py-3">
                  <h4 className="text-sm font-semibold">Recent chats</h4>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 px-2">
                <div className="space-y-1 py-2">
                  {[
                    {
                      title: 'Customer feedback triage',
                      active: true,
                      hasAlert: true,
                    },
                    {
                      title: 'Sales follow-up',
                      active: false,
                      hasAlert: false,
                    },
                    {
                      title: 'Marketing strategy',
                      active: false,
                      hasAlert: false,
                    },
                  ].map((chat, i) => (
                    <button
                      key={i}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors relative ${
                        chat.active
                          ? 'bg-accent/70 text-accent-foreground'
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-normal truncate pr-2">
                          {chat.title}
                        </span>
                        {chat.hasAlert && (
                          <ClockIcon className="h-4 w-4 flex-shrink-0 text-destructive" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">JB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Jorge Borloni
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Features</h3>
        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Typing Indicator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsTyping(!isTyping)}
                >
                  Toggle Typing
                </Button>
                {isTyping && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                    </div>
                    <span>AI is typing...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">User Avatars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>JB</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AI
                  </AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-success text-success-foreground">
                    ✓
                  </AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">SM</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Message Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Message sent</span>
                <span className="text-muted-foreground">2:30 PM</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Last active</span>
                <span className="text-muted-foreground">5 minutes ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Session started</span>
                <span className="text-muted-foreground">Today at 2:15 PM</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Data Table</h3>
        <p className="text-sm text-muted-foreground">
          Table component for displaying structured data
        </p>
        <Card>
          <CardContent className="pt-6">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Category</th>
                    <th className="text-left p-3 font-semibold">Count</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-right p-3 font-semibold">
                      Estimated time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/50">
                    <td className="p-3">Delivery</td>
                    <td className="p-3">5</td>
                    <td className="p-3 text-muted-foreground">
                      Tracking requests
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      1 h
                    </td>
                  </tr>
                  <tr className="border-t border-border/50">
                    <td className="p-3">Billing</td>
                    <td className="p-3">4</td>
                    <td className="p-3 text-muted-foreground">
                      Invoice copies
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      48 min
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
