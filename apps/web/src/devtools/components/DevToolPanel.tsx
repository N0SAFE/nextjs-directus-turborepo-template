'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, Settings, X, User, Shield, Clock } from 'lucide-react'
import { Button } from '@repo/ui/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Separator } from '@repo/ui/components/shadcn/separator'

import { cn } from '@repo/ui/lib/utils'
import { usePluginRegistry, usePluginContext } from '../core/plugin-registry'
import { OptionRenderer } from './OptionRenderer'
import { PluginOption } from '../types'

// Map of icon names to components
const IconMap = {
  User,
  Settings,
  Shield,
  Clock,
} as const

function getIconComponent(iconName: string | React.ReactNode) {
  if (typeof iconName === 'string' && iconName in IconMap) {
    const IconComponent = IconMap[iconName as keyof typeof IconMap]
    return <IconComponent className="h-4 w-4" />
  }
  if (typeof iconName === 'object') {
    return iconName
  }
  return null
}

/**
 * Main DevTool panel component
 */
export function DevToolPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  
  const registry = usePluginRegistry()
  const activePlugins = registry.getActivePlugins()

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="secondary"
          size="sm"
          className="shadow-lg"
        >
          <Settings className="h-4 w-4 mr-2" />
          DevTools
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[500px] max-h-[700px] shadow-2xl">
      <Card className="border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">DevTools</CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-6 w-6 p-0"
              >
                {isCollapsed ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{activePlugins.length} plugins active</span>
              {activePlugins.length > 0 && (
                <>
                  <Separator orientation="vertical" className="h-3" />
                  <Badge variant="secondary" className="text-xs">
                    v1.0.0
                  </Badge>
                </>
              )}
            </div>
          )}
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="p-0">
            {activePlugins.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No plugins active. Register some plugins to get started.
              </div>
            ) : (
              <div className="h-[500px] overflow-y-auto">
                <div className="p-4 space-y-4">
                  {activePlugins.map((plugin) => (
                    <PluginCard key={plugin.metadata.id} plugin={plugin} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}

/**
 * Renders a single plugin as a card with its options
 */
function PluginCard({ plugin }: { plugin: any }) {
  const context = usePluginContext(plugin.metadata.id)

  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {plugin.metadata.icon && (
              <span className="text-muted-foreground">
                {getIconComponent(plugin.metadata.icon)}
              </span>
            )}
            {plugin.metadata.name}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {plugin.metadata.version}
          </Badge>
        </div>
        {plugin.metadata.description && (
          <p className="text-xs text-muted-foreground">{plugin.metadata.description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {plugin.options.map((option: PluginOption) => (
          <OptionRenderer
            key={option.id}
            option={option}
            context={context}
          />
        ))}
      </CardContent>
    </Card>
  )
}