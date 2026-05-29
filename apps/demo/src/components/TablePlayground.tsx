import * as React from 'react'
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  CloseIcon,
  ClockIcon,
  EditIcon,
  ExclamationCircleIcon,
  ExternalLinkIcon,
  InfoIcon,
  MailIcon,
  MinusIcon,
  ShieldIcon,
  ShoppingCartIcon,
  ShowIcon,
  StarIcon,
  TimesCircleIcon,
  TrashOIcon,
  UserIcon,
} from '@acronis-platform/shadcn-uikit'
import {
  ActivityIcon,
  ArrowUpDownIcon,
  AwardIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  DollarSignIcon,
  GripVerticalIcon,
  HeartIcon,
  MoveLeftIcon,
  MoveRightIcon,
  PackageIcon,
  TagIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ZapIcon,
} from '@/components/icons/missing-icons'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Switch,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Checkbox,
  Badge,
  Button,
  Progress,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@acronis-platform/shadcn-uikit/react'
// Multiple datasources with diverse data types
const dataSources = {
  users: {
    name: 'Users',
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', amount: 2500, verified: true, lastLogin: '2024-01-15', avatar: 'https://i.pravatar.cc/150?img=1', tags: ['Premium', 'VIP'], tooltip: 'Senior administrator with full access' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active', amount: 1800, verified: true, lastLogin: '2024-01-14', avatar: 'https://i.pravatar.cc/150?img=5', tags: ['Content', 'Featured'], tooltip: 'Content editor specializing in technical documentation' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive', amount: 950, verified: false, lastLogin: '2024-01-10', avatar: 'https://i.pravatar.cc/150?img=12', tags: ['Trial'], tooltip: 'Trial user account - needs verification' },
      { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'Active', amount: 3200, verified: true, lastLogin: '2024-01-16', avatar: 'https://i.pravatar.cc/150?img=9', tags: ['Premium', 'Content'], tooltip: 'Premium content editor with publishing rights' },
      { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Pending', amount: 1450, verified: false, lastLogin: '2024-01-12', avatar: 'https://i.pravatar.cc/150?img=13', tags: ['New'], tooltip: 'Pending activation - awaiting email confirmation' },
      { id: 6, name: 'Diana Ross', email: 'diana@example.com', role: 'Admin', status: 'Active', amount: 4100, verified: true, lastLogin: '2024-01-16', avatar: 'https://i.pravatar.cc/150?img=10', tags: ['VIP', 'Support'], tooltip: 'Super admin with support responsibilities' },
      { id: 7, name: 'Edward King', email: 'edward@example.com', role: 'User', status: 'Inactive', amount: 720, verified: false, lastLogin: '2024-01-08', avatar: 'https://i.pravatar.cc/150?img=14', tags: ['Trial', 'Expired'], tooltip: 'Expired trial user - no recent activity' },
      { id: 8, name: 'Fiona Green', email: 'fiona@example.com', role: 'Editor', status: 'Active', amount: 2100, verified: true, lastLogin: '2024-01-15', avatar: 'https://i.pravatar.cc/150?img=20', tags: ['Content'], tooltip: 'Active editor with consistent contributions' },
    ],
    columns: ['id', 'name', 'email', 'role', 'status', 'amount', 'verified', 'lastLogin', 'tags'],
  },
  products: {
    name: 'Products',
    data: [
      { id: 1, name: 'Laptop Pro', sku: 'LTP-001', category: 'Electronics', price: 1299, stock: 45, rating: 4.5, featured: true, discount: 10, tags: ['Bestseller', 'Sale'], tooltip: 'High-performance laptop with latest specs', website: 'https://example.com/laptop' },
      { id: 2, name: 'Wireless Mouse', sku: 'WSM-002', category: 'Accessories', price: 29, stock: 150, rating: 4.2, featured: false, discount: 0, tags: ['Popular'], tooltip: 'Ergonomic wireless mouse with long battery life', website: 'https://example.com/mouse' },
      { id: 3, name: 'USB-C Cable', sku: 'USC-003', category: 'Accessories', price: 15, stock: 200, rating: 4.0, featured: false, discount: 5, tags: ['Essential', 'Sale'], tooltip: 'Premium USB-C cable with fast charging', website: 'https://example.com/cable' },
      { id: 4, name: 'Monitor 4K', sku: 'MON-004', category: 'Electronics', price: 599, stock: 30, rating: 4.7, featured: true, discount: 15, tags: ['Bestseller', 'Sale', 'Premium'], tooltip: '4K UHD monitor with HDR support', website: 'https://example.com/monitor' },
      { id: 5, name: 'Keyboard RGB', sku: 'KBR-005', category: 'Accessories', price: 89, stock: 80, rating: 4.4, featured: true, discount: 0, tags: ['Gaming', 'RGB'], tooltip: 'Mechanical keyboard with RGB lighting', website: 'https://example.com/keyboard' },
      { id: 6, name: 'Webcam HD', sku: 'WCH-006', category: 'Electronics', price: 79, stock: 60, rating: 3.9, featured: false, discount: 20, tags: ['Sale', 'Clearance'], tooltip: 'HD webcam with built-in microphone', website: 'https://example.com/webcam' },
      { id: 7, name: 'Headphones Pro', sku: 'HDP-007', category: 'Audio', price: 199, stock: 40, rating: 4.6, featured: true, discount: 10, tags: ['Bestseller', 'Premium'], tooltip: 'Professional noise-cancelling headphones', website: 'https://example.com/headphones' },
      { id: 8, name: 'Desk Lamp LED', sku: 'DLL-008', category: 'Office', price: 45, stock: 90, rating: 4.3, featured: false, discount: 0, tags: ['Office'], tooltip: 'Adjustable LED desk lamp with USB charging', website: 'https://example.com/lamp' },
    ],
    columns: ['id', 'name', 'sku', 'category', 'price', 'stock', 'rating', 'featured', 'discount', 'tags', 'website'],
  },
  orders: {
    name: 'Orders',
    data: [
      { id: 1001, customer: 'John Doe', date: '2024-01-15', items: 3, total: 459, status: 'Delivered', priority: 'Normal', payment: 'Credit Card' },
      { id: 1002, customer: 'Jane Smith', date: '2024-01-16', items: 1, total: 1299, status: 'Processing', priority: 'High', payment: 'PayPal' },
      { id: 1003, customer: 'Bob Johnson', date: '2024-01-14', items: 5, total: 234, status: 'Shipped', priority: 'Normal', payment: 'Debit Card' },
      { id: 1004, customer: 'Alice Williams', date: '2024-01-16', items: 2, total: 688, status: 'Processing', priority: 'High', payment: 'Credit Card' },
      { id: 1005, customer: 'Charlie Brown', date: '2024-01-13', items: 4, total: 156, status: 'Cancelled', priority: 'Low', payment: 'PayPal' },
      { id: 1006, customer: 'Diana Ross', date: '2024-01-15', items: 1, total: 199, status: 'Delivered', priority: 'Normal', payment: 'Credit Card' },
      { id: 1007, customer: 'Edward King', date: '2024-01-12', items: 2, total: 74, status: 'Delivered', priority: 'Low', payment: 'Debit Card' },
      { id: 1008, customer: 'Fiona Green', date: '2024-01-16', items: 3, total: 443, status: 'Processing', priority: 'High', payment: 'Credit Card' },
    ],
    columns: ['id', 'customer', 'date', 'items', 'total', 'status', 'priority', 'payment'],
  },
  transactions: {
    name: 'Transactions',
    data: [
      { id: 'TXN001', date: '2024-01-16 09:23', type: 'Deposit', amount: 500, balance: 5500, merchant: 'Direct Deposit', category: 'Income' },
      { id: 'TXN002', date: '2024-01-16 08:15', type: 'Withdrawal', amount: -45, balance: 5000, merchant: 'Coffee Shop', category: 'Food' },
      { id: 'TXN003', date: '2024-01-15 14:30', type: 'Withdrawal', amount: -120, balance: 5045, merchant: 'Gas Station', category: 'Transport' },
      { id: 'TXN004', date: '2024-01-15 11:20', type: 'Deposit', amount: 1200, balance: 5165, merchant: 'Freelance Payment', category: 'Income' },
      { id: 'TXN005', date: '2024-01-14 16:45', type: 'Withdrawal', amount: -89, balance: 3965, merchant: 'Restaurant', category: 'Food' },
      { id: 'TXN006', date: '2024-01-14 10:10', type: 'Withdrawal', amount: -1200, balance: 4054, merchant: 'Rent Payment', category: 'Housing' },
      { id: 'TXN007', date: '2024-01-13 13:30', type: 'Deposit', amount: 300, balance: 5254, merchant: 'Refund', category: 'Income' },
      { id: 'TXN008', date: '2024-01-13 09:00', type: 'Withdrawal', amount: -65, balance: 4954, merchant: 'Utility Bill', category: 'Bills' },
    ],
    columns: ['id', 'date', 'type', 'amount', 'balance', 'merchant', 'category'],
  },
  analytics: {
    name: 'Analytics',
    data: [
      { id: 1, metric: 'Page Views', value: 12453, change: 12.5, trend: 'up', target: 15000, completion: 83, sparkline: [45, 52, 48, 61, 70, 82, 75], tooltip: 'Total page views across all pages' },
      { id: 2, metric: 'Unique Visitors', value: 8234, change: -5.3, trend: 'down', target: 10000, completion: 82, sparkline: [90, 85, 88, 80, 75, 70, 82], tooltip: 'Unique visitors in the last 7 days' },
      { id: 3, metric: 'Bounce Rate', value: 42.3, change: -8.2, trend: 'up', target: 35, completion: 21, sparkline: [50, 48, 45, 40, 38, 35, 21], tooltip: 'Percentage of single-page sessions' },
      { id: 4, metric: 'Avg Session', value: 245, change: 15.7, trend: 'up', target: 300, completion: 82, sparkline: [60, 65, 70, 72, 75, 78, 82], tooltip: 'Average session duration in seconds' },
      { id: 5, metric: 'Conversion Rate', value: 3.8, change: 0.5, trend: 'up', target: 5, completion: 76, sparkline: [70, 72, 71, 73, 74, 75, 76], tooltip: 'Percentage of visitors who convert' },
      { id: 6, metric: 'Revenue', value: 45678, change: 23.4, trend: 'up', target: 50000, completion: 91, sparkline: [75, 78, 82, 85, 87, 89, 91], tooltip: 'Total revenue in USD' },
      { id: 7, metric: 'New Users', value: 1234, change: -2.1, trend: 'down', target: 1500, completion: 82, sparkline: [90, 88, 87, 85, 84, 83, 82], tooltip: 'New user registrations' },
      { id: 8, metric: 'Returning Users', value: 7000, change: 8.9, trend: 'up', target: 8000, completion: 88, sparkline: [75, 78, 80, 82, 84, 86, 88], tooltip: 'Users with multiple sessions' },
    ],
    columns: ['id', 'metric', 'value', 'change', 'trend', 'target', 'completion', 'sparkline'],
  },
} as const

type DataSourceKey = keyof typeof dataSources
type SortDirection = 'asc' | 'desc' | null
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

// Column descriptions for tooltips
const columnDescriptions: Record<string, Record<string, string>> = {
  users: {
    id: 'Unique user identifier',
    name: 'Full name of the user',
    email: 'User email address',
    role: 'User role in the system',
    status: 'Current account status',
    amount: 'Total transaction amount',
    verified: 'Email verification status',
    lastLogin: 'Last login date'
  },
  products: {
    id: 'Product identifier',
    name: 'Product name',
    sku: 'Stock Keeping Unit code',
    category: 'Product category',
    price: 'Product price in USD',
    stock: 'Available inventory',
    rating: 'Customer rating (0-5)',
    featured: 'Featured product status',
    discount: 'Current discount percentage'
  },
  orders: {
    id: 'Order number',
    customer: 'Customer name',
    date: 'Order date',
    items: 'Number of items',
    total: 'Order total in USD',
    status: 'Order fulfillment status',
    priority: 'Order priority level',
    payment: 'Payment method used'
  },
  transactions: {
    id: 'Transaction ID',
    date: 'Transaction timestamp',
    type: 'Transaction type',
    amount: 'Transaction amount',
    balance: 'Account balance after transaction',
    merchant: 'Merchant or source',
    category: 'Transaction category'
  },
  analytics: {
    id: 'Metric identifier',
    metric: 'Metric name',
    value: 'Current value',
    change: 'Percentage change',
    trend: 'Trend direction',
    target: 'Target value',
    completion: 'Progress towards target'
  }
}

// Column groups for multi-row headers
const columnGroups: Record<string, Array<{ group: string; columns: string[] }>> = {
  users: [
    { group: 'User Info', columns: ['name', 'email'] },
    { group: 'Account', columns: ['role', 'status', 'verified'] },
    { group: 'Financial', columns: ['amount'] },
    { group: 'ActivityIcon', columns: ['lastLogin'] }
  ],
  products: [
    { group: 'Identification', columns: ['name', 'sku', 'category'] },
    { group: 'Pricing', columns: ['price', 'discount'] },
    { group: 'Inventory', columns: ['stock'] },
    { group: 'Reviews', columns: ['rating', 'featured'] }
  ],
  orders: [
    { group: 'Order InfoIcon', columns: ['customer', 'date', 'items'] },
    { group: 'Financial', columns: ['total', 'payment'] },
    { group: 'Status', columns: ['status', 'priority'] }
  ],
  transactions: [
    { group: 'Details', columns: ['date', 'type', 'merchant', 'category'] },
    { group: 'Amounts', columns: ['amount', 'balance'] }
  ],
  analytics: [
    { group: 'Metric', columns: ['metric', 'value'] },
    { group: 'Performance', columns: ['change', 'trend'] },
    { group: 'Goals', columns: ['target', 'completion'] }
  ]
}

