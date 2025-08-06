'use client'

import { useState } from 'react'
import { Settings, X, Maximize2, Minimize2, MoreHorizontal, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@repo/ui/components/shadcn/button'
import { Card, CardContent } from '@repo/ui/components/shadcn/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/components/shadcn/tabs'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Separator } from '@repo/ui/components/shadcn/separator'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@repo/ui/components/shadcn/dropdown-menu'

import { cn } from '@repo/ui/lib/utils'
import { usePluginRegistry } from '../core/plugin-registry'
import { useDevToolState } from '../core/devtool-state'
import { DevToolState } from '../types'
import { OptionRenderer } from './OptionRenderer'

// Map of icon names to components
const IconMap = {
  Settings,
  ArrowLeft,
  ArrowRight, 
  ArrowUp,
  ArrowDown,
} as const

function getIconComponent(iconName: string | React.ReactNode) {
  if (typeof iconName === 'string' && iconName in IconMap) {
    const IconComponent = IconMap[iconName as keyof typeof IconMap]
    return <IconComponent className="h-4 w-4" />
  }
  if (typeof iconName === 'object') {
    return iconName
  }
  return <Settings className="h-4 w-4" />
}

/**
 * Main DevTool panel component with three states: none, normal, expanded
 */
export function DevToolPanel() {
  const { state, position, activeTab, setState, setPosition, setActiveTab, toggle, cycle } = useDevToolState()
  const registry = usePluginRegistry()
  const activePlugins = registry.getActivePlugins()

  // Don't render anything in NONE state
  if (state === DevToolState.NONE) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setState(DevToolState.NORMAL)}
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

  // NORMAL state - side bar
  if (state === DevToolState.NORMAL) {
    return <NormalStateBar />
  }

  // EXPANDED state - bottom panel or separate window
  return <ExpandedStatePanel />
}

/**
 * Normal state - side bar like Laravel DevBar
 */
