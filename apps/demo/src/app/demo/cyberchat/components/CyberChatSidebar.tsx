import { useMemo } from 'react'
import {
  Avatar,
  AvatarFallback,
  Button,
  Input,
  ScrollArea,
} from '@acronis-platform/shadcn-uikit/react'
import { SearchIcon, PlusIcon } from '@acronis-platform/shadcn-uikit'
import { useCyberChatStore } from '../store/useCyberChatStore'
import { CollapsibleTree } from './CollapsibleTree'
import { ChatListItem } from './ChatListItem'
import { SettingsDialog } from './SettingsDialog'
import { filterBySearchQuery } from '../utils/helpers'

export function CyberChatSidebar() {
  const {
    searchQuery,
    setSearchQuery,
    projects,
    skills,
    chats,
    activeChat,
    expandedProjects,
    expandedSkills,
    toggleProjectExpanded,
    toggleSkillExpanded,
    setActiveChat,
  } = useCyberChatStore()

  const filteredProjects = useMemo(
    () => filterBySearchQuery(projects, searchQuery, ['name']),
    [projects, searchQuery]
  )

  const filteredSkills = useMemo(
    () => filterBySearchQuery(skills, searchQuery, ['name']),
    [skills, searchQuery]
  )

  const filteredChats = useMemo(
    () => filterBySearchQuery(chats, searchQuery, ['title', 'preview']),
    [chats, searchQuery]
  )

  return (
    <div className="w-64 border-r border-border/50 bg-card/30 flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="text-xl font-light text-primary">Acronis</div>
          <div className="text-xl font-light text-foreground">CyberChat</div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-background"
          />
        </div>
      </div>

      {/* Projects Section */}
      <div className="border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Projects</h3>
          <Button
            variant="default"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              // TODO: Open add project dialog
              console.log('Add project')
            }}
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
        {filteredProjects.length > 0 && (
          <div className="px-2 pb-2">
            <CollapsibleTree
              items={filteredProjects}
              expandedIds={expandedProjects}
              onToggle={toggleProjectExpanded}
              searchQuery={searchQuery}
            />
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Skills</h3>
          <Button
            variant="default"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              // TODO: Open add skill dialog
              console.log('Add skill')
            }}
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
        {filteredSkills.length > 0 && (
          <div className="px-2 pb-2">
            <CollapsibleTree
              items={filteredSkills}
              expandedIds={expandedSkills}
              onToggle={toggleSkillExpanded}
              searchQuery={searchQuery}
            />
          </div>
        )}
      </div>

      {/* Recent Chats */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <h3 className="text-sm font-semibold text-foreground">Recent chats</h3>
          <Button
            variant="default"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              // TODO: Open new chat dialog
              console.log('New chat')
            }}
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChat}
                onClick={() => setActiveChat(chat.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">JB</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Jorge Borloni</p>
          </div>
          <SettingsDialog />
        </div>
      </div>
    </div>
  )
}
