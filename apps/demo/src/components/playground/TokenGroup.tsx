import { ColorToken } from '@/types/playground'
import { ColorEditor } from './ColorEditor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react'

interface TokenItem {
  key: string
  label: string
  description?: string
  contrastWith?: string
}

interface TokenGroupProps {
  title: string
  description?: string
  tokens: Record<string, ColorToken>
  items: TokenItem[]
  onChange: (key: string, color: ColorToken) => void
  className?: string
}

export const TokenGroup: React.FC<TokenGroupProps> = ({
  title,
  description,
  tokens,
  items,
  onChange,
  className = '',
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <ColorEditor
            key={item.key}
            label={item.label}
            description={item.description}
            color={tokens[item.key]}
            onChange={(color) => onChange(item.key, color)}
            contrastWith={item.contrastWith ? tokens[item.contrastWith] : undefined}
          />
        ))}
      </CardContent>
    </Card>
  )
}