export function TablePlayground() {
  // Data source
  const [dataSource, setDataSource] = React.useState<DataSourceKey>('users')
  const currentData = dataSources[dataSource].data
  const currentColumns = dataSources[dataSource].columns

  // Display settings
  const [showCaption, setShowCaption] = React.useState(false)
  const [showFooter, setShowFooter] = React.useState(true)
  const [stickyFooter, setStickyFooter] = React.useState(false)
  const [footerRows, setFooterRows] = React.useState<Array<'sum' | 'avg' | 'count' | 'min' | 'max'>>(['sum', 'avg', 'count'])
  const [footerBgColor, setFooterBgColor] = React.useState<string>('default')
  const [footerTextColor, setFooterTextColor] = React.useState<string>('default')
  const [footerFontWeight, setFooterFontWeight] = React.useState<'normal' | 'medium' | 'semibold' | 'bold'>('semibold')
  const [showSelection, setShowSelection] = React.useState(true)
  const [showBadges, setShowBadges] = React.useState(true)
  const [striped, setStriped] = React.useState(false)
  const [compact, setCompact] = React.useState(false)
  const [showBorder, setShowBorder] = React.useState(true)

  // Empty states
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [emptyMessage, setEmptyMessage] = React.useState('No data available')
  const [errorMessage, setErrorMessage] = React.useState('Failed to load data')
  const [showCustomEmpty, setShowCustomEmpty] = React.useState(false)

  // Visual styling settings
  const [shadowDepth, setShadowDepth] = React.useState<'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('none')
  const [borderRadius, setBorderRadius] = React.useState<'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md')
  const [containerWidth, setContainerWidth] = React.useState<'full' | '90' | '80' | 'fixed'>('full')
  const [bgOpacity, setBgOpacity] = React.useState(100)

  // Row styling settings
  const [rowHeight, setRowHeight] = React.useState<'compact' | 'default' | 'relaxed'>('default')
  const [rowBorder, setRowBorder] = React.useState<'all' | 'horizontal' | 'vertical' | 'none'>('horizontal')
  const [hoverColor, _setHoverColor] = React.useState('default')

  // Cell styling settings
  const [cellPadding, setCellPadding] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md')
  const [textAlign, setTextAlign] = React.useState<'left' | 'center' | 'right'>('left')
  const [textWrap, setTextWrap] = React.useState<'wrap' | 'nowrap' | 'truncate'>('wrap')

  // Typography settings
  const [fontSize, setFontSize] = React.useState<'xs' | 'sm' | 'base' | 'lg' | 'xl'>('sm')
  const [fontWeight, setFontWeight] = React.useState<'normal' | 'medium' | 'semibold' | 'bold'>('normal')
  const [fontFamily, setFontFamily] = React.useState<'sans' | 'serif' | 'mono'>('sans')

  // Cell content type settings
  const [showIcons, setShowIcons] = React.useState(true)
  const [showAvatars, setShowAvatars] = React.useState(true)
  const [showProgress, setShowProgress] = React.useState(true)
  const [showLinks, setShowLinks] = React.useState(true)
  const [showActions, setShowActions] = React.useState(true)
  const [showTags, setShowTags] = React.useState(true)
  const [showSparklines, setShowSparklines] = React.useState(true)

  // Filtering & search settings
  const [globalSearch, setGlobalSearch] = React.useState('')
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = React.useState(false)

  // Advanced filtering
  const [filterTypes, setFilterTypes] = React.useState<Record<string, 'text' | 'number' | 'date' | 'select'>>({})
  const [numberFilters, setNumberFilters] = React.useState<Record<string, { min?: number; max?: number }>>({})
  const [dateFilters, setDateFilters] = React.useState<Record<string, { start?: string; end?: string }>>({})
  const [filterLogic, setFilterLogic] = React.useState<'AND' | 'OR'>('AND')
  const [savedFilterPresets, setSavedFilterPresets] = React.useState<Array<{ name: string; config: any }>>([])
  const [presetName, setPresetName] = React.useState('')

  // Header customization settings
  const [headerBgColor, setHeaderBgColor] = React.useState<'default' | 'primary' | 'secondary' | 'accent' | 'muted' | 'destructive'>('default')
  const [headerTextColor, setHeaderTextColor] = React.useState<'default' | 'primary' | 'secondary' | 'muted' | 'accent'>('default')
  const [headerFontWeight, setHeaderFontWeight] = React.useState<'normal' | 'medium' | 'semibold' | 'bold'>('medium')
  const [stickyHeader, setStickyHeader] = React.useState(false)
  const [headerAlignment, setHeaderAlignment] = React.useState<'left' | 'center' | 'right'>('left')
  const [headerBorder, setHeaderBorder] = React.useState<'none' | 'bottom' | 'all'>('bottom')
  const [showHeaderTooltips, setShowHeaderTooltips] = React.useState(false)

  // Feature settings
  const [sortable, setSortable] = React.useState(true)
  const [paginated, setPaginated] = React.useState(true)
  const [pageSize, setPageSize] = React.useState(5)
  const [paginationMode, setPaginationMode] = React.useState<'pages' | 'infinite' | 'loadmore'>('pages')
  const [loadedRows, setLoadedRows] = React.useState(5) // For infinite scroll and load more - start small
  const [pageInputValue, setPageInputValue] = React.useState('')

  // Selection settings
  const [selectionMode, setSelectionMode] = React.useState<'checkbox' | 'radio'>('checkbox')
  const [lastSelectedIndex, setLastSelectedIndex] = React.useState<number | null>(null)
  const [showBulkActions, setShowBulkActions] = React.useState(true)

  // Actions settings
  const [actionPosition, setActionPosition] = React.useState<'left' | 'right'>('right')
  const [enableInlineEdit, setEnableInlineEdit] = React.useState(false)
  const [editingCell, setEditingCell] = React.useState<{ rowIndex: number; column: string } | null>(null)
  const [editValue, setEditValue] = React.useState<string>('')
  const [expandedRows, setExpandedRows] = React.useState<Set<number>>(new Set())
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number; rowIndex: number } | null>(null)
  const [enableRowExpansion, setEnableRowExpansion] = React.useState(false)
  const [enableContextMenu, setEnableContextMenu] = React.useState(false)

  // Responsive settings
  const [enableMobileView, setEnableMobileView] = React.useState(false)
  const [mobileBreakpoint, setMobileBreakpoint] = React.useState(768)
  const [enableHorizontalScroll, setEnableHorizontalScroll] = React.useState(true)
  const [hideColumnsOnMobile, setHideColumnsOnMobile] = React.useState<string[]>([])
  const [responsiveFontSize, setResponsiveFontSize] = React.useState(false)
  const [responsivePadding, setResponsivePadding] = React.useState(false)
  const [isMobileView, setIsMobileView] = React.useState(false)

  // Advanced settings
  const [showRowNumbers, setShowRowNumbers] = React.useState(false)
  const [rowNumberPosition, setRowNumberPosition] = React.useState<'left' | 'right'>('left')
  const [enableConditionalFormatting, setEnableConditionalFormatting] = React.useState(false)
  const [conditionalRules, setConditionalRules] = React.useState<Array<{column: string; condition: string; value: any; style: string}>>([])
  const [enableHeatmap, setEnableHeatmap] = React.useState(false)
  const [heatmapColumn, setHeatmapColumn] = React.useState<string | null>(null)
  const [heatmapColor, setHeatmapColor] = React.useState<'green' | 'blue' | 'red' | 'purple'>('green')
  const [enableGrouping, setEnableGrouping] = React.useState(false)
  const [groupByColumn, setGroupByColumn] = React.useState<string | null>(null)
  const [showSubtotals, setShowSubtotals] = React.useState(true)
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set())
  const [enableTreeView, setEnableTreeView] = React.useState(false)
  const [treeParentColumn, setTreeParentColumn] = React.useState<string | null>(null)
  const [treeChildColumn, setTreeChildColumn] = React.useState<string | null>(null)
  const [expandedTreeNodes, setExpandedTreeNodes] = React.useState<Set<any>>(new Set())
  const [enableVirtualScroll, setEnableVirtualScroll] = React.useState(false)
  const [virtualScrollHeight, setVirtualScrollHeight] = React.useState(500)
  const [virtualRowHeight, setVirtualRowHeight] = React.useState(45)

  // Columns visibility - dynamic based on datasource
  const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>({})

  // Column management settings
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({})
  const [frozenColumnsLeft, setFrozenColumnsLeft] = React.useState(0)
  const [frozenColumnsRight, setFrozenColumnsRight] = React.useState(0)
  const [enableColumnResize, setEnableColumnResize] = React.useState(false)

  // Column resize tracking
  const [resizingColumn, setResizingColumn] = React.useState<string | null>(null)
  const [resizeStartX, setResizeStartX] = React.useState(0)
  const [resizeStartWidth, setResizeStartWidth] = React.useState(0)

  // Per-column settings
  const [selectedColumn, setSelectedColumn] = React.useState<string | null>(null)
  const [columnMinWidths, setColumnMinWidths] = React.useState<Record<string, number>>({})
  const [columnMaxWidths, setColumnMaxWidths] = React.useState<Record<string, number>>({})
  const [columnAlignments, setColumnAlignments] = React.useState<Record<string, 'left' | 'center' | 'right'>>({})
  const [enableColumnGrouping, setEnableColumnGrouping] = React.useState(false)

  // State
  const [selectedRows, setSelectedRows] = React.useState<(number | string)[]>([])
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = React.useState(1)

  // Advanced sorting settings
  const [multiColumnSort, setMultiColumnSort] = React.useState<Array<{ column: string; direction: 'asc' | 'desc' }>>([])
  const [enableMultiSort, setEnableMultiSort] = React.useState(false)
  const [caseSensitiveSort, setCaseSensitiveSort] = React.useState(false)
  const [sortType, setSortType] = React.useState<'auto' | 'alphabetical' | 'numeric' | 'date'>('auto')
  const [defaultSortColumn, setDefaultSortColumn] = React.useState<string | null>(null)
  const [defaultSortDirection, setDefaultSortDirection] = React.useState<'asc' | 'desc'>('asc')

  // Reset when datasource changes
  React.useEffect(() => {
    const newVisibility: Record<string, boolean> = {}
    currentColumns.forEach(col => {
      newVisibility[col] = col !== 'id' // Hide ID by default
    })
    setVisibleColumns(newVisibility)
    setColumnOrder([...currentColumns])
    setSelectedRows([])
    setSortColumn(null)
    setSortDirection(null)
    setCurrentPage(1)
    setFrozenColumnsLeft(0)
    setFrozenColumnsRight(0)
  }, [dataSource])

  // Get visible column list (respecting column order)
  const activeColumns = React.useMemo(() => {
    let columns = columnOrder.filter(col => visibleColumns[col])

    // Hide columns on mobile if responsive mode is enabled
    if (isMobileView && hideColumnsOnMobile.length > 0) {
      columns = columns.filter(col => !hideColumnsOnMobile.includes(col))
    }

    return columns
  }, [columnOrder, visibleColumns, isMobileView, hideColumnsOnMobile])

  // Filter data with advanced filtering support
  const filteredData = React.useMemo(() => {
    let data = [...currentData]

    // Apply global search
    if (globalSearch) {
      const searchLower = globalSearch.toLowerCase()
      data = data.filter((row: any) => {
        return currentColumns.some(col => {
          const value = row[col]
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(searchLower)
        })
      })
    }

    // Apply column filters with AND/OR logic
    if (Object.keys(columnFilters).length > 0 || Object.keys(numberFilters).length > 0 || Object.keys(dateFilters).length > 0) {
      data = data.filter((row: any) => {
        const filterResults: boolean[] = []

        // Text filters
        Object.entries(columnFilters).forEach(([column, filterValue]) => {
          if (filterValue) {
            const value = row[column]
            if (value === null || value === undefined) {
              filterResults.push(false)
            } else {
              const filterLower = filterValue.toLowerCase()
              filterResults.push(String(value).toLowerCase().includes(filterLower))
            }
          }
        })

        // Number filters
        Object.entries(numberFilters).forEach(([column, range]) => {
          const value = Number(row[column])
          if (isNaN(value)) {
            filterResults.push(false)
          } else {
            const minPass = range.min !== undefined ? value >= range.min : true
            const maxPass = range.max !== undefined ? value <= range.max : true
            filterResults.push(minPass && maxPass)
          }
        })

        // Date filters
        Object.entries(dateFilters).forEach(([column, range]) => {
          const value = new Date(row[column])
          if (isNaN(value.getTime())) {
            filterResults.push(false)
          } else {
            const startPass = range.start ? value >= new Date(range.start) : true
            const endPass = range.end ? value <= new Date(range.end) : true
            filterResults.push(startPass && endPass)
          }
        })

        // Apply AND/OR logic
        if (filterResults.length === 0) return true
        return filterLogic === 'AND' ? filterResults.every(r => r) : filterResults.some(r => r)
      })
    }

    return data
  }, [currentData, globalSearch, columnFilters, numberFilters, dateFilters, filterLogic, currentColumns])

  // Custom sort function based on sort type
  const compareValues = (aVal: any, bVal: any, direction: 'asc' | 'desc', _column: string): number => {
    // Handle null/undefined
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    // Auto-detect type or use specified type
    const detectedType = sortType === 'auto'
      ? (typeof aVal === 'number' && typeof bVal === 'number' ? 'numeric'
        : typeof aVal === 'string' && typeof bVal === 'string' ? 'alphabetical'
        : 'auto')
      : sortType

    let result = 0

    if (detectedType === 'numeric' || (detectedType === 'auto' && typeof aVal === 'number')) {
      result = Number(aVal) - Number(bVal)
    } else if (detectedType === 'date') {
      result = new Date(aVal).getTime() - new Date(bVal).getTime()
    } else if (detectedType === 'alphabetical' || typeof aVal === 'string') {
      // String comparison with case sensitivity option
      const aStr = String(aVal)
      const bStr = String(bVal)
      if (caseSensitiveSort) {
        result = aStr < bStr ? -1 : aStr > bStr ? 1 : 0
      } else {
        result = aStr.localeCompare(bStr, undefined, { sensitivity: 'base' })
      }
    } else if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
      result = aVal === bVal ? 0 : aVal ? 1 : -1
    }

    return direction === 'asc' ? result : -result
  }

  // Sort data with multi-column support
  const sortedData = React.useMemo(() => {
    // Use multi-column sort if enabled and has sorts
    if (enableMultiSort && multiColumnSort.length > 0) {
      return [...filteredData].sort((a: any, b: any) => {
        for (const { column, direction } of multiColumnSort) {
          const result = compareValues(a[column], b[column], direction, column)
          if (result !== 0) return result
        }
        return 0
      })
    }

    // Single column sort
    if (!sortColumn || !sortDirection) return filteredData
    return [...filteredData].sort((a: any, b: any) => {
      return compareValues(a[sortColumn], b[sortColumn], sortDirection, sortColumn)
    })
  }, [filteredData, sortColumn, sortDirection, multiColumnSort, enableMultiSort, caseSensitiveSort, sortType])

  // Tree/hierarchical data transformation
  const treeData = React.useMemo(() => {
    if (!enableTreeView || !treeParentColumn || !treeChildColumn) return sortedData

    // Build a map of parent ID to children
    const childrenMap = new Map<any, any[]>()
    const rootNodes: any[] = []

    sortedData.forEach((row: any) => {
      const parentId = row[treeParentColumn]
      const _childId = row[treeChildColumn]

      if (!parentId || parentId === '' || parentId === null) {
        // Root node (no parent)
        rootNodes.push(row)
      } else {
        // Child node
        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, [])
        }
        childrenMap.get(parentId)!.push(row)
      }
    })

    // Flatten tree structure with depth information
    const flattenTree = (nodes: any[], depth: number = 0): any[] => {
      const result: any[] = []
      nodes.forEach(node => {
        const nodeWithDepth = { ...node, _treeDepth: depth, _isTreeNode: true }
        result.push(nodeWithDepth)

        const nodeId = node[treeChildColumn]
        const children = childrenMap.get(nodeId) || []

        // Only add children if node is expanded
        if (!expandedTreeNodes.has(nodeId) && children.length > 0) {
          nodeWithDepth._hasChildren = true
          nodeWithDepth._childrenCount = children.length
        } else if (children.length > 0) {
          nodeWithDepth._hasChildren = true
          nodeWithDepth._childrenCount = children.length
          result.push(...flattenTree(children, depth + 1))
        }
      })
      return result
    }

    return flattenTree(rootNodes)
  }, [sortedData, enableTreeView, treeParentColumn, treeChildColumn, expandedTreeNodes])

  // Group data by column with subtotals
  const groupedData = React.useMemo(() => {
    const dataToGroup = enableTreeView ? treeData : sortedData
    if (!enableGrouping || !groupByColumn) return dataToGroup

    const groups: Record<string, any[]> = {}

    // Group rows by the selected column
    sortedData.forEach((row: any) => {
      const groupValue = row[groupByColumn] ?? '(Empty)'
      if (!groups[groupValue]) {
        groups[groupValue] = []
      }
      groups[groupValue].push(row)
    })

    // Create grouped rows with group headers and subtotals
    const result: any[] = []
    Object.entries(groups).forEach(([groupValue, rows]) => {
      // Add group header row
      result.push({
        _isGroupHeader: true,
        _groupValue: groupValue,
        _groupColumn: groupByColumn,
        _groupCount: rows.length,
        _groupRows: rows,
        id: `group-${groupValue}`
      })

      // Add rows if group is not collapsed
      if (!collapsedGroups.has(groupValue)) {
        result.push(...rows)

        // Add subtotal row if enabled
        if (showSubtotals) {
          const subtotalRow: any = {
            _isSubtotal: true,
            _groupValue: groupValue,
            id: `subtotal-${groupValue}`
          }

          // Calculate subtotals for numeric columns
          activeColumns.forEach(col => {
            const values = rows.map(r => r[col]).filter(v => typeof v === 'number')
            if (values.length > 0) {
              subtotalRow[col] = values.reduce((sum, val) => sum + val, 0)
            }
          })

          result.push(subtotalRow)
        }
      }
    })

    return result
  }, [sortedData, enableGrouping, groupByColumn, collapsedGroups, showSubtotals, activeColumns])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const dataToPage = enableGrouping ? groupedData : sortedData
    if (!paginated) return dataToPage

    // Handle different pagination modes
    if (paginationMode === 'infinite' || paginationMode === 'loadmore') {
      return dataToPage.slice(0, loadedRows)
    }

    // Regular pagination
    const start = (currentPage - 1) * pageSize
    return dataToPage.slice(start, start + pageSize)
  }, [groupedData, sortedData, enableGrouping, paginated, currentPage, pageSize, paginationMode, loadedRows])

  // Virtual scrolling calculation
  const [scrollTop, setScrollTop] = React.useState(0)

  const virtualizedData = React.useMemo(() => {
    if (!enableVirtualScroll) return paginatedData

    const visibleRowCount = Math.ceil(virtualScrollHeight / virtualRowHeight) + 2 // Add buffer
    const startIndex = Math.floor(scrollTop / virtualRowHeight)
    const endIndex = Math.min(startIndex + visibleRowCount, paginatedData.length)

    return paginatedData.slice(startIndex, endIndex).map((row, idx) => ({
      ...row,
      _virtualIndex: startIndex + idx,
      _virtualOffset: (startIndex + idx) * virtualRowHeight
    }))
  }, [enableVirtualScroll, paginatedData, scrollTop, virtualScrollHeight, virtualRowHeight])

  const virtualTotalHeight = enableVirtualScroll ? paginatedData.length * virtualRowHeight : 0
  const virtualOffsetY = enableVirtualScroll && virtualizedData.length > 0 ? virtualizedData[0]._virtualOffset : 0

  // Update total pages calculation
  const dataForPagination = enableGrouping ? groupedData : sortedData
  const totalPages = Math.ceil(dataForPagination.length / pageSize)

  // Reset current page when switching datasources or when total pages changes
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  // Reset loaded rows when switching pagination mode or datasource
  React.useEffect(() => {
    setLoadedRows(pageSize)
  }, [paginationMode, dataSource, pageSize])

  // Handle load more
  const loadMore = () => {
    setLoadedRows(prev => Math.min(prev + pageSize, sortedData.length))
  }

  // Handle page input
  const handlePageJump = () => {
    const page = parseInt(pageInputValue)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setPageInputValue('')
    }
  }

  // Infinite scroll handler with debouncing
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (paginationMode !== 'infinite' || loadedRows >= sortedData.length) return

    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Debounce scroll events
    scrollTimeoutRef.current = setTimeout(() => {
      const target = e.currentTarget
      const scrollPosition = target.scrollTop + target.clientHeight
      const scrollHeight = target.scrollHeight

      // Load more when scrolled near bottom (within 100px or 90% of height)
      const threshold = Math.min(100, scrollHeight * 0.1)
      if (scrollHeight - scrollPosition <= threshold) {
        setLoadedRows(prev => {
          const newValue = Math.min(prev + pageSize, sortedData.length)
          return newValue
        })
      }
    }, 100)
  }, [paginationMode, loadedRows, sortedData.length, pageSize])

  // Cleanup scroll timeout on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Filter helpers
  const clearAllFilters = () => {
    setGlobalSearch('')
    setColumnFilters({})
    setNumberFilters({})
    setDateFilters({})
    setCurrentPage(1)
  }

  const clearColumnFilter = (column: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[column]
      return newFilters
    })
    setNumberFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[column]
      return newFilters
    })
    setDateFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[column]
      return newFilters
    })
  }

  const hasActiveFilters = globalSearch || Object.keys(columnFilters).length > 0 || Object.keys(numberFilters).length > 0 || Object.keys(dateFilters).length > 0

  // Filter preset helpers
  const saveFilterPreset = () => {
    if (!presetName.trim()) return
    const config = {
      globalSearch,
      columnFilters,
      numberFilters,
      dateFilters,
      filterLogic
    }
    setSavedFilterPresets(prev => [...prev, { name: presetName, config }])
    setPresetName('')
  }

  const loadFilterPreset = (presetConfig: any) => {
    setGlobalSearch(presetConfig.globalSearch || '')
    setColumnFilters(presetConfig.columnFilters || {})
    setNumberFilters(presetConfig.numberFilters || {})
    setDateFilters(presetConfig.dateFilters || {})
    setFilterLogic(presetConfig.filterLogic || 'AND')
  }

  const deleteFilterPreset = (index: number) => {
    setSavedFilterPresets(prev => prev.filter((_, i) => i !== index))
  }

  // Auto-detect filter type for a column
  const detectFilterType = (column: string): 'text' | 'number' | 'date' | 'select' => {
    const sampleValue = currentData[0]?.[column]
    if (typeof sampleValue === 'number') return 'number'
    if (sampleValue instanceof Date || (typeof sampleValue === 'string' && !isNaN(Date.parse(sampleValue)))) return 'date'
    // Check if column has limited unique values (good for select)
    const uniqueValues = new Set(currentData.map((row: any) => row[column]))
    if (uniqueValues.size <= 10 && uniqueValues.size > 0) return 'select'
    return 'text'
  }

  // Get unique values for select filters
  const getUniqueValues = (column: string): string[] => {
    const values = new Set(currentData.map((row: any) => String(row[column] || '')))
    return Array.from(values).filter(v => v).sort()
  }

  // Handlers
  const handleSort = (column: string, shiftKey: boolean = false) => {
    if (!sortable) return

    // Multi-column sort with Shift key
    if (enableMultiSort && shiftKey) {
      const existingIndex = multiColumnSort.findIndex(s => s.column === column)

      if (existingIndex >= 0) {
        // Toggle direction or remove
        const current = multiColumnSort[existingIndex]
        if (current.direction === 'asc') {
          const newSorts = [...multiColumnSort]
          newSorts[existingIndex] = { column, direction: 'desc' }
          setMultiColumnSort(newSorts)
        } else {
          // Remove this sort
          setMultiColumnSort(multiColumnSort.filter(s => s.column !== column))
        }
      } else {
        // Add new sort
        setMultiColumnSort([...multiColumnSort, { column, direction: 'asc' }])
      }
    } else {
      // Single column sort
      if (sortColumn === column) {
        if (sortDirection === 'asc') setSortDirection('desc')
        else if (sortDirection === 'desc') {
          setSortColumn(null)
          setSortDirection(null)
        }
      } else {
        setSortColumn(column)
        setSortDirection('asc')
      }

      // Clear multi-sort when doing single sort
      if (multiColumnSort.length > 0) {
        setMultiColumnSort([])
      }
    }
  }

  // Clear all sorts
  const clearAllSorts = () => {
    setSortColumn(null)
    setSortDirection(null)
    setMultiColumnSort([])
  }

  // Apply default sort on datasource change
  React.useEffect(() => {
    if (defaultSortColumn && (currentColumns as readonly string[]).includes(defaultSortColumn)) {
      setSortColumn(defaultSortColumn)
      setSortDirection(defaultSortDirection)
    }
  }, [dataSource, defaultSortColumn, defaultSortDirection, currentColumns])

  // Detect mobile view based on window size
  React.useEffect(() => {
    const checkMobileView = () => {
      if (enableMobileView) {
        setIsMobileView(window.innerWidth <= mobileBreakpoint)
      } else {
        setIsMobileView(false)
      }
    }

    checkMobileView()
    window.addEventListener('resize', checkMobileView)
    return () => window.removeEventListener('resize', checkMobileView)
  }, [enableMobileView, mobileBreakpoint])

  const toggleRow = (id: number | string, index: number, shiftKey: boolean = false) => {
    if (selectionMode === 'radio') {
      // Radio mode: only one selection at a time
      setSelectedRows([id])
      setLastSelectedIndex(index)
    } else {
      // Checkbox mode with range selection support
      if (shiftKey && lastSelectedIndex !== null) {
        // Range selection
        const start = Math.min(lastSelectedIndex, index)
        const end = Math.max(lastSelectedIndex, index)
        const rangeIds = paginatedData.slice(start, end + 1).map((r: any) => r.id)
        setSelectedRows(prev => {
          const newSelection = new Set([...prev, ...rangeIds])
          return Array.from(newSelection)
        })
      } else {
        // Single toggle
        setSelectedRows(prev =>
          prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        )
        setLastSelectedIndex(index)
      }
    }
  }

  const toggleAll = () => {
    if (selectionMode === 'radio') return // No select all in radio mode

    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData.map((r: any) => r.id))
    }
  }

  const selectByCondition = (condition: string) => {
    if (selectionMode === 'radio') return // No bulk selection in radio mode

    let ids: (number | string)[] = []

    switch (condition) {
      case 'active':
        ids = currentData.filter((r: any) => r.status === 'Active').map((r: any) => r.id)
        break
      case 'inactive':
        ids = currentData.filter((r: any) => r.status === 'Inactive' || r.status === 'Cancelled').map((r: any) => r.id)
        break
      case 'verified':
        ids = currentData.filter((r: any) => r.verified === true).map((r: any) => r.id)
        break
      case 'high-priority':
        ids = currentData.filter((r: any) => r.priority === 'High').map((r: any) => r.id)
        break
      case 'featured':
        ids = currentData.filter((r: any) => r.featured === true).map((r: any) => r.id)
        break
      case 'all-page':
        ids = paginatedData.map((r: any) => r.id)
        break
      case 'all-data':
        ids = currentData.map((r: any) => r.id)
        break
      case 'none':
        ids = []
        break
    }

    setSelectedRows(ids)
  }

  const bulkDelete = () => {
    console.log('Bulk delete:', selectedRows)
    setSelectedRows([])
  }

  const bulkExport = () => {
    console.log('Bulk export:', selectedRows)
  }

  // Action handlers
  const handleView = (rowIndex: number) => {
    const row = paginatedData[rowIndex]
    console.log('View row:', row)
    alert(`Viewing row: ${JSON.stringify(row, null, 2)}`)
  }

  const handleEdit = (rowIndex: number) => {
    const row = paginatedData[rowIndex]
    console.log('Edit row:', row)
    alert(`Editing row ID: ${row.id}`)
  }

  const handleDelete = (rowIndex: number) => {
    const row = paginatedData[rowIndex]
    if (confirm(`Delete row ID: ${row.id}?`)) {
      console.log('Delete row:', row)
      alert(`Row ${row.id} deleted (simulated)`)
    }
  }

  // Inline editing handlers
  const startInlineEdit = (rowIndex: number, column: string, currentValue: any) => {
    setEditingCell({ rowIndex, column })
    setEditValue(String(currentValue || ''))
  }

  const saveInlineEdit = () => {
    if (editingCell) {
      console.log('Save edit:', editingCell, editValue)
      // In real app, this would update the data
      alert(`Saved: ${editingCell.column} = ${editValue}`)
      setEditingCell(null)
      setEditValue('')
    }
  }

  const cancelInlineEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  // Row expansion handlers
  const toggleRowExpansion = (rowIndex: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex)
      } else {
        newSet.add(rowIndex)
      }
      return newSet
    })
  }

  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent, rowIndex: number) => {
    if (!enableContextMenu) return
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, rowIndex })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))
  }

  // Column management helpers
  const moveColumn = (column: string, direction: 'left' | 'right') => {
    const currentIndex = columnOrder.indexOf(column)
    if (currentIndex === -1) return

    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= columnOrder.length) return

    const newOrder = [...columnOrder]
    newOrder.splice(currentIndex, 1)
    newOrder.splice(newIndex, 0, column)
    setColumnOrder(newOrder)
  }

  const resetColumnOrder = () => {
    setColumnOrder([...currentColumns])
  }

  const showAllColumns = () => {
    const newVisibility: Record<string, boolean> = {}
    currentColumns.forEach(col => {
      newVisibility[col] = true
    })
    setVisibleColumns(newVisibility)
  }

  const hideAllColumns = () => {
    const newVisibility: Record<string, boolean> = {}
    currentColumns.forEach(col => {
      newVisibility[col] = false
    })
    setVisibleColumns(newVisibility)
  }

  // Per-column settings helpers
  const setColumnMinWidth = (column: string, width: number) => {
    setColumnMinWidths(prev => ({ ...prev, [column]: width }))
  }

  const setColumnMaxWidth = (column: string, width: number) => {
    setColumnMaxWidths(prev => ({ ...prev, [column]: width }))
  }

  const setColumnAlignment = (column: string, alignment: 'left' | 'center' | 'right') => {
    setColumnAlignments(prev => ({ ...prev, [column]: alignment }))
  }

  const resetColumnSettings = (column: string) => {
    setColumnMinWidths(prev => {
      const newWidths = { ...prev }
      delete newWidths[column]
      return newWidths
    })
    setColumnMaxWidths(prev => {
      const newWidths = { ...prev }
      delete newWidths[column]
      return newWidths
    })
    setColumnAlignments(prev => {
      const newAlignments = { ...prev }
      delete newAlignments[column]
      return newAlignments
    })
  }

  // Column resize handlers
  const startResize = (column: string, startX: number) => {
    const currentWidth = columnWidths[column] || 150 // Default width if not set
    setResizingColumn(column)
    setResizeStartX(startX)
    setResizeStartWidth(currentWidth)
  }

  // Add mouse event listeners for resize
  React.useEffect(() => {
    if (!resizingColumn) return

    const onMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStartX
      let newWidth = resizeStartWidth + diff

      // Apply min/max constraints
      const minWidth = columnMinWidths[resizingColumn] || 50
      const maxWidth = columnMaxWidths[resizingColumn] || 800
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))

      setColumnWidths(prev => ({ ...prev, [resizingColumn]: newWidth }))
    }

    const onMouseUp = () => {
      setResizingColumn(null)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [resizingColumn, resizeStartX, resizeStartWidth, columnMinWidths, columnMaxWidths])

  // Calculate frozen column positions
  const getFrozenColumnStyle = (columnIndex: number, totalColumns: number, includeSelectionOffset: boolean = false): React.CSSProperties => {
    const style: React.CSSProperties = {}

    // Left frozen columns
    if (frozenColumnsLeft > 0 && columnIndex < frozenColumnsLeft) {
      let leftOffset = 0

      // Add selection column width if present
      if (includeSelectionOffset && showSelection) {
        leftOffset += 50 // Selection column width
      }

      // Calculate cumulative width of all previous frozen columns
      for (let i = 0; i < columnIndex; i++) {
        const col = activeColumns[i]
        leftOffset += columnWidths[col] || 150
      }
      style.position = 'sticky'
      style.left = `${leftOffset}px`
      style.zIndex = 10
      style.backgroundColor = 'hsl(var(--background))'
    }

    // Right frozen columns
    const rightFrozenStart = totalColumns - frozenColumnsRight
    if (frozenColumnsRight > 0 && columnIndex >= rightFrozenStart) {
      let rightOffset = 0

      // Add actions column width if present
      if (includeSelectionOffset && showActions) {
        rightOffset += 120 // Actions column approximate width
      }

      // Calculate cumulative width of all columns to the right
      for (let i = columnIndex + 1; i < totalColumns; i++) {
        const col = activeColumns[i]
        rightOffset += columnWidths[col] || 150
      }
      style.position = 'sticky'
      style.right = `${rightOffset}px`
      style.zIndex = 10
      style.backgroundColor = 'hsl(var(--background))'
    }

    return style
  }

  // Get column width
  const getColumnWidth = (column: string): React.CSSProperties => {
    const width = columnWidths[column]
    return width ? { width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` } : {}
  }

  const getBadgeVariant = (value: string): BadgeVariant => {
    // Status badges
    if (value === 'Active' || value === 'Delivered' || value === 'Deposit') return 'default'
    if (value === 'Pending' || value === 'Processing' || value === 'Shipped') return 'secondary'
    if (value === 'Inactive' || value === 'Cancelled' || value === 'Withdrawal') return 'destructive'
    return 'outline'
  }

  // Format cell value based on column and type
  const formatCellValue = (column: string, value: any, rowData?: any) => {
    if (value === null || value === undefined) return '-'

    // Wrap with tooltip if available
    const wrapWithTooltip = (content: React.ReactNode) => {
      if (rowData?.tooltip && column !== 'tooltip') {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<div className="cursor-help inline-flex items-center gap-1" />}>
                {content as any}
                <InfoIcon className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">{rowData.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
      return content
    }

    // Boolean values with icons
    if (typeof value === 'boolean') {
      const icon = value ? <CheckCircleIcon className="h-4 w-4 text-green-500" /> : <TimesCircleIcon className="h-4 w-4 text-gray-400" />
      return wrapWithTooltip(icon)
    }

    // Tags array - Multiple tags per cell
    if (column === 'tags' && Array.isArray(value) && showTags) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              <TagIcon className="h-2.5 w-2.5 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      )
    }

    // Sparkline - Mini chart visualization
    if (column === 'sparkline' && Array.isArray(value) && showSparklines) {
      const max = Math.max(...value)
      const min = Math.min(...value)
      const range = max - min
      const points = value.map((v, i) => {
        const x = (i / (value.length - 1)) * 80
        const y = 20 - ((v - min) / range) * 16
        return `${x},${y}`
      }).join(' ')

      return (
        <svg width="80" height="20" className="inline-block">
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary"
          />
        </svg>
      )
    }

    // Name field with enhanced avatar (with actual image)
    if (column === 'name' && showAvatars && typeof value === 'string') {
      const initials = value.split(' ').map(n => n[0]).join('').substring(0, 2)
      const content = (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {rowData?.avatar && <AvatarImage src={rowData.avatar} alt={value} />}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{value}</span>
        </div>
      )
      return rowData?.tooltip ? wrapWithTooltip(content) : content
    }

    // Website/External links with indicator
    if (column === 'website' && showLinks && typeof value === 'string') {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          <ExternalLinkIcon className="h-3 w-3" />
          Visit
        </a>
      )
    }

    // Email with link
    if (column === 'email' && showLinks && typeof value === 'string') {
      return (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline flex items-center gap-1">
          <MailIcon className="h-3 w-3" />
          {value}
        </a>
      )
    }

    // Trend with icons
    if (column === 'trend' && showIcons && typeof value === 'string') {
      if (value === 'up') return <TrendingUpIcon className="h-4 w-4 text-green-500" />
      if (value === 'down') return <TrendingDownIcon className="h-4 w-4 text-red-500" />
      return <MinusIcon className="h-4 w-4 text-gray-400" />
    }

    // Priority with color indicators (circles)
    if (column === 'priority' && showIcons && typeof value === 'string') {
      const priorityConfig = {
        High: { color: 'text-red-500', icon: ExclamationCircleIcon },
        Normal: { color: 'text-yellow-500', icon: ClockIcon },
        Low: { color: 'text-green-500', icon: CheckCircleIcon }
      }
      const config = priorityConfig[value as keyof typeof priorityConfig] || { color: 'text-gray-500', icon: CircleIcon }
      const Icon = config.icon
      return (
        <div className="flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 fill-current ${config.color}`} />
          <span>{value}</span>
        </div>
      )
    }

    // Status with enhanced color indicators
    if (column === 'status' && showBadges && typeof value === 'string') {
      const statusConfig: Record<string, { variant: BadgeVariant; icon: any; color: string }> = {
        'Active': { variant: 'default', icon: CheckCircleIcon, color: 'text-green-500' },
        'Inactive': { variant: 'destructive', icon: TimesCircleIcon, color: 'text-red-500' },
        'Pending': { variant: 'secondary', icon: ClockIcon, color: 'text-yellow-500' },
        'Processing': { variant: 'secondary', icon: ActivityIcon, color: 'text-blue-500' },
        'Delivered': { variant: 'default', icon: CheckCircleIcon, color: 'text-green-500' },
        'Shipped': { variant: 'secondary', icon: PackageIcon, color: 'text-blue-500' },
        'Cancelled': { variant: 'destructive', icon: TimesCircleIcon, color: 'text-red-500' }
      }
      const config = statusConfig[value] || { variant: 'outline' as BadgeVariant, icon: CircleIcon, color: 'text-gray-500' }
      const Icon = config.icon
      return (
        <Badge variant={config.variant} className="gap-1">
          {showIcons && <Icon className={`h-3 w-3 ${config.color}`} />}
          {value}
        </Badge>
      )
    }

    // Rating with stars
    if (column === 'rating' && showIcons && typeof value === 'number') {
      return (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-3 w-3 ${i < Math.floor(value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs ml-1">{value.toFixed(1)}</span>
        </div>
      )
    }

    // Completion with enhanced progress bar (with icon)
    if (column === 'completion' && showProgress && typeof value === 'number') {
      const Icon = value >= 90 ? CheckCircleIcon : value >= 50 ? ActivityIcon : ClockIcon
      const color = value >= 90 ? 'text-green-500' : value >= 50 ? 'text-blue-500' : 'text-yellow-500'
      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          {showIcons && <Icon className={`h-3.5 w-3.5 ${color}`} />}
          <Progress value={value} className="flex-1" />
          <span className="text-xs font-medium w-10">{value}%</span>
        </div>
      )
    }

    // Stock levels with progress and status indicator
    if (column === 'stock' && showProgress && typeof value === 'number') {
      const percentage = Math.min((value / 200) * 100, 100)
      const _status = value > 100 ? 'In Stock' : value > 50 ? 'Low' : 'Critical'
      const color = value > 100 ? 'text-green-600' : value > 50 ? 'text-yellow-600' : 'text-red-600'
      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress value={percentage} className="flex-1" />
          <span className={`text-xs font-medium w-16 ${color}`}>{value}</span>
        </div>
      )
    }

    // Role with custom icons
    if (column === 'role' && showBadges && showIcons && typeof value === 'string') {
      const roleConfig: Record<string, { icon: any; color: string }> = {
        'Admin': { icon: ShieldIcon, color: 'text-red-500' },
        'Editor': { icon: EditIcon, color: 'text-blue-500' },
        'User': { icon: UserIcon, color: 'text-gray-500' }
      }
      const config = roleConfig[value] || { icon: UserIcon, color: 'text-gray-500' }
      const Icon = config.icon
      return (
        <Badge variant={getBadgeVariant(value)} className="gap-1">
          <Icon className={`h-3 w-3 ${config.color}`} />
          {value}
        </Badge>
      )
    }

    // Type/Payment/Category fields
    if (['type', 'payment'].includes(column) && showBadges && typeof value === 'string') {
      return <Badge variant={getBadgeVariant(value)}>{value}</Badge>
    }

    // Currency fields
    if (['amount', 'total', 'price', 'balance'].includes(column) && typeof value === 'number') {
      return (
        <span className={`font-mono ${value < 0 ? 'text-red-500' : 'text-green-600'}`}>
          ${Math.abs(value).toLocaleString()}
        </span>
      )
    }

    // Discount with badge
    if (column === 'discount' && typeof value === 'number') {
      return value > 0 ? <Badge variant="secondary">{value}% OFF</Badge> : <span className="text-muted-foreground">-</span>
    }

    // Change percentage with icon
    if (column === 'change' && showIcons && typeof value === 'number') {
      const Icon = value > 0 ? TrendingUpIcon : value < 0 ? TrendingDownIcon : MinusIcon
      const color = value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-500'
      return (
        <div className={`flex items-center gap-1 ${color}`}>
          <Icon className="h-3 w-3" />
          <span className="font-medium">{value > 0 ? '+' : ''}{value.toFixed(1)}%</span>
        </div>
      )
    }

    // SKU with monospace
    if (column === 'sku' && typeof value === 'string') {
      return <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{value}</span>
    }

    // Category with custom icons library
    if (column === 'category' && showTags && showIcons && typeof value === 'string') {
      const categoryIcons: Record<string, { icon: any; color: string }> = {
        Electronics: { icon: ZapIcon, color: 'text-blue-500' },
        Accessories: { icon: PackageIcon, color: 'text-gray-500' },
        Audio: { icon: ActivityIcon, color: 'text-purple-500' },
        Office: { icon: PackageIcon, color: 'text-orange-500' },
        Gaming: { icon: AwardIcon, color: 'text-red-500' },
        RGB: { icon: HeartIcon, color: 'text-pink-500' },
        Income: { icon: DollarSignIcon, color: 'text-green-500' },
        Food: { icon: ShoppingCartIcon, color: 'text-orange-500' },
        Transport: { icon: PackageIcon, color: 'text-blue-500' },
        Housing: { icon: PackageIcon, color: 'text-purple-500' },
        Bills: { icon: DollarSignIcon, color: 'text-red-500' },
      }
      const config = categoryIcons[value] || { icon: PackageIcon, color: 'text-gray-500' }
      const Icon = config.icon
      return (
        <Badge variant="outline" className="gap-1">
          <Icon className={`h-3 w-3 ${config.color}`} />
          <span>{value}</span>
        </Badge>
      )
    }

    // Verified with enhanced icon
    if (column === 'verified' && typeof value === 'boolean') {
      return value ? (
        <Badge variant="default" className="gap-1">
          {showIcons && <ShieldIcon className="h-3 w-3 text-green-500" />}
          Verified
        </Badge>
      ) : (
        <Badge variant="outline" className="gap-1">
          {showIcons && <ExclamationCircleIcon className="h-3 w-3 text-yellow-500" />}
          Unverified
        </Badge>
      )
    }

    // Featured with badge
    if (column === 'featured' && typeof value === 'boolean') {
      return value ? (
        <Badge variant="default" className="gap-1">
          {showIcons && <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
          Featured
        </Badge>
      ) : null
    }

    // Date formatting
    if (column.includes('date') || column === 'lastLogin') {
      return <span className="text-muted-foreground">{value}</span>
    }

    return String(value)
  }

  // Calculate footer totals
  const calculateFooterValue = (column: string, type: 'sum' | 'avg' | 'count' | 'min' | 'max') => {
    const values = filteredData.map((row: any) => row[column])
    const numericValues = values.filter((v: any) => typeof v === 'number')

    if (type === 'count') {
      return values.filter(v => v !== null && v !== undefined).length
    }

    if (numericValues.length === 0) return '-'

    let result: number
    switch (type) {
      case 'sum':
        result = numericValues.reduce((a: number, b: number) => a + b, 0)
        break
      case 'avg':
        result = numericValues.reduce((a: number, b: number) => a + b, 0) / numericValues.length
        break
      case 'min':
        result = Math.min(...numericValues)
        break
      case 'max':
        result = Math.max(...numericValues)
        break
      default:
        return '-'
    }

    // Format based on column type
    if (['amount', 'total', 'price'].includes(column)) {
      return `$${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    if (['rating'].includes(column) || type === 'avg') {
      return result.toFixed(2)
    }
    return result.toLocaleString()
  }

  // Legacy function for backward compatibility
  const _calculateTotal = (column: string) => {
    return calculateFooterValue(column, 'sum')
  }

  // Generate footer classes
  const footerClasses = React.useMemo(() => {
    const classes = []

    // Background color
    const bgColorMap: Record<string, string> = {
      default: 'bg-muted/50',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      accent: 'bg-accent text-accent-foreground',
      muted: 'bg-muted text-muted-foreground',
      destructive: 'bg-destructive text-destructive-foreground'
    }
    classes.push(bgColorMap[footerBgColor] || bgColorMap.default)

    // Text color (only if bg is default)
    if (footerBgColor === 'default' && footerTextColor !== 'default') {
      const textColorMap: Record<string, string> = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        muted: 'text-muted-foreground',
        accent: 'text-accent-foreground'
      }
      classes.push(textColorMap[footerTextColor] || '')
    }

    // Font weight
    const weightMap: Record<string, string> = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    }
    classes.push(weightMap[footerFontWeight])

    // Sticky positioning
    if (stickyFooter) {
      classes.push('sticky bottom-0 z-10')
    }

    return classes.join(' ')
  }, [footerBgColor, footerTextColor, footerFontWeight, stickyFooter])

  // Get label for footer row type
  const getFooterLabel = (type: 'sum' | 'avg' | 'count' | 'min' | 'max'): string => {
    const labels = {
      sum: 'Total',
      avg: 'Average',
      count: 'Count',
      min: 'Minimum',
      max: 'Maximum'
    }
    return labels[type]
  }

  // Generate dynamic classes based on settings
  const containerClasses = React.useMemo(() => {
    const classes = []

    // Shadow
    const shadowMap = { none: '', sm: 'shadow-xs', md: 'shadow-md', lg: 'shadow-lg', xl: 'shadow-xl', '2xl': 'shadow-2xl' }
    if (shadowDepth !== 'none') classes.push(shadowMap[shadowDepth])

    // Border radius
    const radiusMap = { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl' }
    classes.push(radiusMap[borderRadius])

    // Width
    const widthMap = { full: 'w-full', '90': 'w-[90%] mx-auto', '80': 'w-[80%] mx-auto', fixed: 'w-[1200px] mx-auto' }
    classes.push(widthMap[containerWidth])

    return classes.join(' ')
  }, [shadowDepth, borderRadius, containerWidth])

  const tableClasses = React.useMemo(() => {
    const classes = []

    // Background opacity
    classes.push(`bg-card/${bgOpacity}`)

    // Font size
    const fontSizeMap = { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl' }
    classes.push(fontSizeMap[fontSize])

    // Font weight
    const fontWeightMap = { normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold', bold: 'font-bold' }
    classes.push(fontWeightMap[fontWeight])

    // Font family
    const fontFamilyMap = { sans: 'font-sans', serif: 'font-serif', mono: 'font-mono' }
    classes.push(fontFamilyMap[fontFamily])

    return classes.join(' ')
  }, [bgOpacity, fontSize, fontWeight, fontFamily])

  const rowClasses = React.useMemo(() => {
    const classes = []

    // Row height
    const heightMap = { compact: 'h-8', default: 'h-12', relaxed: 'h-16' }
    classes.push(heightMap[rowHeight])

    // Row borders
    if (rowBorder === 'horizontal') classes.push('border-b border-border/10')
    else if (rowBorder === 'all') classes.push('border border-border/10')
    else if (rowBorder === 'vertical') classes.push('border-l border-r border-border/10')

    // Hover color
    if (hoverColor === 'default') classes.push('hover:bg-accent/5')
    else classes.push(`hover:${hoverColor}`)

    return classes.join(' ')
  }, [rowHeight, rowBorder, hoverColor])

  const cellClasses = React.useMemo(() => {
    const classes = []

    // Cell padding with responsive support
    if (responsivePadding && isMobileView) {
      // Mobile: reduce padding
      classes.push('px-2 py-1.5')
    } else {
      const paddingMap = {
        xs: 'px-2 py-1',
        sm: 'px-3 py-2',
        md: 'px-6 py-3',
        lg: 'px-8 py-4',
        xl: 'px-10 py-5'
      }
      classes.push(paddingMap[cellPadding])
    }

    // Text alignment
    const alignMap = { left: 'text-left', center: 'text-center', right: 'text-right' }
    classes.push(alignMap[textAlign])

    // Text wrapping
    if (textWrap === 'nowrap') classes.push('whitespace-nowrap')
    else if (textWrap === 'truncate') classes.push('truncate')

    // Responsive font size
    if (responsiveFontSize && isMobileView) {
      classes.push('text-xs')
    }

    return classes.join(' ')
  }, [cellPadding, textAlign, textWrap, responsivePadding, responsiveFontSize, isMobileView])

  const headerClasses = React.useMemo(() => {
    const classes = []

    // Background color
    const bgColorMap = {
      default: 'bg-muted/50',
      primary: 'bg-primary/10',
      secondary: 'bg-secondary/50',
      accent: 'bg-accent/50',
      muted: 'bg-muted',
      destructive: 'bg-destructive/10'
    }
    classes.push(bgColorMap[headerBgColor])

    // Text color
    const textColorMap = {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-accent-foreground'
    }
    classes.push(textColorMap[headerTextColor])

    // Font weight
    const fontWeightMap = { normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold', bold: 'font-bold' }
    classes.push(fontWeightMap[headerFontWeight])

    // Alignment
    const alignMap = { left: 'text-left', center: 'text-center', right: 'text-right' }
    classes.push(alignMap[headerAlignment])

    // Border
    if (headerBorder === 'bottom') classes.push('border-b-2 border-border')
    else if (headerBorder === 'all') classes.push('border-2 border-border')

    // Sticky
    if (stickyHeader) {
      classes.push('sticky top-0 z-10')
    }

    return classes.join(' ')
  }, [headerBgColor, headerTextColor, headerFontWeight, headerAlignment, headerBorder, stickyHeader])

  // Legacy classes for compatibility
  const cellClass = compact ? 'px-2 py-2' : cellClasses
  const headClass = compact ? 'h-8 px-2' : `${cellClasses} ${headerClasses}`

  // Conditional formatting evaluation
  const evaluateConditionalFormat = React.useCallback((column: string, value: any, _row: any) => {
    if (!enableConditionalFormatting || conditionalRules.length === 0) return null

    for (const rule of conditionalRules) {
      if (rule.column !== column) continue

      let matches = false
      const numValue = typeof value === 'number' ? value : parseFloat(value)
      const ruleValue = typeof rule.value === 'number' ? rule.value : parseFloat(rule.value)

      switch (rule.condition) {
        case 'equals':
          matches = value == rule.value
          break
        case 'notEquals':
          matches = value != rule.value
          break
        case 'contains':
          matches = String(value).toLowerCase().includes(String(rule.value).toLowerCase())
          break
        case 'greaterThan':
          matches = !isNaN(numValue) && !isNaN(ruleValue) && numValue > ruleValue
          break
        case 'lessThan':
          matches = !isNaN(numValue) && !isNaN(ruleValue) && numValue < ruleValue
          break
        case 'greaterOrEqual':
          matches = !isNaN(numValue) && !isNaN(ruleValue) && numValue >= ruleValue
          break
        case 'lessOrEqual':
          matches = !isNaN(numValue) && !isNaN(ruleValue) && numValue <= ruleValue
          break
        case 'isEmpty':
          matches = value === null || value === undefined || value === ''
          break
        case 'isNotEmpty':
          matches = value !== null && value !== undefined && value !== ''
          break
      }

      if (matches) {
        return rule.style
      }
    }

    return null
  }, [enableConditionalFormatting, conditionalRules])

  // Heatmap coloring calculation
  const calculateHeatmapColor = React.useCallback((column: string, value: any) => {
    if (!enableHeatmap || !heatmapColumn || heatmapColumn !== column) return null

    // Convert value to number
    const numValue = typeof value === 'number' ? value : parseFloat(value)
    if (isNaN(numValue)) return null

    // Find min and max values for the column in current data
    const columnValues = currentData
      .map((row: any) => {
        const val = row[column]
        return typeof val === 'number' ? val : parseFloat(val)
      })
      .filter((v: number) => !isNaN(v))

    if (columnValues.length === 0) return null

    const min = Math.min(...columnValues)
    const max = Math.max(...columnValues)

    // Calculate intensity (0 to 1)
    const intensity = max === min ? 0.5 : (numValue - min) / (max - min)

    // Apply color based on selected heatmap color
    const colorMaps = {
      green: `rgba(34, 197, 94, ${intensity * 0.4})`, // green with opacity
      blue: `rgba(59, 130, 246, ${intensity * 0.4})`, // blue with opacity
      red: `rgba(239, 68, 68, ${intensity * 0.4})`, // red with opacity
      purple: `rgba(168, 85, 247, ${intensity * 0.4})` // purple with opacity
    }

    return colorMaps[heatmapColor]
  }, [enableHeatmap, heatmapColumn, heatmapColor, currentData])

  // Code generation
  const generateCode = React.useCallback(() => {
    const features: string[] = []

    // Basic features
    if (striped) features.push('striped rows')
    if (showBorder) features.push('borders')
    if (compact) features.push('compact mode')

    // Pagination
    if (paginated) features.push(`pagination (${pageSize} per page)`)
    if (paginationMode !== 'pages') features.push(`${paginationMode} scrolling`)

    // Sorting
    if (sortable) features.push('sortable columns')
    if (enableMultiSort) features.push('multi-column sorting')

    // Selection
    if (showSelection) features.push(`${selectionMode} selection`)
    if (showBulkActions) features.push('bulk actions')

    // Columns
    if (frozenColumnsLeft > 0) features.push(`${frozenColumnsLeft} frozen left columns`)
    if (frozenColumnsRight > 0) features.push(`${frozenColumnsRight} frozen right columns`)
    if (enableColumnGrouping) features.push('column grouping')

    // Advanced
    if (showRowNumbers) features.push('row numbering')
    if (enableConditionalFormatting) features.push(`conditional formatting (${conditionalRules.length} rules)`)
    if (enableHeatmap) features.push('heatmap coloring')
    if (enableGrouping) features.push('row grouping')
    if (enableTreeView) features.push('tree view')
    if (enableVirtualScroll) features.push('virtual scrolling')

    const code = `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import React from 'react'

import {
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  ClockIcon,
  CloseIcon,
  EditIcon,
  ExclamationCircleIcon,
  InfoIcon,
  MailIcon,
  ShieldIcon,
  ShoppingCartIcon,
  ShowIcon,
  StarIcon,
  TimesCircleIcon,
  TrashOIcon,
  UserIcon,
} from '@acronis-platform/shadcn-uikit'
import {
  ActivityIcon,
  ArrowUpDownIcon,
  AwardIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  GripVerticalIcon,
  HeartIcon,
  MinusIcon,
  MoveLeftIcon,
  MoveRightIcon,
  PackageIcon,
  TagIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ZapIcon,
} from '@/components/icons/missing-icons'
// Table Configuration
// Features enabled: ${features.join(', ')}

export function DataTable() {
  const [data, setData] = React.useState([
    // Your data here
  ])

  // Configuration
  const config = {
    // Display
    striped: ${striped},
    compact: ${compact},
    showBorder: ${showBorder},

    // Pagination
    paginated: ${paginated},
    pageSize: ${pageSize},
    paginationMode: '${paginationMode}',

    // Sorting
    sortable: ${sortable},
    enableMultiSort: ${enableMultiSort},
    caseSensitiveSort: ${caseSensitiveSort},

    // Selection
    showSelection: ${showSelection},
    selectionMode: '${selectionMode}',

    // Columns
    frozenColumnsLeft: ${frozenColumnsLeft},
    frozenColumnsRight: ${frozenColumnsRight},
    enableColumnGrouping: ${enableColumnGrouping},

    // Styling
    fontSize: '${fontSize}',
    fontWeight: '${fontWeight}',
    rowHeight: '${rowHeight}',
    cellPadding: '${cellPadding}',

    // Headers & Footer
    stickyHeader: ${stickyHeader},
    showFooter: ${showFooter},
    ${showCaption ? `caption: 'Your table caption',` : ''}

    // Advanced Features
    showRowNumbers: ${showRowNumbers},
    enableConditionalFormatting: ${enableConditionalFormatting},
    enableHeatmap: ${enableHeatmap},
    enableGrouping: ${enableGrouping},
    enableTreeView: ${enableTreeView},
    enableVirtualScroll: ${enableVirtualScroll},

    // Responsive
    enableMobileView: ${enableMobileView},
    mobileBreakpoint: ${mobileBreakpoint},
    responsiveFontSize: ${responsiveFontSize},
    responsivePadding: ${responsivePadding},
  }

  return (
    <div className="w-full">
      {/* Search and Filters */}
      <div className="mb-4">
        <Input
          placeholder="Search..."
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              ${showSelection ? '<TableHead className="w-[50px]"><Checkbox /></TableHead>' : ''}
              <TableHead>Column 1</TableHead>
              <TableHead>Column 2</TableHead>
              <TableHead>Column 3</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}${striped ? ' className={index % 2 === 0 ? "bg-muted/50" : ""}' : ''}>
                ${showSelection ? '<TableCell><Checkbox /></TableCell>' : ''}
                <TableCell>{row.col1}</TableCell>
                <TableCell>{row.col2}</TableCell>
                <TableCell>{row.col3}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      ${paginated ? `<div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {start} to {end} of {total} entries
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>` : ''}
    </div>
  )
}

// Usage:
// <DataTable />

// Notes:
// - Install required dependencies: @/components/ui/table, button, input, checkbox
// - Customize data structure to match your needs
// - Add your own data fetching logic
// - Implement sorting, filtering, and pagination handlers as needed
${features.length > 0 ? `// - Enabled features: ${features.join(', ')}` : ''}`

    return code
  }, [
    striped, showBorder, compact, paginated, pageSize, paginationMode,
    sortable, enableMultiSort, caseSensitiveSort, showSelection, selectionMode, showBulkActions,
    frozenColumnsLeft, frozenColumnsRight, enableColumnGrouping,
    fontSize, fontWeight, rowHeight, cellPadding, stickyHeader, showFooter, showCaption,
    showRowNumbers, enableConditionalFormatting, conditionalRules.length,
    enableHeatmap, enableGrouping, enableTreeView, enableVirtualScroll,
    enableMobileView, mobileBreakpoint, responsiveFontSize, responsivePadding
  ])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Table Playground</h2>
        <p className="text-muted-foreground">
          Interactive table with multiple datasources, sorting, pagination, and customization
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Table Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              {dataSources[dataSource].name} - Table updates as you change settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Bulk Actions Toolbar */}
            {selectedRows.length > 0 && showBulkActions && (
              <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-sm">
                    {selectedRows.length} selected
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedRows.length === currentData.length
                      ? 'All items selected'
                      : `${selectedRows.length} of ${filteredData.length} items selected`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={bulkExport}>
                    Export Selected
                  </Button>
                  <Button variant="destructive" size="sm" onClick={bulkDelete}>
                    Delete Selected
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>
                    <CloseIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search all columns..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="max-w-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide' : 'Show'} Column Filters
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Column Filters */}
              {showFilters && (
                <div className="space-y-3">
                  {/* Filter Logic Toggle */}
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium">Filter Logic:</Label>
                    <div className="flex gap-1">
                      <Button
                        variant={filterLogic === 'AND' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterLogic('AND')}
                        className="h-7 text-xs"
                      >
                        AND
                      </Button>
                      <Button
                        variant={filterLogic === 'OR' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterLogic('OR')}
                        className="h-7 text-xs"
                      >
                        OR
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {filterLogic === 'AND' ? 'Match all conditions' : 'Match any condition'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeColumns.map((col) => {
                      const filterType = filterTypes[col] || detectFilterType(col)

                      return (
                        <div key={col} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">{col}</Label>
                            <Select
                              value={filterType}
                              onValueChange={(v) => setFilterTypes(prev => ({ ...prev, [col]: v as any }))}
                            >
                              <SelectTrigger className="h-6 w-20 text-[10px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Text Filter */}
                          {filterType === 'text' && (
                            <Input
                              placeholder={`Filter ${col}...`}
                              value={columnFilters[col] || ''}
                              onChange={(e) => setColumnFilters(prev => ({ ...prev, [col]: e.target.value }))}
                              className="text-sm h-8"
                            />
                          )}

                          {/* Number Range Filter */}
                          {filterType === 'number' && (
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                placeholder="Min"
                                value={numberFilters[col]?.min ?? ''}
                                onChange={(e) => setNumberFilters(prev => ({
                                  ...prev,
                                  [col]: { ...prev[col], min: e.target.value ? Number(e.target.value) : undefined }
                                }))}
                                className="text-sm h-8"
                              />
                              <Input
                                type="number"
                                placeholder="Max"
                                value={numberFilters[col]?.max ?? ''}
                                onChange={(e) => setNumberFilters(prev => ({
                                  ...prev,
                                  [col]: { ...prev[col], max: e.target.value ? Number(e.target.value) : undefined }
                                }))}
                                className="text-sm h-8"
                              />
                            </div>
                          )}

                          {/* Date Range Filter */}
                          {filterType === 'date' && (
                            <div className="flex gap-1">
                              <Input
                                type="date"
                                placeholder="Start"
                                value={dateFilters[col]?.start || ''}
                                onChange={(e) => setDateFilters(prev => ({
                                  ...prev,
                                  [col]: { ...prev[col], start: e.target.value }
                                }))}
                                className="text-sm h-8"
                              />
                              <Input
                                type="date"
                                placeholder="End"
                                value={dateFilters[col]?.end || ''}
                                onChange={(e) => setDateFilters(prev => ({
                                  ...prev,
                                  [col]: { ...prev[col], end: e.target.value }
                                }))}
                                className="text-sm h-8"
                              />
                            </div>
                          )}

                          {/* Select Filter */}
                          {filterType === 'select' && (
                            <Select
                              value={columnFilters[col] || ''}
                              onValueChange={(v) => setColumnFilters(prev => ({ ...prev, [col]: v }))}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                {getUniqueValues(col).map(value => (
                                  <SelectItem key={value} value={value}>{value}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {filterLogic} Logic
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {globalSearch && (
                      <Badge variant="secondary" className="gap-1">
                        Global: &ldquo;{globalSearch}&rdquo;
                        <button
                          onClick={() => setGlobalSearch('')}
                          className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <CloseIcon className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {Object.entries(columnFilters).map(([col, value]) => value && (
                      <Badge key={col} variant="outline" className="gap-1">
                        {col}: &ldquo;{value}&rdquo;
                        <button
                          onClick={() => clearColumnFilter(col)}
                          className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <CloseIcon className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {Object.entries(numberFilters).map(([col, range]) => (range.min !== undefined || range.max !== undefined) && (
                      <Badge key={col} variant="outline" className="gap-1">
                        {col}: {range.min ?? '∞'} - {range.max ?? '∞'}
                        <button
                          onClick={() => clearColumnFilter(col)}
                          className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <CloseIcon className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {Object.entries(dateFilters).map(([col, range]) => (range.start || range.end) && (
                      <Badge key={col} variant="outline" className="gap-1">
                        {col}: {range.start || '∞'} → {range.end || '∞'}
                        <button
                          onClick={() => clearColumnFilter(col)}
                          className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <CloseIcon className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Filter Presets */}
              {hasActiveFilters && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Save Current Filters</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Preset name..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="max-w-xs h-8 text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveFilterPreset}
                      disabled={!presetName.trim()}
                      className="h-8"
                    >
                      Save Preset
                    </Button>
                  </div>
                </div>
              )}

              {savedFilterPresets.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Saved Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {savedFilterPresets.map((preset, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => loadFilterPreset(preset.config)}
                          className="h-7 text-xs"
                        >
                          {preset.name}
                        </Button>
                        <button
                          onClick={() => deleteFilterPreset(index)}
                          className="hover:bg-secondary rounded-full p-1"
                        >
                          <CloseIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results count */}
              <p className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {currentData.length} results
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>

            <div
              className={`${containerClasses} ${showBorder ? 'border' : ''} ${
                enableHorizontalScroll || !isMobileView ? 'overflow-x-auto' : 'overflow-x-hidden'
              } ${
                paginationMode === 'infinite'
                  ? 'max-h-[500px] overflow-y-auto'
                  : enableVirtualScroll
                  ? 'overflow-y-auto'
                  : ''
              }`}
              onScroll={(e) => {
                if (paginationMode === 'infinite') {
                  handleScroll(e)
                } else if (enableVirtualScroll) {
                  setScrollTop(e.currentTarget.scrollTop)
                }
              }}
              style={
                paginationMode === 'infinite'
                  ? { minHeight: '500px' }
                  : enableVirtualScroll
                  ? { maxHeight: `${virtualScrollHeight}px` }
                  : undefined
              }
            >
              <Table className={tableClasses}>
                {showCaption && <TableCaption>Showing {dataSources[dataSource].name} data</TableCaption>}
                <TableHeader className={headerClasses}>
                  {/* Multi-row headers - Group row */}
                  {enableColumnGrouping && (
                    <TableRow className={`${rowClasses} ${stickyHeader ? 'sticky top-0 bg-background' : ''}`}>
                      {showRowNumbers && rowNumberPosition === 'left' && <TableHead className={headClass}></TableHead>}
                      {enableRowExpansion && <TableHead className={`w-[40px] ${headClass}`}></TableHead>}
                      {showActions && actionPosition === 'left' && <TableHead className={headClass}></TableHead>}
                      {showSelection && <TableHead className={`w-[50px] ${headClass}`}></TableHead>}
                      {columnGroups[dataSource]?.map((group) => {
                        const visibleCols = group.columns.filter(col => visibleColumns[col])
                        if (visibleCols.length === 0) return null
                        return (
                          <TableHead
                            key={group.group}
                            colSpan={visibleCols.length}
                            className={`${headClass} text-center font-bold border-r border-border/50`}
                          >
                            {group.group}
                          </TableHead>
                        )
                      })}
                      {showRowNumbers && rowNumberPosition === 'right' && <TableHead className={headClass}></TableHead>}
                      {showActions && actionPosition === 'right' && <TableHead className={headClass}></TableHead>}
                    </TableRow>
                  )}

                  {/* Main header row */}
                  <TableRow className={`${rowClasses} ${stickyHeader && !enableColumnGrouping ? 'sticky top-0 bg-background' : ''}`}>
                    {/* Row Number Column Header (Left Position) */}
                    {showRowNumbers && rowNumberPosition === 'left' && (
                      <TableHead className={`w-[60px] ${headClass} text-center`} style={{ width: '60px' }}>
                        #
                      </TableHead>
                    )}

                    {/* Row Expansion Column Header */}
                    {enableRowExpansion && (
                      <TableHead className={`w-[40px] ${headClass}`} style={{ width: '40px' }}>
                      </TableHead>
                    )}

                    {/* Action Column Header (Left Position) */}
                    {showActions && actionPosition === 'left' && (
                      <TableHead
                        className={headClass}
                        style={frozenColumnsLeft > 0 ? {
                          position: 'sticky',
                          left: enableRowExpansion ? 40 : 0,
                          zIndex: 10,
                          backgroundColor: 'hsl(var(--background))'
                        } : {}}
                      >
                        Actions
                      </TableHead>
                    )}

                    {/* Selection Column Header */}
                    {showSelection && (
                      <TableHead
                        className={`w-[50px] ${headClass}`}
                        style={frozenColumnsLeft > 0 ? {
                          position: 'sticky',
                          left: 0,
                          zIndex: 10,
                          backgroundColor: 'hsl(var(--background))'
                        } : {}}
                      >
                        <Checkbox
                          checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                          onCheckedChange={toggleAll}
                        />
                      </TableHead>
                    )}
                    {activeColumns.map((col, columnIndex) => {
                      // Check if this column is in multi-sort
                      const multiSortIndex = multiColumnSort.findIndex(s => s.column === col)
                      const isMultiSorted = multiSortIndex >= 0
                      const multiSortDirection = isMultiSorted ? multiColumnSort[multiSortIndex].direction : null

                      const headerContent = sortable ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={(e) => handleSort(col, e.shiftKey)}
                        >
                          {col}
                          {/* Single sort indicator */}
                          {!enableMultiSort && sortColumn === col && (
                            <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                          )}
                          {/* Multi-sort indicator */}
                          {enableMultiSort && isMultiSorted && (
                            <span className="ml-1 flex items-center gap-0.5">
                              {multiSortDirection === 'asc' ? '↑' : '↓'}
                              <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                                {multiSortIndex + 1}
                              </Badge>
                            </span>
                          )}
                        </Button>
                      ) : (
                        col
                      )

                      const frozenStyle = getFrozenColumnStyle(columnIndex, activeColumns.length, true)
                      const widthStyle = getColumnWidth(col)
                      const combinedStyle = { ...frozenStyle, ...widthStyle }

                      return (
                        <TableHead key={col} className={`${headClass} relative`} style={combinedStyle}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {showHeaderTooltips ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger render={<div className="cursor-help" />}>
                                      {headerContent}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">{columnDescriptions[dataSource]?.[col] || `${col} column`}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                headerContent
                              )}
                            </div>
                            {enableColumnResize && (
                              <div
                                className="w-1 h-full cursor-col-resize hover:bg-primary/50 absolute right-0 top-0"
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  startResize(col, e.clientX)
                                }}
                              />
                            )}
                          </div>
                        </TableHead>
                      )
                    })}

                    {/* Row Number Column Header (Right Position) */}
                    {showRowNumbers && rowNumberPosition === 'right' && (
                      <TableHead className={`w-[60px] ${headClass} text-center`} style={{ width: '60px' }}>
                        #
                      </TableHead>
                    )}

                    {/* Action Column Header (Right Position - Default) */}
                    {showActions && actionPosition === 'right' && (
                      <TableHead
                        className={headClass}
                        style={frozenColumnsRight > 0 ? {
                          position: 'sticky',
                          right: 0,
                          zIndex: 10,
                          backgroundColor: 'hsl(var(--background))'
                        } : {}}
                      >
                        {showHeaderTooltips ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger render={<div className="cursor-help" />}>
                                Actions
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Row actions (view, edit, delete)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          'Actions'
                        )}
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Virtual scroll spacer (top) */}
                  {enableVirtualScroll && virtualOffsetY > 0 && (
                    <tr style={{ height: `${virtualOffsetY}px` }}>
                      <td></td>
                    </tr>
                  )}

                  {/* Loading State */}
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={activeColumns.length + (enableRowExpansion ? 1 : 0) + (showSelection ? 1 : 0) + (showActions ? 1 : 0) + (showRowNumbers ? 1 : 0)} className="h-64">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="space-y-3 w-full max-w-md">
                            {/* Skeleton rows */}
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="flex items-center space-x-4">
                                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                                <div className="space-y-2 flex-1">
                                  <div className="h-4 bg-muted animate-pulse rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground animate-pulse">Loading data...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : /* Error State */
                  hasError ? (
                    <TableRow>
                      <TableCell colSpan={activeColumns.length + (enableRowExpansion ? 1 : 0) + (showSelection ? 1 : 0) + (showActions ? 1 : 0) + (showRowNumbers ? 1 : 0)} className="h-64">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="rounded-full bg-destructive/10 p-4">
                            <TimesCircleIcon className="h-12 w-12 text-destructive" />
                          </div>
                          <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">Error Loading Data</h3>
                            <p className="text-sm text-muted-foreground max-w-md">{errorMessage}</p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setHasError(false)
                              setIsLoading(true)
                              setTimeout(() => setIsLoading(false), 1000)
                            }}
                          >
                            Try Again
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : /* No Data State */
                  (enableVirtualScroll ? virtualizedData : paginatedData).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={activeColumns.length + (enableRowExpansion ? 1 : 0) + (showSelection ? 1 : 0) + (showActions ? 1 : 0) + (showRowNumbers ? 1 : 0)} className="h-64">
                        {showCustomEmpty ? (
                          /* Custom Empty Component */
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-primary/10 p-4">
                              <ExclamationCircleIcon className="h-12 w-12 text-primary" />
                            </div>
                            <div className="text-center space-y-2">
                              <h3 className="text-lg font-semibold">Custom Empty State</h3>
                              <p className="text-sm text-muted-foreground max-w-md">{emptyMessage}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="default" size="sm">
                                Add New Item
                              </Button>
                              <Button variant="outline" size="sm">
                                Import Data
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* Default No Data Message */
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-muted p-4">
                              <CircleIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="text-center space-y-2">
                              <h3 className="text-lg font-semibold">No Data</h3>
                              <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    /* Normal Data Rows */
                    (enableVirtualScroll ? virtualizedData : paginatedData).map((row: any, index: number) => {
                      // Handle group header rows
                      if (row._isGroupHeader) {
                        const isCollapsed = collapsedGroups.has(row._groupValue)
                        return (
                          <TableRow
                            key={row.id}
                            className="bg-primary/10 hover:bg-primary/20 font-semibold cursor-pointer"
                            onClick={() => {
                              const newCollapsed = new Set(collapsedGroups)
                              if (isCollapsed) {
                                newCollapsed.delete(row._groupValue)
                              } else {
                                newCollapsed.add(row._groupValue)
                              }
                              setCollapsedGroups(newCollapsed)
                            }}
                          >
                            <TableCell
                              colSpan={activeColumns.length + (enableRowExpansion ? 1 : 0) + (showSelection ? 1 : 0) + (showActions ? 1 : 0) + (showRowNumbers ? 1 : 0)}
                              className="px-4 py-2"
                            >
                              <div className="flex items-center gap-2">
                                {isCollapsed ? (
                                  <ChevronRightIcon className="h-4 w-4" />
                                ) : (
                                  <ChevronDownIcon className="h-4 w-4" />
                                )}
                                <span className="font-semibold">{row._groupColumn}:</span>
                                <span>{row._groupValue}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {row._groupCount} {row._groupCount === 1 ? 'row' : 'rows'}
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      }

                      // Handle subtotal rows
                      if (row._isSubtotal) {
                        return (
                          <TableRow
                            key={row.id}
                            className="bg-muted/70 font-semibold border-t-2 border-border"
                          >
                            {showRowNumbers && <TableCell className={cellClass}></TableCell>}
                            {enableRowExpansion && <TableCell className={cellClass}></TableCell>}
                            {showActions && actionPosition === 'left' && <TableCell className={cellClass}></TableCell>}
                            {showSelection && <TableCell className={cellClass}></TableCell>}
                            {activeColumns.map((col, colIndex) => (
                              <TableCell key={col} className={`${cellClass} font-semibold`}>
                                {colIndex === 0 ? (
                                  <span className="text-xs text-muted-foreground">Subtotal:</span>
                                ) : row[col] !== undefined ? (
                                  formatCellValue(col, row[col], row) as React.ReactElement
                                ) : (
                                  ''
                                )}
                              </TableCell>
                            ))}
                            {showRowNumbers && rowNumberPosition === 'right' && <TableCell className={cellClass}></TableCell>}
                            {showActions && actionPosition === 'right' && <TableCell className={cellClass}></TableCell>}
                          </TableRow>
                        )
                      }

                      // Normal data rows
                      return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        className={`${rowClasses} ${striped && index % 2 === 0 ? 'bg-muted/50' : ''}`}
                        data-state={selectedRows.includes(row.id) ? 'selected' : undefined}
                        onContextMenu={(e) => handleContextMenu(e, index)}
                      >
                        {/* Row Number Cell (Left Position) */}
                        {showRowNumbers && rowNumberPosition === 'left' && (
                          <TableCell className={`${cellClass} text-center text-muted-foreground font-mono text-xs`}>
                            {(currentPage - 1) * pageSize + index + 1}
                          </TableCell>
                        )}

                        {/* Row Expansion Button (if enabled) */}
                        {enableRowExpansion && (
                          <TableCell className={cellClass} style={{ width: '40px' }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => toggleRowExpansion(index)}
                            >
                              {expandedRows.has(index) ? (
                                <ChevronDownIcon className="h-4 w-4" />
                              ) : (
                                <ChevronRightIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        )}

                        {/* Action Column (Left Position) */}
                        {showActions && actionPosition === 'left' && (
                          <TableCell
                            className={cellClass}
                            style={frozenColumnsLeft > 0 ? {
                              position: 'sticky',
                              left: enableRowExpansion ? 40 : 0,
                              zIndex: 10,
                              backgroundColor: index % 2 === 0 && striped ? 'hsl(var(--muted) / 0.5)' : 'hsl(var(--background))'
                            } : {}}
                          >
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleView(index)}
                                title="View"
                              >
                                <ShowIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleEdit(index)}
                                title="Edit"
                              >
                                <EditIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive"
                                onClick={() => handleDelete(index)}
                                title="Delete"
                              >
                                <TrashOIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        )}

                        {/* Selection Column */}
                        {showSelection && (
                          <TableCell
                            className={cellClass}
                            style={frozenColumnsLeft > 0 ? {
                              position: 'sticky',
                              left: (enableRowExpansion ? 40 : 0) + (showActions && actionPosition === 'left' ? 120 : 0),
                              zIndex: 10,
                              backgroundColor: index % 2 === 0 && striped ? 'hsl(var(--muted) / 0.5)' : 'hsl(var(--background))'
                            } : {}}
                          >
                            {selectionMode === 'radio' ? (
                              <input
                                type="radio"
                                checked={selectedRows.includes(row.id)}
                                onChange={() => toggleRow(row.id, index, false)}
                                className="h-4 w-4 cursor-pointer"
                              />
                            ) : (
                              <div
                                onClick={(e) => toggleRow(row.id, index, e.shiftKey)}
                                className="inline-block"
                              >
                                <Checkbox
                                  checked={selectedRows.includes(row.id)}
                                />
                              </div>
                            )}
                          </TableCell>
                        )}

                        {/* Data Columns with Inline Editing */}
                        {activeColumns.map((col, columnIndex) => {
                          const frozenStyle = getFrozenColumnStyle(columnIndex, activeColumns.length, true)
                          const widthStyle = getColumnWidth(col)
                          const alignmentStyle = columnAlignments[col] ? { textAlign: columnAlignments[col] } : {}

                          // Apply conditional formatting
                          const conditionalStyle = evaluateConditionalFormat(col, row[col], row)
                          const cellClassWithConditional = conditionalStyle ? `${cellClass} ${conditionalStyle}` : cellClass

                          // Apply heatmap coloring
                          const heatmapBgColor = calculateHeatmapColor(col, row[col])
                          const combinedStyle = heatmapBgColor
                            ? { ...frozenStyle, ...widthStyle, ...alignmentStyle, backgroundColor: heatmapBgColor }
                            : { ...frozenStyle, ...widthStyle, ...alignmentStyle }

                          const isEditing = enableInlineEdit && editingCell?.rowIndex === index && editingCell?.column === col

                          return (
                            <TableCell
                              key={col}
                              className={cellClassWithConditional}
                              style={combinedStyle}
                              onDoubleClick={() => enableInlineEdit && startInlineEdit(index, col, row[col])}
                            >
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="h-7 text-xs"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') saveInlineEdit()
                                      if (e.key === 'Escape') cancelInlineEdit()
                                    }}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-green-600"
                                    onClick={saveInlineEdit}
                                  >
                                    <CheckIcon className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-red-600"
                                    onClick={cancelInlineEdit}
                                  >
                                    <CloseIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  {/* Tree node rendering for first column */}
                                  {row._isTreeNode && columnIndex === 0 && (
                                    <div className="flex items-center gap-1" style={{ paddingLeft: `${row._treeDepth * 20}px` }}>
                                      {row._hasChildren ? (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            const nodeId = row[treeChildColumn]
                                            const newExpanded = new Set(expandedTreeNodes)
                                            if (expandedTreeNodes.has(nodeId)) {
                                              newExpanded.delete(nodeId)
                                            } else {
                                              newExpanded.add(nodeId)
                                            }
                                            setExpandedTreeNodes(newExpanded)
                                          }}
                                        >
                                          {expandedTreeNodes.has(row[treeChildColumn]) ? (
                                            <ChevronDownIcon className="h-3 w-3" />
                                          ) : (
                                            <ChevronRightIcon className="h-3 w-3" />
                                          )}
                                        </Button>
                                      ) : (
                                        <span className="w-4"></span>
                                      )}
                                      <span>{formatCellValue(col, row[col], row)}</span>
                                    </div>
                                  )}
                                  {/* Regular cell rendering */}
                                  {(!row._isTreeNode || columnIndex !== 0) && formatCellValue(col, row[col], row)}
                                </>
                              )}
                            </TableCell>
                          )
                        })}

                        {/* Row Number Cell (Right Position) */}
                        {showRowNumbers && rowNumberPosition === 'right' && (
                          <TableCell className={`${cellClass} text-center text-muted-foreground font-mono text-xs`}>
                            {(currentPage - 1) * pageSize + index + 1}
                          </TableCell>
                        )}

                        {/* Action Column (Right Position - Default) */}
                        {showActions && actionPosition === 'right' && (
                          <TableCell
                            className={cellClass}
                            style={frozenColumnsRight > 0 ? {
                              position: 'sticky',
                              right: 0,
                              zIndex: 10,
                              backgroundColor: index % 2 === 0 && striped ? 'hsl(var(--muted) / 0.5)' : 'hsl(var(--background))'
                            } : {}}
                          >
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleView(index)}
                                title="View"
                              >
                                <ShowIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleEdit(index)}
                                title="Edit"
                              >
                                <EditIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive"
                                onClick={() => handleDelete(index)}
                                title="Delete"
                              >
                                <TrashOIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>

                      {/* Expanded Row Content */}
                      {enableRowExpansion && expandedRows.has(index) && (
                        <TableRow>
                          <TableCell
                            colSpan={
                              (enableRowExpansion ? 1 : 0) +
                              (showSelection ? 1 : 0) +
                              activeColumns.length +
                              (showActions ? 1 : 0)
                            }
                            className="bg-muted/30 p-4"
                          >
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm">Expanded Details for Row {row.id}</h4>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {Object.entries(row).map(([key, value]) => (
                                  <div key={key} className="flex gap-2">
                                    <span className="font-medium text-muted-foreground">{key}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                      )
                    })
                  )}

                  {/* Virtual scroll spacer (bottom) */}
                  {enableVirtualScroll && virtualTotalHeight > 0 && (
                    <tr style={{ height: `${Math.max(0, virtualTotalHeight - virtualOffsetY - (virtualizedData.length * virtualRowHeight))}px` }}>
                      <td></td>
                    </tr>
                  )}
                </TableBody>
                {showFooter && (
                  <TableFooter className={footerClasses}>
                    {footerRows.map((rowType) => (
                      <TableRow key={rowType}>
                        {enableRowExpansion && <TableCell></TableCell>}
                        {showActions && actionPosition === 'left' && <TableCell></TableCell>}
                        {showSelection && (
                          <TableCell>
                            {getFooterLabel(rowType)}
                          </TableCell>
                        )}
                        {activeColumns.map((col, colIndex) => (
                          <TableCell key={col}>
                            {colIndex === 0 && !showSelection ? getFooterLabel(rowType) : calculateFooterValue(col, rowType)}
                          </TableCell>
                        ))}
                        {showActions && actionPosition === 'right' && <TableCell></TableCell>}
                      </TableRow>
                    ))}
                  </TableFooter>
                )}
              </Table>

              {/* Infinite Scroll Loading Indicator */}
              {paginationMode === 'infinite' && loadedRows < sortedData.length && (
                <div className="flex items-center justify-center py-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span>Loading more rows...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={closeContextMenu}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <div
                  className="fixed z-50 bg-background border rounded-md shadow-lg py-1 min-w-[180px]"
                  style={{
                    left: contextMenu.x,
                    top: contextMenu.y,
                  }}
                >
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => {
                      handleView(contextMenu.rowIndex)
                      closeContextMenu()
                    }}
                  >
                    <ShowIcon className="h-4 w-4" />
                    View Details
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => {
                      handleEdit(contextMenu.rowIndex)
                      closeContextMenu()
                    }}
                  >
                    <EditIcon className="h-4 w-4" />
                    Edit Row
                  </button>
                  <div className="border-t my-1" />
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                    onClick={() => {
                      handleDelete(contextMenu.rowIndex)
                      closeContextMenu()
                    }}
                  >
                    <TrashOIcon className="h-4 w-4" />
                    Delete Row
                  </button>
                </div>
              </>
            )}

            {/* Pagination */}
            {paginated && (
              <div className="flex flex-col gap-2 mt-4">
                {/* Stats Row */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedRows.length > 0 && `${selectedRows.length} of ${paginatedData.length} selected. `}
                    {paginationMode === 'pages' && `Page ${currentPage} of ${totalPages}`}
                    {(paginationMode === 'infinite' || paginationMode === 'loadmore') &&
                      `Showing ${paginatedData.length} of ${sortedData.length} rows`}
                    {' • '}
                    <span className="font-medium">{sortedData.length} total rows</span>
                  </p>
                </div>

                {/* Pagination Controls */}
                {paginationMode === 'pages' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Page Jump Input */}
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="1"
                          max={totalPages}
                          placeholder="Page"
                          value={pageInputValue}
                          onChange={(e) => setPageInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handlePageJump()
                            }
                          }}
                          className="w-20 h-8 text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePageJump}
                          disabled={!pageInputValue}
                        >
                          Go
                        </Button>
                      </div>

                      {/* Quick Jump Dropdown */}
                      <Select
                        value={String(currentPage)}
                        onValueChange={(value) => setCurrentPage(Number(value))}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue placeholder="Jump to page" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <SelectItem key={page} value={String(page)}>
                              Page {page}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        title="First page"
                      >
                        <ChevronsLeftIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        title="Previous page"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        title="Next page"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        title="Last page"
                      >
                        <ChevronsRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Load More Button */}
                {paginationMode === 'loadmore' && loadedRows < sortedData.length && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={loadMore}
                    >
                      Load More ({Math.min(pageSize, sortedData.length - loadedRows)} more rows)
                    </Button>
                  </div>
                )}

                {/* Infinite Scroll Info */}
                {paginationMode === 'infinite' && loadedRows < sortedData.length && (
                  <p className="text-xs text-center text-muted-foreground">
                    Scroll down to load more rows automatically
                  </p>
                )}

                {/* All loaded message */}
                {(paginationMode === 'infinite' || paginationMode === 'loadmore') &&
                  loadedRows >= sortedData.length && sortedData.length > 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    All rows loaded
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure table appearance and behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="data" className="w-full">
              <div className="space-y-2">
                <TabsList className="grid w-full grid-cols-4 gap-1">
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="columns">Columns</TabsTrigger>
                  <TabsTrigger value="appearance">Style</TabsTrigger>
                  <TabsTrigger value="rows">Rows</TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-4 gap-1">
                  <TabsTrigger value="cells">Cells</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="typography">Type</TabsTrigger>
                  <TabsTrigger value="header">Header</TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-1 gap-1">
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="data" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data Source</Label>
                  <Select value={dataSource} onValueChange={(v) => setDataSource(v as DataSourceKey)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(dataSources).map(([key, source]) => (
                        <SelectItem key={key} value={key}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {currentData.length} rows, {currentColumns.length} columns
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Dataset Info</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Rows:</span>
                      <Badge variant="secondary">{currentData.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Columns:</span>
                      <Badge variant="secondary">{currentColumns.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Visible Columns:</span>
                      <Badge variant="secondary">{activeColumns.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Filtered Rows:</span>
                      <Badge variant="secondary">{filteredData.length}</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="columns" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Column Visibility</Label>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={showAllColumns}>
                        Show All
                      </Button>
                      <Button variant="outline" size="sm" onClick={hideAllColumns}>
                        Hide All
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {columnOrder.map((col) => (
                      <div key={col} className="flex items-center justify-between">
                        <Label className="text-sm">{col}</Label>
                        <Switch
                          checked={visibleColumns[col] || false}
                          onCheckedChange={() => toggleColumn(col)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Column Order</Label>
                    <Button variant="outline" size="sm" onClick={resetColumnOrder}>
                      Reset Order
                    </Button>
                  </div>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {columnOrder.map((col, index) => (
                      <div key={col} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm flex-1">{col}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => moveColumn(col, 'left')}
                            disabled={index === 0}
                          >
                            <MoveLeftIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => moveColumn(col, 'right')}
                            disabled={index === columnOrder.length - 1}
                          >
                            <MoveRightIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Frozen Columns</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Freeze Left</Label>
                        <Badge variant="outline">{frozenColumnsLeft} columns</Badge>
                      </div>
                      <Select
                        value={String(frozenColumnsLeft)}
                        onValueChange={(v) => setFrozenColumnsLeft(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="1">1 column</SelectItem>
                          <SelectItem value="2">2 columns</SelectItem>
                          <SelectItem value="3">3 columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Freeze Right</Label>
                        <Badge variant="outline">{frozenColumnsRight} columns</Badge>
                      </div>
                      <Select
                        value={String(frozenColumnsRight)}
                        onValueChange={(v) => setFrozenColumnsRight(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="1">1 column</SelectItem>
                          <SelectItem value="2">2 columns</SelectItem>
                          <SelectItem value="3">3 columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Column Resizing</Label>
                    <p className="text-xs text-muted-foreground">Enable manual column width adjustment</p>
                  </div>
                  <Switch
                    checked={enableColumnResize}
                    onCheckedChange={setEnableColumnResize}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Column Grouping</Label>
                    <p className="text-xs text-muted-foreground">Enable multi-row header groups</p>
                  </div>
                  <Switch
                    checked={enableColumnGrouping}
                    onCheckedChange={setEnableColumnGrouping}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Per-Column Settings</Label>
                  <div className="space-y-3">
                    <Select
                      value={selectedColumn || ''}
                      onValueChange={(v) => setSelectedColumn(v || null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a column..." />
                      </SelectTrigger>
                      <SelectContent>
                        {columnOrder.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedColumn && (
                      <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium">{selectedColumn}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => resetColumnSettings(selectedColumn)}
                          >
                            Reset
                          </Button>
                        </div>

                        <Separator className="bg-border/50" />

                        {/* Column Alignment */}
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Alignment</Label>
                          <Select
                            value={columnAlignments[selectedColumn] || 'left'}
                            onValueChange={(v) => setColumnAlignment(selectedColumn, v as 'left' | 'center' | 'right')}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Min Width */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Min Width (px)</Label>
                            <Badge variant="outline" className="text-xs">
                              {columnMinWidths[selectedColumn] || 50}px
                            </Badge>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="300"
                            value={columnMinWidths[selectedColumn] || 50}
                            onChange={(e) => setColumnMinWidth(selectedColumn, Number(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        {/* Max Width */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Max Width (px)</Label>
                            <Badge variant="outline" className="text-xs">
                              {columnMaxWidths[selectedColumn] || 500}px
                            </Badge>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="800"
                            value={columnMaxWidths[selectedColumn] || 500}
                            onChange={(e) => setColumnMaxWidth(selectedColumn, Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Column Info</Label>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <Badge variant="secondary">{columnOrder.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Visible:</span>
                      <Badge variant="secondary">{activeColumns.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Frozen (L/R):</span>
                      <Badge variant="secondary">{frozenColumnsLeft} / {frozenColumnsRight}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Custom Settings:</span>
                      <Badge variant="secondary">{Object.keys(columnAlignments).length + Object.keys(columnMinWidths).length + Object.keys(columnMaxWidths).length}</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Shadow Depth</Label>
                  <Select value={shadowDepth} onValueChange={(v) => setShadowDepth(v as typeof shadowDepth)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                      <SelectItem value="2xl">2X Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Border Radius</Label>
                  <Select value={borderRadius} onValueChange={(v) => setBorderRadius(v as typeof borderRadius)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Square)</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                      <SelectItem value="2xl">2X Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Container Width</Label>
                  <Select value={containerWidth} onValueChange={(v) => setContainerWidth(v as typeof containerWidth)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="90">90% Width</SelectItem>
                      <SelectItem value="80">80% Width</SelectItem>
                      <SelectItem value="fixed">Fixed (1200px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Background Opacity</Label>
                    <span className="text-sm text-muted-foreground">{bgOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Border</Label>
                    <p className="text-xs text-muted-foreground">Table border</p>
                  </div>
                  <Switch checked={showBorder} onCheckedChange={setShowBorder} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Caption</Label>
                    <p className="text-xs text-muted-foreground">Table description</p>
                  </div>
                  <Switch checked={showCaption} onCheckedChange={setShowCaption} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Status Badges</Label>
                    <p className="text-xs text-muted-foreground">Colored badges</p>
                  </div>
                  <Switch checked={showBadges} onCheckedChange={setShowBadges} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">Legacy compact</p>
                  </div>
                  <Switch checked={compact} onCheckedChange={setCompact} />
                </div>
              </TabsContent>

              <TabsContent value="rows" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Row Height</Label>
                  <Select value={rowHeight} onValueChange={(v) => setRowHeight(v as typeof rowHeight)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact (32px)</SelectItem>
                      <SelectItem value="default">Default (48px)</SelectItem>
                      <SelectItem value="relaxed">Relaxed (64px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Row Borders</Label>
                  <Select value={rowBorder} onValueChange={(v) => setRowBorder(v as typeof rowBorder)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Horizontal Only</SelectItem>
                      <SelectItem value="vertical">Vertical Only</SelectItem>
                      <SelectItem value="all">All Borders</SelectItem>
                      <SelectItem value="none">No Borders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Striped Rows</Label>
                    <p className="text-xs text-muted-foreground">Alternating colors</p>
                  </div>
                  <Switch checked={striped} onCheckedChange={setStriped} />
                </div>

                <Separator />

                {/* Row Actions Section */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Row Actions</Label>
                    <p className="text-xs text-muted-foreground">View, Edit, Delete buttons</p>
                  </div>
                  <Switch checked={showActions} onCheckedChange={setShowActions} />
                </div>

                {showActions && (
                  <>
                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Action Column Position</Label>
                      <Select value={actionPosition} onValueChange={(v) => setActionPosition(v as typeof actionPosition)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right (Default)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Inline Editing</Label>
                        <p className="text-xs text-muted-foreground">Double-click cells to edit</p>
                      </div>
                      <Switch checked={enableInlineEdit} onCheckedChange={setEnableInlineEdit} />
                    </div>

                    {enableInlineEdit && (
                      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                        <p className="font-medium mb-1">How to use:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Double-click any cell to edit</li>
                          <li>Press Enter to save changes</li>
                          <li>Press Escape to cancel</li>
                        </ul>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Row Expansion</Label>
                        <p className="text-xs text-muted-foreground">Expandable row details</p>
                      </div>
                      <Switch checked={enableRowExpansion} onCheckedChange={setEnableRowExpansion} />
                    </div>

                    {enableRowExpansion && (
                      <div className="text-xs text-muted-foreground bg-purple-50 dark:bg-purple-950/20 p-2 rounded border border-purple-200 dark:border-purple-800">
                        <p>Click the chevron icon to expand/collapse row details</p>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Context Menu</Label>
                        <p className="text-xs text-muted-foreground">Right-click menu on rows</p>
                      </div>
                      <Switch checked={enableContextMenu} onCheckedChange={setEnableContextMenu} />
                    </div>

                    {enableContextMenu && (
                      <div className="text-xs text-muted-foreground bg-green-50 dark:bg-green-950/20 p-2 rounded border border-green-200 dark:border-green-800">
                        <p>Right-click any row to open context menu</p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="cells" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Cell Padding</Label>
                  <Select value={cellPadding} onValueChange={(v) => setCellPadding(v as typeof cellPadding)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xs">Extra Small</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text Alignment</Label>
                  <Select value={textAlign} onValueChange={(v) => setTextAlign(v as typeof textAlign)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text Wrapping</Label>
                  <Select value={textWrap} onValueChange={(v) => setTextWrap(v as typeof textWrap)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wrap">Wrap Text</SelectItem>
                      <SelectItem value="nowrap">No Wrap</SelectItem>
                      <SelectItem value="truncate">Truncate (Ellipsis)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Icons</Label>
                    <p className="text-xs text-muted-foreground">Show icons in cells</p>
                  </div>
                  <Switch checked={showIcons} onCheckedChange={setShowIcons} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Avatars</Label>
                    <p className="text-xs text-muted-foreground">User avatars</p>
                  </div>
                  <Switch checked={showAvatars} onCheckedChange={setShowAvatars} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Progress Bars</Label>
                    <p className="text-xs text-muted-foreground">Visual progress</p>
                  </div>
                  <Switch checked={showProgress} onCheckedChange={setShowProgress} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Links</Label>
                    <p className="text-xs text-muted-foreground">Clickable links</p>
                  </div>
                  <Switch checked={showLinks} onCheckedChange={setShowLinks} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Actions Column</Label>
                    <p className="text-xs text-muted-foreground">Edit/Delete buttons</p>
                  </div>
                  <Switch checked={showActions} onCheckedChange={setShowActions} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <p className="text-xs text-muted-foreground">Category tags</p>
                  </div>
                  <Switch checked={showTags} onCheckedChange={setShowTags} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Sparklines</Label>
                    <p className="text-xs text-muted-foreground">Mini charts</p>
                  </div>
                  <Switch checked={showSparklines} onCheckedChange={setShowSparklines} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Footer</Label>
                    <p className="text-xs text-muted-foreground">Show totals row</p>
                  </div>
                  <Switch checked={showFooter} onCheckedChange={setShowFooter} />
                </div>

                {showFooter && (
                  <>
                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Footer Rows</Label>
                      <div className="space-y-1">
                        {(['sum', 'avg', 'count', 'min', 'max'] as const).map(type => (
                          <div key={type} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={footerRows.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFooterRows(prev => [...prev, type])
                                } else {
                                  setFooterRows(prev => prev.filter(r => r !== type))
                                }
                              }}
                              className="h-4 w-4 cursor-pointer"
                            />
                            <Label className="text-xs capitalize cursor-pointer">{getFooterLabel(type)}</Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Select calculation types to display</p>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Sticky Footer</Label>
                        <p className="text-xs text-muted-foreground">Footer stays at bottom</p>
                      </div>
                      <Switch checked={stickyFooter} onCheckedChange={setStickyFooter} />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Footer Background</Label>
                      <Select value={footerBgColor} onValueChange={setFooterBgColor}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default (Muted)</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="accent">Accent</SelectItem>
                          <SelectItem value="muted">Muted</SelectItem>
                          <SelectItem value="destructive">Destructive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Footer Text Color</Label>
                      <Select value={footerTextColor} onValueChange={setFooterTextColor}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="muted">Muted</SelectItem>
                          <SelectItem value="accent">Accent</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Only applies with default background</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Footer Font Weight</Label>
                      <Select value={footerFontWeight} onValueChange={(v) => setFooterFontWeight(v as typeof footerFontWeight)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="semibold">Semibold</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Empty States Demo</Label>
                    <p className="text-xs text-muted-foreground">Test different empty states</p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => setIsLoading(false), 3000);
                      }}
                      className="w-full"
                    >
                      Simulate Loading (3s)
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHasError(!hasError)}
                      className="w-full"
                    >
                      {hasError ? 'Clear Error' : 'Trigger Error'}
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Custom Empty</Label>
                      <p className="text-xs text-muted-foreground">Enhanced empty state</p>
                    </div>
                    <Switch checked={showCustomEmpty} onCheckedChange={setShowCustomEmpty} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Empty Message</Label>
                    <Input
                      value={emptyMessage}
                      onChange={(e) => setEmptyMessage(e.target.value)}
                      placeholder="Custom empty message"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Error Message</Label>
                    <Input
                      value={errorMessage}
                      onChange={(e) => setErrorMessage(e.target.value)}
                      placeholder="Custom error message"
                      className="text-xs"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="typography" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Size</Label>
                  <Select value={fontSize} onValueChange={(v) => setFontSize(v as typeof fontSize)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xs">Extra Small</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="base">Base</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Weight</Label>
                  <Select value={fontWeight} onValueChange={(v) => setFontWeight(v as typeof fontWeight)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Family</Label>
                  <Select value={fontFamily} onValueChange={(v) => setFontFamily(v as typeof fontFamily)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sans">Sans Serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="mono">Monospace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="header" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Background Color</Label>
                  <Select value={headerBgColor} onValueChange={(v) => setHeaderBgColor(v as typeof headerBgColor)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (Muted)</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="accent">Accent</SelectItem>
                      <SelectItem value="muted">Muted</SelectItem>
                      <SelectItem value="destructive">Destructive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text Color</Label>
                  <Select value={headerTextColor} onValueChange={(v) => setHeaderTextColor(v as typeof headerTextColor)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="muted">Muted</SelectItem>
                      <SelectItem value="accent">Accent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Weight</Label>
                  <Select value={headerFontWeight} onValueChange={(v) => setHeaderFontWeight(v as typeof headerFontWeight)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text Alignment</Label>
                  <Select value={headerAlignment} onValueChange={(v) => setHeaderAlignment(v as typeof headerAlignment)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Border Style</Label>
                  <Select value={headerBorder} onValueChange={(v) => setHeaderBorder(v as typeof headerBorder)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Border</SelectItem>
                      <SelectItem value="bottom">Bottom Border</SelectItem>
                      <SelectItem value="all">All Borders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Sticky Header</Label>
                    <p className="text-xs text-muted-foreground">Fixed position on scroll</p>
                  </div>
                  <Switch checked={stickyHeader} onCheckedChange={setStickyHeader} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Header Tooltips</Label>
                    <p className="text-xs text-muted-foreground">Show column descriptions</p>
                  </div>
                  <Switch checked={showHeaderTooltips} onCheckedChange={setShowHeaderTooltips} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Multi-Row Headers</Label>
                    <p className="text-xs text-muted-foreground">Enable from Columns tab</p>
                  </div>
                  <Badge variant={enableColumnGrouping ? 'default' : 'outline'}>
                    {enableColumnGrouping ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Selection</Label>
                    <p className="text-xs text-muted-foreground">Enable row selection</p>
                  </div>
                  <Switch checked={showSelection} onCheckedChange={setShowSelection} />
                </div>

                {showSelection && (
                  <>
                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Selection Mode</Label>
                      <Select value={selectionMode} onValueChange={(v) => setSelectionMode(v as typeof selectionMode)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkbox">Checkbox (Multiple)</SelectItem>
                          <SelectItem value="radio">Radio (Single)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Select by Condition</Label>
                      <Select value="" onValueChange={selectByCondition}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a condition..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-page">All on Page</SelectItem>
                          <SelectItem value="all-data">All in Dataset</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="active">Active Status</SelectItem>
                          <SelectItem value="inactive">Inactive Status</SelectItem>
                          <SelectItem value="verified">Verified Users</SelectItem>
                          <SelectItem value="high-priority">High Priority</SelectItem>
                          <SelectItem value="featured">Featured Items</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {selectionMode === 'radio' ? 'Only available in checkbox mode' : 'Quick select multiple rows'}
                      </p>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Bulk Actions Toolbar</Label>
                        <p className="text-xs text-muted-foreground">Show actions when items selected</p>
                      </div>
                      <Switch checked={showBulkActions} onCheckedChange={setShowBulkActions} />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Selection Info</Label>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Mode:</span>
                          <Badge variant="outline">{selectionMode === 'checkbox' ? 'Multiple' : 'Single'}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Selected:</span>
                          <Badge variant="secondary">{selectedRows.length}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Range Selection:</span>
                          <Badge variant={selectionMode === 'checkbox' ? 'default' : 'outline'}>
                            {selectionMode === 'checkbox' ? 'Shift+Click' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Sortable</Label>
                    <p className="text-xs text-muted-foreground">Click headers to sort</p>
                  </div>
                  <Switch checked={sortable} onCheckedChange={setSortable} />
                </div>

                {sortable && (
                  <>
                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Multi-Column Sort</Label>
                        <p className="text-xs text-muted-foreground">Hold Shift to sort by multiple columns</p>
                      </div>
                      <Switch checked={enableMultiSort} onCheckedChange={setEnableMultiSort} />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sort Type</Label>
                      <Select value={sortType} onValueChange={(v) => setSortType(v as typeof sortType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto-detect</SelectItem>
                          <SelectItem value="alphabetical">Alphabetical</SelectItem>
                          <SelectItem value="numeric">Numeric</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {sortType === 'auto' && 'Automatically detect data type'}
                        {sortType === 'alphabetical' && 'Sort as text strings'}
                        {sortType === 'numeric' && 'Sort as numbers'}
                        {sortType === 'date' && 'Sort as dates'}
                      </p>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Case Sensitive</Label>
                        <p className="text-xs text-muted-foreground">Differentiate uppercase/lowercase</p>
                      </div>
                      <Switch checked={caseSensitiveSort} onCheckedChange={setCaseSensitiveSort} />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Default Sort Column</Label>
                      <Select
                        value={defaultSortColumn || 'none'}
                        onValueChange={(v) => setDefaultSortColumn(v === 'none' ? null : v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {currentColumns.map(col => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {defaultSortColumn && (
                        <>
                          <Label className="text-sm font-medium">Default Direction</Label>
                          <Select
                            value={defaultSortDirection}
                            onValueChange={(v) => setDefaultSortDirection(v as 'asc' | 'desc')}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asc">Ascending (A→Z, 1→9)</SelectItem>
                              <SelectItem value="desc">Descending (Z→A, 9→1)</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sort Info</Label>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {!enableMultiSort && (
                          <>
                            <div className="flex items-center justify-between">
                              <span>Current Sort:</span>
                              <Badge variant={sortColumn ? 'secondary' : 'outline'}>
                                {sortColumn ? `${sortColumn} ${sortDirection === 'asc' ? '↑' : '↓'}` : 'None'}
                              </Badge>
                            </div>
                          </>
                        )}
                        {enableMultiSort && (
                          <>
                            <div className="flex items-center justify-between">
                              <span>Sort Columns:</span>
                              <Badge variant="secondary">{multiColumnSort.length}</Badge>
                            </div>
                            {multiColumnSort.length > 0 && (
                              <div className="space-y-1 mt-2">
                                {multiColumnSort.map((sort, idx) => (
                                  <div key={sort.column} className="flex items-center justify-between text-xs">
                                    <Badge variant="outline" className="text-[10px]">{idx + 1}</Badge>
                                    <span>{sort.column} {sort.direction === 'asc' ? '↑' : '↓'}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {(sortColumn || multiColumnSort.length > 0) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllSorts}
                          className="w-full mt-2"
                        >
                          Clear All Sorts
                        </Button>
                      )}
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Pagination</Label>
                    <p className="text-xs text-muted-foreground">Page controls</p>
                  </div>
                  <Switch checked={paginated} onCheckedChange={setPaginated} />
                </div>

                {paginated && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Pagination Mode</Label>
                      <Select
                        value={paginationMode}
                        onValueChange={(v) => setPaginationMode(v as typeof paginationMode)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pages">Pages (with navigation)</SelectItem>
                          <SelectItem value="loadmore">Load More Button</SelectItem>
                          <SelectItem value="infinite">Infinite Scroll</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {paginationMode === 'pages' && 'Navigate between pages with controls'}
                        {paginationMode === 'loadmore' && 'Click button to load more rows'}
                        {paginationMode === 'infinite' && 'Auto-load on scroll (simulated)'}
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        {paginationMode === 'pages' ? 'Rows per Page' : 'Rows per Load'}
                      </Label>
                      <Select
                        value={String(pageSize)}
                        onValueChange={(v) => {
                          setPageSize(Number(v))
                          setCurrentPage(1)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 rows</SelectItem>
                          <SelectItem value="5">5 rows</SelectItem>
                          <SelectItem value="10">10 rows</SelectItem>
                          <SelectItem value="20">20 rows</SelectItem>
                          <SelectItem value="50">50 rows</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {paginationMode === 'pages' && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Pagination Info</Label>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <span>Current Page:</span>
                              <Badge variant="secondary">{currentPage}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Total Pages:</span>
                              <Badge variant="outline">{totalPages}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Rows on Page:</span>
                              <Badge variant="outline">{paginatedData.length}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Total Rows:</span>
                              <Badge variant="default">{sortedData.length}</Badge>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {(paginationMode === 'infinite' || paginationMode === 'loadmore') && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Load Info</Label>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <span>Loaded Rows:</span>
                              <Badge variant="secondary">{loadedRows}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Total Rows:</span>
                              <Badge variant="default">{sortedData.length}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Remaining:</span>
                              <Badge variant="outline">{Math.max(0, sortedData.length - loadedRows)}</Badge>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Filtering & Search</Label>
                      <p className="text-xs text-muted-foreground">Enable data filtering</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Global Search</span>
                      <Badge variant="secondary">{globalSearch ? 'Active' : 'Inactive'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Column Filters</span>
                      <Badge variant="secondary">{Object.keys(columnFilters).length > 0 ? `${Object.keys(columnFilters).length} active` : 'None'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Filtered Results</span>
                      <Badge variant="outline">{filteredData.length} / {currentData.length}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Responsive Section */}
                <div className="space-y-4 p-3 border rounded-md bg-purple-50 dark:bg-purple-950/20">
                  <div>
                    <Label className="text-sm font-medium">Responsive Settings</Label>
                    <p className="text-xs text-muted-foreground">Mobile-friendly table options</p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Mobile View</Label>
                      <p className="text-xs text-muted-foreground">Enable responsive mode</p>
                    </div>
                    <Switch checked={enableMobileView} onCheckedChange={setEnableMobileView} />
                  </div>

                  {enableMobileView && (
                    <>
                      <Separator />

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Mobile Breakpoint (px)</Label>
                        <Input
                          type="number"
                          value={mobileBreakpoint}
                          onChange={(e) => setMobileBreakpoint(Number(e.target.value))}
                          min="320"
                          max="1024"
                          className="text-xs"
                        />
                        <p className="text-xs text-muted-foreground">
                          Responsive features activate below this width (current: {isMobileView ? 'Active' : 'Inactive'})
                        </p>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Horizontal Scroll</Label>
                          <p className="text-xs text-muted-foreground">Enable horizontal scrolling</p>
                        </div>
                        <Switch checked={enableHorizontalScroll} onCheckedChange={setEnableHorizontalScroll} />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Responsive Font Size</Label>
                          <p className="text-xs text-muted-foreground">Smaller text on mobile</p>
                        </div>
                        <Switch checked={responsiveFontSize} onCheckedChange={setResponsiveFontSize} />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Responsive Padding</Label>
                          <p className="text-xs text-muted-foreground">Reduced padding on mobile</p>
                        </div>
                        <Switch checked={responsivePadding} onCheckedChange={setResponsivePadding} />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Hide Columns on Mobile</Label>
                        <div className="space-y-1 max-h-[150px] overflow-y-auto">
                          {activeColumns.map(col => (
                            <div key={col} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={hideColumnsOnMobile.includes(col)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setHideColumnsOnMobile(prev => [...prev, col])
                                  } else {
                                    setHideColumnsOnMobile(prev => prev.filter(c => c !== col))
                                  }
                                }}
                                className="h-4 w-4 cursor-pointer"
                              />
                              <Label className="text-xs capitalize cursor-pointer">{col}</Label>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {hideColumnsOnMobile.length} column(s) will be hidden on mobile
                        </p>
                      </div>

                      {isMobileView && (
                        <div className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-2 rounded border border-green-200 dark:border-green-800">
                          <p className="font-medium">✓ Mobile View Active</p>
                          <p>Responsive features are currently applied</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <Separator />

                {/* Advanced Section */}
                <div className="space-y-4 p-3 border rounded-md bg-orange-50 dark:bg-orange-950/20">
                  <div>
                    <Label className="text-sm font-medium">Advanced Features</Label>
                    <p className="text-xs text-muted-foreground">Power user table features</p>
                  </div>

                  <Separator />

                  {/* Row Numbering */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Row Numbers</Label>
                        <p className="text-xs text-muted-foreground">Display row numbers in table</p>
                      </div>
                      <Switch checked={showRowNumbers} onCheckedChange={setShowRowNumbers} />
                    </div>

                    {showRowNumbers && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Row Number Position</Label>
                          <div className="flex gap-2">
                            <Button
                              variant={rowNumberPosition === 'left' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setRowNumberPosition('left')}
                              className="flex-1"
                            >
                              Left
                            </Button>
                            <Button
                              variant={rowNumberPosition === 'right' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setRowNumberPosition('right')}
                              className="flex-1"
                            >
                              Right
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Numbers shown on {rowNumberPosition} side
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Conditional Formatting */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Conditional Formatting</Label>
                        <p className="text-xs text-muted-foreground">Apply rules to highlight cells</p>
                      </div>
                      <Switch checked={enableConditionalFormatting} onCheckedChange={setEnableConditionalFormatting} />
                    </div>

                    {enableConditionalFormatting && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Formatting Rules</Label>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => {
                                setConditionalRules([...conditionalRules, {
                                  column: activeColumns[0] || '',
                                  condition: 'greaterThan',
                                  value: 0,
                                  style: 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 font-semibold'
                                }])
                              }}
                            >
                              + Add Rule
                            </Button>
                          </div>

                          {conditionalRules.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">No rules defined. Click &ldquo;Add Rule&rdquo; to create one.</p>
                          ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                              {conditionalRules.map((rule, ruleIndex) => (
                                <div key={ruleIndex} className="p-2 border rounded-md space-y-2 bg-background">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium">Rule {ruleIndex + 1}</Label>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-destructive"
                                      onClick={() => {
                                        setConditionalRules(conditionalRules.filter((_, i) => i !== ruleIndex))
                                      }}
                                    >
                                      <CloseIcon className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                      <Label className="text-xs">Column</Label>
                                      <select
                                        value={rule.column}
                                        onChange={(e) => {
                                          const updated = [...conditionalRules]
                                          updated[ruleIndex].column = e.target.value
                                          setConditionalRules(updated)
                                        }}
                                        className="w-full h-8 text-xs border rounded px-2 bg-background"
                                      >
                                        {activeColumns.map(col => (
                                          <option key={col} value={col}>{col}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <Label className="text-xs">Condition</Label>
                                      <select
                                        value={rule.condition}
                                        onChange={(e) => {
                                          const updated = [...conditionalRules]
                                          updated[ruleIndex].condition = e.target.value
                                          setConditionalRules(updated)
                                        }}
                                        className="w-full h-8 text-xs border rounded px-2 bg-background"
                                      >
                                        <option value="equals">Equals</option>
                                        <option value="notEquals">Not Equals</option>
                                        <option value="contains">Contains</option>
                                        <option value="greaterThan">Greater Than</option>
                                        <option value="lessThan">Less Than</option>
                                        <option value="greaterOrEqual">Greater or Equal</option>
                                        <option value="lessOrEqual">Less or Equal</option>
                                        <option value="isEmpty">Is Empty</option>
                                        <option value="isNotEmpty">Is Not Empty</option>
                                      </select>
                                    </div>
                                  </div>

                                  {rule.condition !== 'isEmpty' && rule.condition !== 'isNotEmpty' && (
                                    <div className="space-y-1">
                                      <Label className="text-xs">Value</Label>
                                      <Input
                                        value={rule.value}
                                        onChange={(e) => {
                                          const updated = [...conditionalRules]
                                          updated[ruleIndex].value = e.target.value
                                          setConditionalRules(updated)
                                        }}
                                        className="h-8 text-xs"
                                        placeholder="Enter value..."
                                      />
                                    </div>
                                  )}

                                  <div className="space-y-1">
                                    <Label className="text-xs">Style</Label>
                                    <select
                                      value={rule.style}
                                      onChange={(e) => {
                                        const updated = [...conditionalRules]
                                        updated[ruleIndex].style = e.target.value
                                        setConditionalRules(updated)
                                      }}
                                      className="w-full h-8 text-xs border rounded px-2 bg-background"
                                    >
                                      <option value="bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 font-semibold">Green Highlight</option>
                                      <option value="bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 font-semibold">Red Highlight</option>
                                      <option value="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 font-semibold">Yellow Highlight</option>
                                      <option value="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-semibold">Blue Highlight</option>
                                      <option value="bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-semibold">Purple Highlight</option>
                                      <option value="bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 font-semibold">Orange Highlight</option>
                                      <option value="text-green-600 dark:text-green-400 font-bold">Green Text</option>
                                      <option value="text-red-600 dark:text-red-400 font-bold">Red Text</option>
                                      <option value="text-blue-600 dark:text-blue-400 font-bold">Blue Text</option>
                                      <option value="border-2 border-red-500 bg-red-50 dark:bg-red-950/20">Red Border</option>
                                      <option value="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">Green Border</option>
                                    </select>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground">
                            {conditionalRules.length} rule(s) configured
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Heatmap Coloring */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Heatmap Coloring</Label>
                        <p className="text-xs text-muted-foreground">Color gradient by values</p>
                      </div>
                      <Switch checked={enableHeatmap} onCheckedChange={setEnableHeatmap} />
                    </div>

                    {enableHeatmap && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Heatmap Column</Label>
                          <select
                            value={heatmapColumn || ''}
                            onChange={(e) => setHeatmapColumn(e.target.value || null)}
                            className="w-full h-8 text-xs border rounded px-2 bg-background"
                          >
                            <option value="">Select column...</option>
                            {activeColumns.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                          <p className="text-xs text-muted-foreground">
                            Apply gradient to this column
                          </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Heatmap Color</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={heatmapColor === 'green' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setHeatmapColor('green')}
                              className="flex items-center gap-1"
                            >
                              <div className="w-3 h-3 rounded bg-green-500"></div>
                              Green
                            </Button>
                            <Button
                              variant={heatmapColor === 'blue' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setHeatmapColor('blue')}
                              className="flex items-center gap-1"
                            >
                              <div className="w-3 h-3 rounded bg-blue-500"></div>
                              Blue
                            </Button>
                            <Button
                              variant={heatmapColor === 'red' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setHeatmapColor('red')}
                              className="flex items-center gap-1"
                            >
                              <div className="w-3 h-3 rounded bg-red-500"></div>
                              Red
                            </Button>
                            <Button
                              variant={heatmapColor === 'purple' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setHeatmapColor('purple')}
                              className="flex items-center gap-1"
                            >
                              <div className="w-3 h-3 rounded bg-purple-500"></div>
                              Purple
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Lower values = lighter, higher values = darker
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Grouping/Subtotals */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Row Grouping</Label>
                        <p className="text-xs text-muted-foreground">Group rows by column values</p>
                      </div>
                      <Switch checked={enableGrouping} onCheckedChange={setEnableGrouping} />
                    </div>

                    {enableGrouping && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Group By Column</Label>
                          <select
                            value={groupByColumn || ''}
                            onChange={(e) => setGroupByColumn(e.target.value || null)}
                            className="w-full h-8 text-xs border rounded px-2 bg-background"
                          >
                            <option value="">Select column...</option>
                            {currentColumns.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                          <p className="text-xs text-muted-foreground">
                            Rows will be grouped by this column
                          </p>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Show Subtotals</Label>
                            <p className="text-xs text-muted-foreground">Calculate sums for numeric columns</p>
                          </div>
                          <Switch checked={showSubtotals} onCheckedChange={setShowSubtotals} />
                        </div>

                        {groupByColumn && (
                          <div className="text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                            <p className="font-medium">ℹ️ Grouping Active</p>
                            <p>Click group headers to expand/collapse</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Tree/Hierarchical View */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Tree/Hierarchical View</Label>
                        <p className="text-xs text-muted-foreground">Parent-child relationships</p>
                      </div>
                      <Switch checked={enableTreeView} onCheckedChange={setEnableTreeView} />
                    </div>

                    {enableTreeView && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Parent ID Column</Label>
                          <select
                            value={treeParentColumn || ''}
                            onChange={(e) => setTreeParentColumn(e.target.value || null)}
                            className="w-full h-8 text-xs border rounded px-2 bg-background"
                          >
                            <option value="">Select column...</option>
                            {currentColumns.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                          <p className="text-xs text-muted-foreground">
                            Column containing parent ID reference
                          </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Node ID Column</Label>
                          <select
                            value={treeChildColumn || ''}
                            onChange={(e) => setTreeChildColumn(e.target.value || null)}
                            className="w-full h-8 text-xs border rounded px-2 bg-background"
                          >
                            <option value="">Select column...</option>
                            {currentColumns.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                          <p className="text-xs text-muted-foreground">
                            Column containing unique node ID
                          </p>
                        </div>

                        {treeParentColumn && treeChildColumn && (
                          <div className="text-xs text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 p-2 rounded border border-purple-200 dark:border-purple-800">
                            <p className="font-medium">🌳 Tree View Active</p>
                            <p>Click chevrons to expand/collapse nodes</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Virtual Scrolling */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Virtual Scrolling</Label>
                        <p className="text-xs text-muted-foreground">Optimize for large datasets</p>
                      </div>
                      <Switch
                        checked={enableVirtualScroll}
                        onCheckedChange={(checked) => {
                          setEnableVirtualScroll(checked)
                          if (checked) {
                            // Disable pagination when virtual scroll is enabled
                            setPaginated(false)
                          }
                        }}
                      />
                    </div>

                    {enableVirtualScroll && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Container Height (px)</Label>
                          <Input
                            type="number"
                            value={virtualScrollHeight}
                            onChange={(e) => setVirtualScrollHeight(Number(e.target.value))}
                            min="200"
                            max="1000"
                            className="text-xs"
                          />
                          <p className="text-xs text-muted-foreground">
                            Height of scrollable area
                          </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Row Height (px)</Label>
                          <Input
                            type="number"
                            value={virtualRowHeight}
                            onChange={(e) => setVirtualRowHeight(Number(e.target.value))}
                            min="30"
                            max="100"
                            className="text-xs"
                          />
                          <p className="text-xs text-muted-foreground">
                            Estimated height per row
                          </p>
                        </div>

                        <div className="text-xs text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 p-2 rounded border border-cyan-200 dark:border-cyan-800">
                          <p className="font-medium">⚡ Virtual Scroll Active</p>
                          <p>Only visible rows are rendered</p>
                          <p className="mt-1 text-[10px]">Rendering ~{virtualizedData.length} of {paginatedData.length} rows</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Current Configuration</CardTitle>
          <CardDescription>Summary of active settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Data Source</p>
              <p className="text-2xl font-bold">{dataSources[dataSource].name}</p>
              <p className="text-xs text-muted-foreground">{currentData.length} records</p>
            </div>
            <div>
              <p className="text-sm font-medium">Visible Columns</p>
              <p className="text-2xl font-bold">{activeColumns.length}</p>
              <p className="text-xs text-muted-foreground">of {currentColumns.length} total</p>
            </div>
            <div>
              <p className="text-sm font-medium">Selected Rows</p>
              <p className="text-2xl font-bold">{selectedRows.length}</p>
              <p className="text-xs text-muted-foreground">of {paginatedData.length} on page</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Code Card */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Code</CardTitle>
          <CardDescription>Copy this code to use your current table configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="w-full max-w-full overflow-x-auto rounded-lg bg-muted p-4 text-sm whitespace-pre max-h-96">
            <code>{generateCode()}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Documentation Section - Organized by Settings Tabs */}
      <div className="space-y-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Documentation</h2>
          <p className="text-muted-foreground">Comprehensive guide organized by settings tabs</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 1. DATA TAB */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Data Tab</CardTitle>
            <CardDescription>Data sources, pagination, sorting, filtering, and selection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">📁 Data Sources</p>
              <p className="text-muted-foreground mb-2">Switch between different preset datasets or provide custom data.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Preset sources:</strong> Users, Products, Orders, Complex nested data</li>
                <li><strong>Custom data:</strong> Provide your own array of objects</li>
                <li><strong>Data format:</strong> Array of objects with consistent keys and unique <code className="text-xs bg-muted px-1">id</code> field</li>
              </ul>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                <code>{`const data = [
  { id: 1, name: 'Alice', age: 28, status: 'Active' },
  { id: 2, name: 'Bob', age: 32, status: 'Inactive' },
]`}</code>
              </pre>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📄 Pagination</p>
              <p className="text-muted-foreground mb-2">Control how data is displayed across multiple pages.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Standard mode:</strong> Classic page-by-page navigation with first/previous/next/last buttons</li>
                <li><strong>Infinite scroll:</strong> Load more data automatically as you scroll down</li>
                <li><strong>Load more:</strong> Manual &ldquo;Load More&rdquo; button to fetch additional rows</li>
                <li><strong>Page size:</strong> Choose 5, 10, 20, 50, or 100 rows per page</li>
                <li><strong>Position:</strong> Show pagination controls at top, bottom, or both</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">⬆️ Sorting</p>
              <p className="text-muted-foreground mb-2">Order data by column values in ascending or descending order.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Single column:</strong> Click header to sort by that column</li>
                <li><strong>Multi-column:</strong> Hold Shift and click multiple headers to sort by multiple columns in sequence</li>
                <li><strong>Sort type:</strong> Alphabetic (A-Z), Numeric (0-9), or Date (oldest-newest)</li>
                <li><strong>Case sensitivity:</strong> Toggle case-sensitive sorting for text columns</li>
                <li><strong>Default sort:</strong> Set initial sort column and direction on load</li>
                <li><strong>Indicators:</strong> Visual arrows show current sort direction and priority</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🔍 Filtering</p>
              <p className="text-muted-foreground mb-2">Narrow down data by searching and filtering specific columns.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Global search:</strong> Search across all columns at once with a single input</li>
                <li><strong>Column filters:</strong> Individual filters per column with type-specific inputs</li>
                <li><strong>Filter types:</strong> Text (contains), Number (equals/greater/less), Date (before/after), Select (dropdown)</li>
                <li><strong>Filter logic:</strong> Combine filters with AND (all must match) or OR (any can match)</li>
                <li><strong>Clear filters:</strong> Reset all filters at once or clear individual column filters</li>
                <li><strong>Active count:</strong> See how many filters are currently applied</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">☑️ Selection</p>
              <p className="text-muted-foreground mb-2">Select rows for bulk operations or individual actions.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Selection modes:</strong> Single (one at a time), Multi (checkboxes), Radio (exclusive selection)</li>
                <li><strong>Select all:</strong> Check header checkbox to select all rows on current page or entire dataset</li>
                <li><strong>Range selection:</strong> Shift+click to select a range of consecutive rows</li>
                <li><strong>Bulk actions:</strong> Export selected rows or delete multiple rows at once</li>
                <li><strong>Selection state:</strong> Visual feedback shows selected rows with highlighted background</li>
                <li><strong>Persistent:</strong> Selection maintained across pagination and sorting</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 2. COLUMNS TAB */}
        <Card>
          <CardHeader>
            <CardTitle>📐 Columns Tab</CardTitle>
            <CardDescription>Column visibility, ordering, resizing, and freezing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Pagination</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Standard, infinite scroll, or load more modes</li>
                <li>Configurable page size (5, 10, 20, 50, 100)</li>
                <li>First/last page navigation</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Sorting</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Single or multi-column sorting (Shift+click)</li>
                <li>Case-sensitive/insensitive options</li>
                <li>Alphabetic, numeric, or date sorting</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Filtering</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Global search across all columns</li>
                <li>Per-column filters (text, number, date, select)</li>
                <li>AND/OR filter logic</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Selection</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Single, multi, or radio selection modes</li>
                <li>Shift+click for range selection</li>
                <li>Bulk actions (export, delete)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Column Management */}
        <Card>
          <CardHeader>
            <CardTitle>📐 Column Management</CardTitle>
            <CardDescription>Control column behavior and appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">👁️ Column Visibility</p>
              <p className="text-muted-foreground mb-2">Control which columns are displayed in the table.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Show/Hide toggle:</strong> Use checkboxes to show or hide individual columns</li>
                <li><strong>Visibility presets:</strong> Save common column configurations for quick switching</li>
                <li><strong>Dynamic updates:</strong> Table instantly updates when column visibility changes</li>
                <li><strong>Default visible:</strong> Set which columns are shown by default on load</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🔄 Column Ordering</p>
              <p className="text-muted-foreground mb-2">Rearrange columns in any order you prefer.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Drag to reorder:</strong> Click and drag column headers or use reorder UI</li>
                <li><strong>Custom order:</strong> Set initial column order programmatically</li>
                <li><strong>Persistent order:</strong> Column order maintained across interactions</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📏 Column Widths</p>
              <p className="text-muted-foreground mb-2">Control the width of individual columns.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Fixed widths:</strong> Set exact pixel widths for columns</li>
                <li><strong>Auto-sizing:</strong> Let columns size based on content</li>
                <li><strong>Min/max constraints:</strong> Set minimum and maximum width boundaries</li>
                <li><strong>Resizable:</strong> Drag column borders to manually resize</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📌 Frozen Columns</p>
              <p className="text-muted-foreground mb-2">Pin columns so they stay visible during horizontal scrolling.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Freeze left:</strong> Pin first N columns to the left side (ideal for IDs, names)</li>
                <li><strong>Freeze right:</strong> Pin last N columns to the right side (ideal for actions)</li>
                <li><strong>Fixed position:</strong> Frozen columns use CSS sticky positioning</li>
                <li><strong>Z-index handling:</strong> Proper layering ensures frozen columns appear above scrolling content</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🏷️ Column Groups</p>
              <p className="text-muted-foreground mb-2">Organize related columns under group headers.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Multi-row headers:</strong> Create a header row above column names</li>
                <li><strong>Logical grouping:</strong> Group related columns (e.g., Personal Info, Contact Details, Statistics)</li>
                <li><strong>Spanning headers:</strong> Group headers span across multiple columns</li>
                <li><strong>Visual separation:</strong> Borders between groups for clear organization</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">↔️ Column Alignment</p>
              <p className="text-muted-foreground mb-2">Set text alignment for individual columns.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Per-column control:</strong> Set left, center, or right alignment</li>
                <li><strong>Best practices:</strong> Right-align numbers, left-align text, center-align icons/status</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 3. STYLE/APPEARANCE TAB */}
        <Card>
          <CardHeader>
            <CardTitle>🎨 Style Tab</CardTitle>
            <CardDescription>Table appearance, borders, shadows, and layout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">🎭 Display Modes</p>
              <p className="text-muted-foreground mb-2">Choose how the table appears to users.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Striped rows:</strong> Alternating background colors (zebra striping) for better readability</li>
                <li><strong>Compact mode:</strong> Reduced spacing for dense data display</li>
                <li><strong>Hover effects:</strong> Highlight rows on mouse over for better tracking</li>
                <li><strong>Borders:</strong> Show or hide table borders and cell dividers</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📦 Container Settings</p>
              <p className="text-muted-foreground mb-2">Control the table container appearance.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Width:</strong> Full width, 90%, 80%, or fixed 1200px with auto margins</li>
                <li><strong>Shadow depth:</strong> None, sm, md, lg, xl, 2xl for elevation effects</li>
                <li><strong>Border radius:</strong> None, sm, md, lg, xl, 2xl for rounded corners</li>
                <li><strong>Background opacity:</strong> Adjust transparency of table background (0-100)</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">↕️ Row Height</p>
              <p className="text-muted-foreground mb-2">Set vertical spacing for rows.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Extra small (xs):</strong> Minimal height, maximum density</li>
                <li><strong>Small (sm):</strong> Compact but comfortable</li>
                <li><strong>Medium (md):</strong> Balanced default spacing</li>
                <li><strong>Large (lg):</strong> Generous spacing for touch interfaces</li>
                <li><strong>Extra large (xl):</strong> Maximum spacing for accessibility</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📏 Cell Padding</p>
              <p className="text-muted-foreground mb-2">Control horizontal and vertical spacing within cells.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Padding levels:</strong> xs, sm, md, lg, xl for different spacing needs</li>
                <li><strong>Responsive padding:</strong> Automatically reduce padding on mobile devices</li>
                <li><strong>Consistent spacing:</strong> Applied uniformly across all cells</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🔲 Row Borders</p>
              <p className="text-muted-foreground mb-2">Control borders between rows.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>None:</strong> Clean look without dividing lines</li>
                <li><strong>Horizontal:</strong> Lines between rows only</li>
                <li><strong>All:</strong> Complete grid with horizontal and vertical lines</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 4. ROWS TAB */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Rows Tab</CardTitle>
            <CardDescription>Row features, actions, expansion, and inline editing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">↕️ Row Expansion</p>
              <p className="text-muted-foreground mb-2">Allow rows to expand and show additional nested content.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Expand icon:</strong> Chevron button in leftmost column to toggle expansion</li>
                <li><strong>Nested content:</strong> Show detailed information, nested tables, or custom components</li>
                <li><strong>Expandable rows:</strong> Configure which rows can be expanded</li>
                <li><strong>Default state:</strong> Set rows to be expanded or collapsed by default</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🎬 Row Actions</p>
              <p className="text-muted-foreground mb-2">Add action buttons to each row for common operations.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>View action:</strong> Eye icon to view row details</li>
                <li><strong>Edit action:</strong> Pencil icon to edit row data</li>
                <li><strong>Delete action:</strong> Trash icon to remove row</li>
                <li><strong>Position control:</strong> Place actions on left or right side of table</li>
                <li><strong>Frozen integration:</strong> Actions work with frozen columns</li>
                <li><strong>Custom actions:</strong> Add your own action buttons with handlers</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">✏️ Inline Editing</p>
              <p className="text-muted-foreground mb-2">Edit cell values directly within the table.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Double-click activation:</strong> Double-click any cell to enter edit mode</li>
                <li><strong>Input field:</strong> Cell converts to text input for editing</li>
                <li><strong>Save changes:</strong> Click checkmark or press Enter to save</li>
                <li><strong>Cancel editing:</strong> Click X or press Escape to discard changes</li>
                <li><strong>Visual feedback:</strong> Active edit state clearly indicated</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🖱️ Context Menu</p>
              <p className="text-muted-foreground mb-2">Right-click rows for additional actions.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Right-click menu:</strong> Context menu appears on right-click</li>
                <li><strong>Common actions:</strong> Copy, Edit, Delete, Export row</li>
                <li><strong>Custom options:</strong> Add your own menu items</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🎨 Row Styling</p>
              <p className="text-muted-foreground mb-2">Visual customization for rows.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Striped rows:</strong> Alternating colors for better readability</li>
                <li><strong>Hover color:</strong> Highlight effect on mouse over (multiple colors available)</li>
                <li><strong>Selected state:</strong> Visual indication of selected rows</li>
                <li><strong>Custom classes:</strong> Apply custom CSS classes per row</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 5. CELLS TAB */}
        <Card>
          <CardHeader>
            <CardTitle>🎭 Cells Tab</CardTitle>
            <CardDescription>Cell formatting, data types, and visual elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">💰 Currency Formatting</p>
              <p className="text-muted-foreground mb-2">Format numeric values as currency.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Format:</strong> $1,234.56 with proper thousand separators</li>
                <li><strong>Decimal places:</strong> Configurable precision (0-4 decimals)</li>
                <li><strong>Currency symbol:</strong> Dollar sign prefix</li>
                <li><strong>Right alignment:</strong> Automatically align currency right</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📅 Date Formatting</p>
              <p className="text-muted-foreground mb-2">Display dates in various formats.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Multiple formats:</strong> MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, relative (2 days ago)</li>
                <li><strong>Locale support:</strong> Format according to locale settings</li>
                <li><strong>Time included:</strong> Optional time display with dates</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🔢 Number Formatting</p>
              <p className="text-muted-foreground mb-2">Format numeric values for display.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Thousand separators:</strong> 1,234,567 for readability</li>
                <li><strong>Decimal places:</strong> Control precision (0-6 decimals)</li>
                <li><strong>Percentage:</strong> Display as 45.2% with percent sign</li>
                <li><strong>Scientific notation:</strong> 1.23e+6 for very large/small numbers</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🏷️ Badges & Status</p>
              <p className="text-muted-foreground mb-2">Visual indicators for status and categories.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Status badges:</strong> Colored badges (Active/Inactive, Success/Error, etc.)</li>
                <li><strong>Chips:</strong> Small pills for tags and categories</li>
                <li><strong>Color coding:</strong> Green for success, red for error, yellow for warning, blue for info</li>
                <li><strong>Icon support:</strong> Add icons to badges for extra context</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📝 Text Handling</p>
              <p className="text-muted-foreground mb-2">Control how text is displayed in cells.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Text wrapping:</strong> Wrap long text across multiple lines</li>
                <li><strong>Truncation:</strong> Cut off long text with ellipsis (...)</li>
                <li><strong>No wrap:</strong> Keep text on single line with horizontal scroll</li>
                <li><strong>Tooltips:</strong> Show full text in tooltip on hover for truncated content</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🎨 Custom Components</p>
              <p className="text-muted-foreground mb-2">Render custom React components in cells.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Progress bars:</strong> Visual progress indicators for percentages</li>
                <li><strong>Avatars:</strong> User profile images with fallback initials</li>
                <li><strong>Links:</strong> Clickable URLs with proper styling</li>
                <li><strong>Custom renderers:</strong> Full React component support per cell</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 6. CONTENT TAB */}
        <Card>
          <CardHeader>
            <CardTitle>📄 Content Tab</CardTitle>
            <CardDescription>Headers, footers, captions, and empty states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">🎯 Table Caption</p>
              <p className="text-muted-foreground mb-2">Add descriptive text above or below the table.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Caption text:</strong> Brief description of table contents</li>
                <li><strong>Position:</strong> Top or bottom of table</li>
                <li><strong>Accessibility:</strong> Improves screen reader experience</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">⬇️ Footer Rows</p>
              <p className="text-muted-foreground mb-2">Display summary rows at the bottom of the table.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Total row:</strong> Sum of numeric columns</li>
                <li><strong>Average row:</strong> Mean values across columns</li>
                <li><strong>Count row:</strong> Number of rows in dataset</li>
                <li><strong>Custom footer:</strong> Add your own calculated values</li>
                <li><strong>Multiple footers:</strong> Show multiple footer rows simultaneously</li>
                <li><strong>Sticky footer:</strong> Keep footer visible while scrolling</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📭 Empty States</p>
              <p className="text-muted-foreground mb-2">Show meaningful content when table has no data.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Default message:</strong> Simple &ldquo;No data available&rdquo; message</li>
                <li><strong>Custom empty state:</strong> Rich component with icon, title, description, and action buttons</li>
                <li><strong>Empty message text:</strong> Customize the text shown when no data</li>
                <li><strong>Add data button:</strong> Call-to-action to add first record</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">⏳ Loading State</p>
              <p className="text-muted-foreground mb-2">Display while data is being fetched.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Skeleton rows:</strong> Animated placeholder rows</li>
                <li><strong>Loading text:</strong> &ldquo;Loading data...&rdquo; message</li>
                <li><strong>Spinner:</strong> Rotating loading indicator</li>
                <li><strong>Custom loader:</strong> Use your own loading component</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">❌ Error State</p>
              <p className="text-muted-foreground mb-2">Handle and display data loading errors.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Error message:</strong> Display specific error text</li>
                <li><strong>Error icon:</strong> Visual indicator of error state</li>
                <li><strong>Retry button:</strong> Allow users to retry failed data fetch</li>
                <li><strong>Custom error handler:</strong> Implement your own error handling logic</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 7. TYPOGRAPHY TAB */}
        <Card>
          <CardHeader>
            <CardTitle>Aa Typography Tab</CardTitle>
            <CardDescription>Font sizes, weights, families, and text alignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">📏 Font Size</p>
              <p className="text-muted-foreground mb-2">Control the size of text throughout the table.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Extra small (xs):</strong> 12px - Maximum density, more data visible</li>
                <li><strong>Small (sm):</strong> 14px - Comfortable for reading</li>
                <li><strong>Base:</strong> 16px - Standard web font size</li>
                <li><strong>Large (lg):</strong> 18px - Improved readability</li>
                <li><strong>Extra large (xl):</strong> 20px - Accessibility-friendly</li>
                <li><strong>Responsive:</strong> Automatically reduce font size on mobile devices</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">💪 Font Weight</p>
              <p className="text-muted-foreground mb-2">Adjust the thickness/boldness of text.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Normal (400):</strong> Standard text weight</li>
                <li><strong>Medium (500):</strong> Slightly heavier for emphasis</li>
                <li><strong>Semibold (600):</strong> Clear hierarchy and emphasis</li>
                <li><strong>Bold (700):</strong> Maximum emphasis for important data</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🔤 Font Family</p>
              <p className="text-muted-foreground mb-2">Choose the typeface for table text.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Sans-serif:</strong> Modern, clean (default for most UIs)</li>
                <li><strong>Serif:</strong> Traditional, formal appearance</li>
                <li><strong>Monospace:</strong> Fixed-width font ideal for code, numbers, IDs</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">↔️ Text Alignment</p>
              <p className="text-muted-foreground mb-2">Control horizontal text alignment in cells.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Left align:</strong> Default for text content</li>
                <li><strong>Center align:</strong> Good for short text, icons, status badges</li>
                <li><strong>Right align:</strong> Best practice for numbers and currency</li>
                <li><strong>Per-column:</strong> Set different alignment for each column</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 8. HEADER TAB */}
        <Card>
          <CardHeader>
            <CardTitle>📌 Header Tab</CardTitle>
            <CardDescription>Header styling, sticky headers, tooltips, and multi-row headers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">🎨 Header Styling</p>
              <p className="text-muted-foreground mb-2">Customize the appearance of header cells.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Background color:</strong> Default, primary, secondary, accent, muted, destructive</li>
                <li><strong>Text color:</strong> Foreground, primary, secondary, muted, accent colors</li>
                <li><strong>Font weight:</strong> Normal, medium, semibold, bold for header emphasis</li>
                <li><strong>Alignment:</strong> Left, center, or right align header text</li>
                <li><strong>Border style:</strong> None, bottom border, or full borders around headers</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📍 Sticky Header</p>
              <p className="text-muted-foreground mb-2">Keep headers visible while scrolling through data.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Fixed position:</strong> Headers stay at top during vertical scroll</li>
                <li><strong>Z-index handling:</strong> Headers layer properly above content</li>
                <li><strong>Background preservation:</strong> Maintains header background while scrolling</li>
                <li><strong>Works with groups:</strong> Multi-row headers stick together</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">💬 Header Tooltips</p>
              <p className="text-muted-foreground mb-2">Show helpful information on header hover.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Column descriptions:</strong> Explain what each column contains</li>
                <li><strong>Data type info:</strong> Indicate expected data format</li>
                <li><strong>Hover trigger:</strong> Tooltip appears on mouse over</li>
                <li><strong>Custom content:</strong> Set unique tooltip for each column</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📊 Multi-Row Headers</p>
              <p className="text-muted-foreground mb-2">Create complex header structures with column groups.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Group headers:</strong> Top row with grouped column names</li>
                <li><strong>Column headers:</strong> Bottom row with individual column names</li>
                <li><strong>Spanning:</strong> Group headers span across multiple columns</li>
                <li><strong>Logical organization:</strong> Group related columns (e.g., Personal, Contact, Sales)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 9. FEATURES TAB (Advanced) */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Features Tab</CardTitle>
            <CardDescription>Advanced features: row numbering, conditional formatting, heatmaps, grouping, tree view, and virtual scrolling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">🔢 Row Numbering</p>
              <p className="text-muted-foreground mb-2">Display sequential numbers for each row to improve navigation and reference.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Position:</strong> Show row numbers on the left or right side of the table</li>
                <li><strong>Sequential numbering:</strong> Automatically numbered 1, 2, 3, etc.</li>
                <li><strong>Pagination awareness:</strong> Numbers update correctly when navigating pages (e.g., page 2 starts at row 11 if page size is 10)</li>
                <li><strong>Frozen column:</strong> Row number column can be frozen for easy reference while scrolling</li>
                <li><strong>Custom styling:</strong> Apply different styles to the row number column</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🎨 Conditional Formatting</p>
              <p className="text-muted-foreground mb-2">Automatically highlight cells based on rules to draw attention to important data patterns.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>9 condition types:</strong> Equals, not equals, greater than, less than, between, contains text, starts with, ends with, is empty</li>
                <li><strong>11 predefined styles:</strong> Yellow highlight, green highlight, red highlight, blue highlight, bold text, italic text, red text, green text, blue text, border highlight, cell background</li>
                <li><strong>Multiple rules:</strong> Apply multiple conditional formatting rules to the same table</li>
                <li><strong>Column selection:</strong> Choose which column to apply the rule to</li>
                <li><strong>Priority system:</strong> Rules are applied in order, earlier rules take precedence</li>
                <li><strong>Real-time updates:</strong> Formatting updates immediately when data changes</li>
                <li><strong>Visual indicators:</strong> Makes patterns, outliers, and critical values immediately visible</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🌡️ Heatmap Coloring</p>
              <p className="text-muted-foreground mb-2">Visualize numeric data with color gradients that make patterns and distributions instantly recognizable.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>4 color schemes:</strong> Green (low to high intensity), Blue (cool gradient), Red (heat gradient), Purple (vibrant gradient)</li>
                <li><strong>Auto-calculated ranges:</strong> Automatically determines min and max values from the data</li>
                <li><strong>Gradient mapping:</strong> Lower values get lighter colors, higher values get darker/more saturated colors</li>
                <li><strong>Column selection:</strong> Apply heatmap to one or multiple numeric columns</li>
                <li><strong>Visual analysis:</strong> Instantly spot high/low values, trends, and outliers</li>
                <li><strong>Maintains readability:</strong> Text color automatically adjusts for contrast against background</li>
                <li><strong>Dynamic updates:</strong> Heatmap recalculates when data or filters change</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">📁 Grouping & Subtotals</p>
              <p className="text-muted-foreground mb-2">Organize data into logical groups with automatic calculations and expand/collapse functionality.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Group by any column:</strong> Select any column to group rows by its unique values</li>
                <li><strong>Expandable groups:</strong> Click to expand/collapse groups to show or hide detail rows</li>
                <li><strong>Automatic subtotals:</strong> Numeric columns automatically calculate sum, average, count for each group</li>
                <li><strong>Group headers:</strong> Clear headers showing the group value and row count</li>
                <li><strong>Default state:</strong> Set groups to be expanded or collapsed by default</li>
                <li><strong>Nested grouping:</strong> Support for multi-level grouping hierarchies</li>
                <li><strong>Summary rows:</strong> Each group shows summary statistics at the bottom</li>
                <li><strong>Performance:</strong> Large datasets remain performant with virtualization</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">🌳 Tree View</p>
              <p className="text-muted-foreground mb-2">Display hierarchical parent-child relationships with expandable tree structure and visual indentation.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Parent-child relationships:</strong> Define hierarchical data with parentId references</li>
                <li><strong>Expandable nodes:</strong> Click expand/collapse icons to show/hide child rows</li>
                <li><strong>Visual indentation:</strong> Child rows are indented to show hierarchy level</li>
                <li><strong>Configurable columns:</strong> Specify which columns contain the node ID and parent ID</li>
                <li><strong>Expand/collapse all:</strong> Buttons to expand or collapse entire tree</li>
                <li><strong>Multiple root nodes:</strong> Support for multiple top-level parent items</li>
                <li><strong>Unlimited depth:</strong> No limit on nesting levels (grandchildren, great-grandchildren, etc.)</li>
                <li><strong>Icon indicators:</strong> Folder/chevron icons show expandable state</li>
                <li><strong>Use cases:</strong> Organization charts, file systems, category trees, bill of materials</li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-semibold mb-2">⚡ Virtual Scrolling</p>
              <p className="text-muted-foreground mb-2">Optimize performance for massive datasets by rendering only visible rows in the viewport.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Performance optimization:</strong> Handle 10,000+ rows without lag or memory issues</li>
                <li><strong>Renders visible only:</strong> Only DOM nodes for visible rows are created, dramatically reducing render time</li>
                <li><strong>Smooth scrolling:</strong> Scroll smoothly through massive datasets with no performance degradation</li>
                <li><strong>Configurable container height:</strong> Set fixed height (400px, 600px, 800px) for the scrollable area</li>
                <li><strong>Configurable row height:</strong> Define row height (sm, md, lg) for accurate scroll calculations</li>
                <li><strong>Dynamic rendering:</strong> Rows are created/destroyed as you scroll, maintaining consistent memory usage</li>
                <li><strong>Overscan buffer:</strong> Renders a few extra rows above/below viewport for smoother experience</li>
                <li><strong>Works with all features:</strong> Compatible with sorting, filtering, selection, and other table features</li>
                <li><strong>When to use:</strong> Enable for datasets over 1,000 rows, critical for 5,000+ rows</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
