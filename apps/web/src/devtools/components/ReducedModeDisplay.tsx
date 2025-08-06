'use client'

import { ReactNode } from 'react'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { cn } from '@repo/ui/lib/utils'
import { ReducedModeConfig, PluginContext } from '../types'

interface ReducedModeDisplayProps {
  config: ReducedModeConfig
  context: PluginContext
}

/**
 * Component that renders the reduced mode display for a plugin
 */
export function ReducedModeDisplay({ config, context }: ReducedModeDisplayProps) {
  // Get dynamic data if getDisplayData function is provided
  const dynamicConfig = config.getDisplayData?.() || {}
  const finalConfig = { ...config, ...dynamicConfig }

  switch (finalConfig.displayType) {
    case 'status':
      return (
        <Badge 
          variant={finalConfig.status?.variant || 'default'}
          className="text-xs"
        >
          {finalConfig.status?.text || 'Status'}
        </Badge>
      )
      
    case 'counter':
      const { value = 0, label, max } = finalConfig.counter || {}
      return (
        <div className="text-xs flex items-center gap-1">
          <span className="font-medium">{value}</span>
          {max && (
            <span className="text-muted-foreground">/{max}</span>
          )}
          {label && (
            <span className="text-muted-foreground">{label}</span>
          )}
        </div>
      )
      
    case 'indicator':
      const { color = 'gray', animate = false } = finalConfig.indicator || {}
      const colorClasses = {
        green: 'bg-green-500',
        red: 'bg-red-500', 
        yellow: 'bg-yellow-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        gray: 'bg-gray-500'
      }
      
      return (
        <div className={cn(
          'h-2 w-2 rounded-full',
          colorClasses[color],
          animate && 'animate-pulse'
        )} />
      )
      
    case 'text':
      const { value: textValue = '', size = 'sm' } = finalConfig.text || {}
      const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm', 
        lg: 'text-base'
      }
      
      return (
        <span className={cn(
          'truncate max-w-20',
          sizeClasses[size]
        )}>
          {textValue}
        </span>
      )
      
    case 'custom':
      const CustomComponent = finalConfig.customComponent
      if (!CustomComponent) {
        return null
      }
      return <CustomComponent context={context} />
      
    default:
      return null
  }
}

/**
 * Indicator dot component for simple status display
 */
export function StatusIndicator({ 
  color, 
  animate = false, 
  size = 'sm' 
}: { 
  color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray'
  animate?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500', 
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500'
  }
  
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }
  
  return (
    <div className={cn(
      'rounded-full',
      colorClasses[color],
      sizeClasses[size],
      animate && 'animate-pulse'
    )} />
  )
}

/**
 * Counter display component
 */
export function CounterDisplay({ 
  value, 
  max, 
  label 
}: { 
  value: number
  max?: number
  label?: string 
}) {
  return (
    <div className="text-xs flex items-center gap-1">
      <span className="font-medium">{value}</span>
      {max && (
        <span className="text-muted-foreground">/{max}</span>
      )}
      {label && (
        <span className="text-muted-foreground">{label}</span>
      )}
    </div>
  )
}