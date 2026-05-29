import React from 'react'
import { BaseIcon } from './base-icon'
import InfoIcon2 from '@/components/icons/svg/info.svg?react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

/**
 * Acronis Icon Library
 * All icons follow the 16x16 viewBox standard from Figma
 */

export function InfoIcon({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <InfoIcon2 />
    </BaseIcon>
  )
}

export function SuccessIcon({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <circle cx="8" cy="8" r="8" fill="#9BC225" />
      <path d="M5 8L7 10L11 6" stroke="#243143" strokeWidth="2" fill="none" />
    </BaseIcon>
  )
}

export function WarningIcon({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M8 1L15 15H1L8 1Z" fill="#FFC107" />
      <rect x="7" y="6" width="2" height="5" fill="#243143" />
    </BaseIcon>
  )
}

export function CriticalIcon({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <circle cx="8" cy="8" r="8" fill="#FF810D" />
      <rect x="7" y="4" width="2" height="8" fill="#243143" />
    </BaseIcon>
  )
}

export function DangerIcon({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <circle cx="8" cy="8" r="8" fill="#EA3939" />
      <path d="M5 5L11 11M11 5L5 11" stroke="#243143" strokeWidth="2" />
    </BaseIcon>
  )
}

// Example of a more complex icon with multiple paths
export function CloseIcon({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </BaseIcon>
  )
}

// Example using currentColor for theme-aware icons
export function ChevronDownIcon({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </BaseIcon>
  )
}