function NormalStateBar() {
  const { position, setPosition, setState } = useDevToolState()
  const registry = usePluginRegistry()
  const activePlugins = registry.getActivePlugins()

  const sidebarClasses = {
    left: 'left-0 top-0 h-full w-12 flex-col',
    right: 'right-0 top-0 h-full w-12 flex-col', 
    top: 'top-0 left-0 w-full h-12 flex-row',
    bottom: 'bottom-0 left-0 w-full h-12 flex-row'
  }

  const positionIcons = {
    left: ArrowRight,
    right: ArrowLeft,
    top: ArrowDown, 
    bottom: ArrowUp
  }

  const PositionIcon = positionIcons[position.side]

  return (
    <div className={cn(
      'fixed z-50 bg-background/95 backdrop-blur border shadow-lg flex items-center justify-center',
      sidebarClasses[position.side],
      position.side === 'left' && 'border-r',
      position.side === 'right' && 'border-l', 
      position.side === 'top' && 'border-b',
      position.side === 'bottom' && 'border-t'
    )}>
      <div className={cn(
        'flex gap-1',
        (position.side === 'left' || position.side === 'right') && 'flex-col',
        (position.side === 'top' || position.side === 'bottom') && 'flex-row'
      )}>
        {/* DevTool toggle button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setState(DevToolState.EXPANDED)}
          className="h-8 w-8 p-0"
          title="Expand DevTools"
        >
          <Maximize2 className="h-3 w-3" />
        </Button>

        <Separator 
          orientation={position.side === 'left' || position.side === 'right' ? 'horizontal' : 'vertical'} 
          className="my-1" 
        />

        {/* Plugin indicators */}
        {activePlugins.slice(0, 3).map((plugin) => (
          <Button
            key={plugin.metadata.id}
            variant="ghost"
            size="sm"
            onClick={() => setState(DevToolState.EXPANDED)}
            className="h-8 w-8 p-0"
            title={plugin.metadata.name}
          >
            {getIconComponent(plugin.metadata.icon)}
          </Button>
        ))}

        {activePlugins.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setState(DevToolState.EXPANDED)}
            className="h-8 w-8 p-0"
            title={`+${activePlugins.length - 3} more plugins`}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        )}

        <Separator 
          orientation={position.side === 'left' || position.side === 'right' ? 'horizontal' : 'vertical'} 
          className="my-1" 
        />

        {/* Position and settings menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="DevTool settings"
            >
              <PositionIcon className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem onClick={() => setState(DevToolState.EXPANDED)}>
              <Maximize2 className="h-4 w-4 mr-2" />
              Expand
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setState(DevToolState.NONE)}>
              <X className="h-4 w-4 mr-2" />
              Hide
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setPosition({ side: 'left' })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Left side
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPosition({ side: 'right' })}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Right side  
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPosition({ side: 'top' })}>
              <ArrowUp className="h-4 w-4 mr-2" />
              Top
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPosition({ side: 'bottom' })}>
              <ArrowDown className="h-4 w-4 mr-2" />
              Bottom
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

/**
 * Expanded state - bottom center panel
 */
function ExpandedStatePanel() {
  const { activeTab, setActiveTab, setState } = useDevToolState()
  const registry = usePluginRegistry()
  const activePlugins = registry.getActivePlugins()

  // Set first plugin as active tab if none selected
  if (!activeTab && activePlugins.length > 0) {
    setActiveTab(activePlugins[0].metadata.id)
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-6xl mb-4">
      <Card className="border-2 shadow-2xl">
        {/* Header with tabs and controls */}
        <div className="border-b bg-muted/30 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">DevTools</span>
                <Badge variant="secondary" className="text-xs">
                  v1.0.0
                </Badge>
              </div>
              
              {activePlugins.length > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-xs text-muted-foreground">
                    {activePlugins.length} plugins active
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState(DevToolState.NORMAL)}
                className="h-6 w-6 p-0"
                title="Minimize to sidebar"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState(DevToolState.NONE)}
                className="h-6 w-6 p-0"
                title="Close DevTools"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Plugin tabs content */}
        <CardContent className="p-0">
          {activePlugins.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-sm text-muted-foreground">
                No plugins active. Register some plugins to get started.
              </div>
            </div>
          ) : (
            <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="w-full">
              {/* Tab navigation */}
              <div className="border-b px-4 py-2">
                <TabsList className="h-8">
                  {activePlugins.map((plugin) => (
                    <TabsTrigger 
                      key={plugin.metadata.id} 
                      value={plugin.metadata.id}
                      className="text-xs px-3 h-6 flex items-center gap-2"
                    >
                      {plugin.metadata.icon && (
                        <span className="text-muted-foreground">
                          {getIconComponent(plugin.metadata.icon)}
                        </span>
                      )}
                      {plugin.metadata.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Tab content */}
              <div className="h-[400px] overflow-y-auto">
                {activePlugins.map((plugin) => (
                  <TabsContent 
                    key={plugin.metadata.id} 
                    value={plugin.metadata.id}
                    className="mt-0 p-4"
                  >
                    <PluginContent plugin={plugin} />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Renders a single plugin's content within a tab
 */
function PluginContent({ plugin }: { plugin: any }) {
  const registry = usePluginRegistry()
  const context = {
    metadata: plugin.metadata,
    isActive: registry.isActive(plugin.metadata.id),
    activate: () => registry.activate(plugin.metadata.id),
    deactivate: () => registry.deactivate(plugin.metadata.id)
  }

  return (
    <div className="space-y-4">
      {/* Plugin header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{plugin.metadata.name}</h3>
          {plugin.metadata.description && (
            <p className="text-sm text-muted-foreground">{plugin.metadata.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {plugin.metadata.version}
          </Badge>
          {plugin.metadata.author && (
            <span className="text-xs text-muted-foreground">
              by {plugin.metadata.author}
            </span>
          )}
        </div>
      </div>

      <Separator />

      {/* Plugin options */}
      <div className="space-y-4">
        {plugin.options.map((option: any) => (
          <OptionRenderer
            key={option.id}
            option={option}
            context={context}
          />
        ))}
      </div>
    </div>
  )
}