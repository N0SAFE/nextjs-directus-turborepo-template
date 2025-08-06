'use client'

import { ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/shadcn/dropdown-menu'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Button } from '@repo/ui/components/shadcn/button'
import { ReducedModeConfig, PluginContext, ReducedModeMenuItem, ReducedModeMenuGroup } from '../types'

interface ReducedModeMenuProps {
  config: ReducedModeConfig
  context: PluginContext
  trigger: ReactNode
  onOpenChange?: (open: boolean) => void
}

/**
 * Menu component for plugin interaction in reduced mode
 */
export function ReducedModeMenu({ config, context, trigger, onOpenChange }: ReducedModeMenuProps) {
  const menu = config.menu
  
  if (!menu) {
    return <>{trigger}</>
  }

  // Get dynamic data if getData function is provided
  const dynamicData = config.getData?.() || {}
  const finalMenu = dynamicData.menu || menu

  const renderMenuItem = (item: ReducedModeMenuItem) => (
    <DropdownMenuItem
      key={item.id}
      onClick={item.action}
      disabled={item.disabled}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        {item.icon && (
          <span className="flex-shrink-0">
            {typeof item.icon === 'string' ? (
              <div className="h-4 w-4 bg-gray-400 rounded" />
            ) : (
              item.icon
            )}
          </span>
        )}
        <div>
          <div className="font-medium">{item.label}</div>
          {item.description && (
            <div className="text-xs text-muted-foreground">{item.description}</div>
          )}
        </div>
      </div>
      {item.badge && (
        <Badge variant="secondary" className="text-xs">
          {item.badge}
        </Badge>
      )}
    </DropdownMenuItem>
  )

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel>
          {context.metadata.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {'groups' in finalMenu ? (
          // Render grouped menu items
          finalMenu.groups.map((group: ReducedModeMenuGroup, groupIndex: number) => (
            <div key={groupIndex}>
              {groupIndex > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {group.label}
              </DropdownMenuLabel>
              {group.items.map(renderMenuItem)}
            </div>
          ))
        ) : (
          // Render simple menu items
          finalMenu.items.map(renderMenuItem)
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Quick action button for simple plugin actions
 */
export function QuickActionButton({ 
  label, 
  action, 
  icon, 
  variant = 'ghost',
  size = 'sm'
}: {
  label: string
  action: () => void
  icon?: ReactNode
  variant?: 'ghost' | 'outline' | 'secondary'
  size?: 'sm' | 'default' | 'lg'
}) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={action}
      className="h-6 text-xs"
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </Button>
  )
}