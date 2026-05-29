import * as React from 'react'
import { ChevronRightIcon, ChevronDownIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { Checkbox } from './checkbox'

export interface TreeNode {
  id: string
  label: string
  icon?: React.ReactNode
  children?: TreeNode[]
}

interface TreeItemProps {
  node: TreeNode
  level?: number
  expanded?: boolean
  selected?: boolean
  showCheckbox?: boolean
  showIcon?: boolean
  onToggle?: (id: string) => void
  onSelect?: (id: string) => void
  onCheck?: (id: string, checked: boolean) => void
  expandedNodes?: Set<string>
  selectedNodes?: Set<string>
  checkedNodes?: Set<string>
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      node,
      level = 0,
      showCheckbox = false,
      showIcon = false,
      onToggle,
      onSelect,
      onCheck,
      expandedNodes,
      selectedNodes,
      checkedNodes,
    },
    ref
  ) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes?.has(node.id) ?? false
    const isSelected = selectedNodes?.has(node.id) ?? false
    const isChecked = checkedNodes?.has(node.id) ?? false

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (hasChildren && onToggle) {
        onToggle(node.id)
      }
    }

    const handleSelect = () => {
      if (onSelect) {
        onSelect(node.id)
      }
    }

    const handleCheck = (checked: boolean | 'indeterminate') => {
      if (onCheck && typeof checked === 'boolean') {
        onCheck(node.id, checked)
      }
    }

    return (
      <div ref={ref}>
        <div
          className={cn(
            'flex items-center gap-4 px-4 py-2 cursor-pointer transition-colors',
            'hover:bg-[hsl(var(--tree-item-hover)/0.05)]',
            isSelected && 'bg-[hsl(var(--tree-item-selected)/0.1)]'
          )}
          style={{ paddingLeft: `${level * 32 + 16}px` }}
          onClick={handleSelect}
        >
          {hasChildren ? (
            <button
              onClick={handleToggle}
              className="flex items-center justify-center w-4 h-4 text-[hsl(var(--tree-icon))] hover:opacity-80"
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-4 h-4" />
          )}

          {showCheckbox && (
            <Checkbox
              checked={isChecked}
              onCheckedChange={handleCheck}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {showIcon && node.icon && <div className="flex items-center">{node.icon}</div>}

          <span className="text-sm text-[hsl(var(--tree-text))] leading-6">{node.label}</span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children?.map((child) => (
              <TreeItem
                key={child.id}
                node={child}
                level={level + 1}
                showCheckbox={showCheckbox}
                showIcon={showIcon}
                onToggle={onToggle}
                onSelect={onSelect}
                onCheck={onCheck}
                expandedNodes={expandedNodes}
                selectedNodes={selectedNodes}
                checkedNodes={checkedNodes}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)
TreeItem.displayName = 'TreeItem'

export interface TreeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultChecked'> {
  data: TreeNode[]
  showCheckbox?: boolean
  showIcon?: boolean
  defaultExpanded?: string[]
  defaultSelected?: string[]
  defaultChecked?: string[]
  onNodeToggle?: (id: string) => void
  onNodeSelect?: (id: string) => void
  onNodeCheck?: (id: string, checked: boolean) => void
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      showCheckbox = false,
      showIcon = false,
      defaultExpanded = [],
      defaultSelected = [],
      defaultChecked = [],
      onNodeToggle,
      onNodeSelect,
      onNodeCheck,
      className,
      ...props
    },
    ref
  ) => {
    const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set(defaultExpanded))
    const [selectedNodes, setSelectedNodes] = React.useState<Set<string>>(new Set(defaultSelected))
    const [checkedNodes, setCheckedNodes] = React.useState<Set<string>>(new Set(defaultChecked))

    const handleToggle = (id: string) => {
      setExpandedNodes((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
      onNodeToggle?.(id)
    }

    const handleSelect = (id: string) => {
      setSelectedNodes(new Set([id]))
      onNodeSelect?.(id)
    }

    const handleCheck = (id: string, checked: boolean) => {
      setCheckedNodes((prev) => {
        const next = new Set(prev)
        if (checked) {
          next.add(id)
        } else {
          next.delete(id)
        }
        return next
      })
      onNodeCheck?.(id, checked)
    }

    return (
      <div
        ref={ref}
        className={cn('rounded-lg border border-[hsl(var(--tree-divider)/0.1)]', className)}
        {...props}
      >
        {data.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            showCheckbox={showCheckbox}
            showIcon={showIcon}
            onToggle={handleToggle}
            onSelect={handleSelect}
            onCheck={handleCheck}
            expandedNodes={expandedNodes}
            selectedNodes={selectedNodes}
            checkedNodes={checkedNodes}
          />
        ))}
      </div>
    )
  }
)
Tree.displayName = 'Tree'

export { Tree, TreeItem }
