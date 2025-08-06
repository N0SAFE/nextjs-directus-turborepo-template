'use client'

import { useState } from 'react'
import { 
  Settings, 
  X, 
  Maximize2, 
  Minimize2, 
  MoreHorizontal, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Button } from '@repo/ui/components/shadcn/button'
import { Card, CardContent } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Separator } from '@repo/ui/components/shadcn/separator'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@repo/ui/components/shadcn/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from '@repo/ui/components/shadcn/sidebar'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@repo/ui/components/shadcn/tooltip'

import { cn } from '@repo/ui/lib/utils'
import { usePluginRegistry } from '../core/plugin-registry'
import { useDevToolState } from '../core/devtool-state'
import { DevToolState, PluginPage, PluginGroup, DevToolPlugin } from '../types'
import { routesPlugin, bundlesPlugin, cliPlugin } from '../core/plugins'
import { ReducedModeDisplay } from './ReducedModeDisplay'
import { ReducedModeMenu } from './ReducedModeMenu'
import { DevToolSettings } from './DevToolSettings'

// Map of icon names to components
const IconMap = {
  Settings,
  ArrowLeft,
  ArrowRight, 
  ArrowUp,
  ArrowDown,
  Activity: () => <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse" />,
  Cpu: () => <div className="h-4 w-4 bg-blue-500 rounded" />,
  Terminal: () => <div className="h-4 w-4 bg-gray-800 rounded" />,
  AlertTriangle: () => <div className="h-4 w-4 bg-yellow-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />,
  Bug: () => <div className="h-4 w-4 bg-red-500 rounded-full" />,
  Sliders: () => <div className="h-4 w-4 bg-gray-500 rounded" />,
  Wrench: () => <div className="h-4 w-4 bg-orange-500 rounded" />,
  Database: () => <div className="h-4 w-4 bg-purple-500 rounded" />,
  User: () => <div className="h-4 w-4 bg-indigo-500 rounded-full" />,
  Shield: () => <div className="h-4 w-4 bg-green-600" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />,
  Info: () => <div className="h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">i</div>,
  Code: () => <div className="h-4 w-4 bg-gray-700 rounded flex items-center justify-center text-white text-xs">{`<>`}</div>,
} as const

function getIconComponent(iconName: string | React.ReactNode) {
  if (typeof iconName === 'string' && iconName in IconMap) {
    const IconComponent = IconMap[iconName as keyof typeof IconMap]
    return <IconComponent />
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
  const { state, setState } = useDevToolState()

  // Don't render anything in NONE state
  if (state === DevToolState.NONE) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setState(DevToolState.NORMAL)}
                variant="secondary"
                size="sm"
                className="shadow-lg"
              >
                <Settings className="h-4 w-4 mr-2" />
                DevTools
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show DevTools</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  // NORMAL state - side bar
  if (state === DevToolState.NORMAL) {
    return <NormalStateBar />
  }

  // EXPANDED state - sidebar layout
  return <ExpandedStatePanel />
}

/**
 * Normal state - side bar like Laravel DevBar with tooltips
 */
function NormalStateBar() {
  const { position, setPosition, setState, settings, isPluginPinned } = useDevToolState()
  const registry = usePluginRegistry()
  const additionalPlugins = registry.getActivePlugins()

  // Core plugins that are always available
  const corePlugins: DevToolPlugin[] = [routesPlugin, bundlesPlugin, cliPlugin]
  const allPlugins = [...corePlugins, ...additionalPlugins]
  
  // Filter plugins to only show pinned ones, or default to first few if none pinned
  const pinnedPlugins = allPlugins.filter(plugin => isPluginPinned(plugin.metadata.id))
  const pluginsToShow = pinnedPlugins.length > 0 
    ? pinnedPlugins.slice(0, settings.maxNormalPlugins)
    : allPlugins.slice(0, Math.min(3, settings.maxNormalPlugins))

  const sidebarClasses = {
    left: 'left-0 top-0 h-full w-16 flex-col',
    right: 'right-0 top-0 h-full w-16 flex-col', 
    top: 'top-0 left-0 w-full h-14 flex-row',
    bottom: 'bottom-0 left-0 w-full h-14 flex-row'
  }

  const positionIcons = {
    left: ArrowRight,
    right: ArrowLeft,
    top: ArrowDown, 
    bottom: ArrowUp
  }

  const PositionIcon = positionIcons[position.side]

  const wrapWithTooltip = (content: React.ReactNode, tooltipContent: React.ReactNode) => {
    if (!settings.showTooltips) return content
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn(
        'fixed z-50 bg-background/95 backdrop-blur border shadow-lg flex items-center justify-center',
        sidebarClasses[position.side],
        position.side === 'left' && 'border-r',
        position.side === 'right' && 'border-l', 
        position.side === 'top' && 'border-b',
        position.side === 'bottom' && 'border-t'
      )} style={{ 
        width: (position.side === 'left' || position.side === 'right') ? `${position.size}px` : 'auto',
        height: (position.side === 'top' || position.side === 'bottom') ? `${position.size}px` : 'auto'
      }}>
        <div className={cn(
          'flex gap-1',
          (position.side === 'left' || position.side === 'right') && 'flex-col',
          (position.side === 'top' || position.side === 'bottom') && 'flex-row'
        )}>
          {/* DevTool toggle button */}
          {wrapWithTooltip(
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setState(DevToolState.EXPANDED)}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>,
            <p>Expand DevTools</p>
          )}

          <Separator 
            orientation={position.side === 'left' || position.side === 'right' ? 'horizontal' : 'vertical'} 
            className="my-1" 
          />

          {/* Plugin indicators with reduced mode configuration - only show pinned plugins */}
          {pluginsToShow.map((plugin) => {
            const context = {
              metadata: plugin.metadata,
              isActive: true, // Core plugins are always active
              activate: () => {},
              deactivate: () => {}
            }
            
            const isVertical = position.side === 'left' || position.side === 'right'
            
            // If plugin has reduced config with menu, use menu, otherwise fallback to simple tooltip
            if (plugin.reduced?.menu) {
              return (
                <ReducedModeMenu
                  key={plugin.metadata.id}
                  config={plugin.reduced}
                  context={context}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "p-1 flex items-center justify-center gap-1",
                        isVertical ? "h-10 w-10 flex-col" : "h-8 px-2 flex-row",
                        settings.enableAnimations && "transition-all duration-200"
                      )}
                    >
                      <div className="flex items-center justify-center flex-shrink-0">
                        {getIconComponent(plugin.metadata.icon)}
                      </div>
                      {plugin.reduced && (
                        <div className="flex items-center justify-center min-w-0">
                          <ReducedModeDisplay config={plugin.reduced} context={context} />
                        </div>
                      )}
                    </Button>
                  }
                />
              )
            }
            
            // Fallback to simple tooltip for plugins without reduced config
            return wrapWithTooltip(
              <Button
                key={plugin.metadata.id}
                variant="ghost"
                size="sm"
                onClick={() => setState(DevToolState.EXPANDED)}
                className={cn(
                  "p-1 flex items-center justify-center gap-1",
                  isVertical ? "h-10 w-10 flex-col" : "h-8 px-2 flex-row",
                  settings.enableAnimations && "transition-all duration-200"
                )}
              >
                <div className="flex items-center justify-center flex-shrink-0">
                  {getIconComponent(plugin.metadata.icon)}
                </div>
                {plugin.reduced && (
                  <div className="flex items-center justify-center min-w-0">
                    <ReducedModeDisplay config={plugin.reduced} context={context} />
                  </div>
                )}
              </Button>,
              <>
                <p>{plugin.metadata.name}</p>
                {plugin.metadata.description && (
                  <p className="text-xs text-muted-foreground">{plugin.metadata.description}</p>
                )}
              </>
            )
          })}

          {allPlugins.length > pluginsToShow.length && (
            wrapWithTooltip(
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState(DevToolState.EXPANDED)}
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>,
              <p>{`+${allPlugins.length - pluginsToShow.length} more plugins`}</p>
            )
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
    </TooltipProvider>
  )
}

/**
 * Expanded state - full sidebar layout
 */
function ExpandedStatePanel() {
  const { setState } = useDevToolState()
  const registry = usePluginRegistry()
  const additionalPlugins = registry.getActivePlugins()
  const selectedPageData = registry.getSelectedPage()

  // Core plugins that are always available
  const corePlugins: DevToolPlugin[] = [routesPlugin, bundlesPlugin, cliPlugin]

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-6xl mb-4">
      <Card className="border-2 shadow-2xl h-[70vh]">
        <SidebarProvider defaultOpen={true}>
          <div className="flex w-full h-auto">
            {/* Sidebar */}
            <Sidebar variant="sidebar" className="w-64 h-auto">
              <SidebarHeader className="border-b">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">DevTools</span>
                    <Badge variant="secondary" className="text-xs">
                      v1.0.0
                    </Badge>
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
              </SidebarHeader>

              <SidebarContent>
                {/* Core Plugins Section */}
                <SidebarGroup>
                  <SidebarGroupLabel>Core</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {corePlugins.map((plugin) => (
                        <CorePluginSidebarItem key={plugin.metadata.id} plugin={plugin} />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Additional Plugins Section */}
                {additionalPlugins.length > 0 && (
                  <>
                    <SidebarSeparator />
                    <SidebarGroup>
                      <SidebarGroupLabel>Plugins</SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {additionalPlugins.map((plugin) => (
                            <PluginSidebarItem key={plugin.metadata.id} plugin={plugin} />
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </>
                )}

                {/* No additional plugins message */}
                {additionalPlugins.length === 0 && (
                  <>
                    <SidebarSeparator />
                    <SidebarGroup>
                      <SidebarGroupLabel>Plugins</SidebarGroupLabel>
                      <SidebarGroupContent>
                        <div className="px-4 py-2 text-center">
                          <div className="text-sm text-muted-foreground">
                            No additional plugins loaded
                          </div>
                        </div>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </>
                )}
              </SidebarContent>

              <SidebarFooter className="border-t">
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="text-xs text-muted-foreground">
                    {corePlugins.length + additionalPlugins.length} plugins loaded
                  </div>
                  <DevToolSettings />
                </div>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>

            {/* Main content area */}
            <SidebarInset className="flex-1">
              <div className="h-full overflow-y-auto p-4">
                {selectedPageData ? (
                  <PageContent 
                    page={selectedPageData.page} 
                    plugin={selectedPageData.plugin} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">DevTools</h3>
                      <p className="text-muted-foreground">
                        Select a page from the sidebar to get started
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </Card>
    </div>
  )
}

/**
 * Core plugin sidebar item - shows only the plugin name as a single menu item
 */
function CorePluginSidebarItem({ plugin }: { plugin: DevToolPlugin }) {
  const registry = usePluginRegistry()
  const selectedPageData = registry.getSelectedPage()
  
  // Find the first page from the first group as the default page
  const defaultPage = plugin.groups[0]?.pages[0]
  const isSelected = selectedPageData?.page.id === defaultPage?.id

  const handleClick = () => {
    if (defaultPage) {
      registry.selectPage(defaultPage.id, plugin.metadata.id)
    }
  }

  if (!defaultPage) return null

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        isActive={isSelected}
        onClick={handleClick}
        className="group"
      >
        <div className="flex items-center gap-2 flex-1">
          {plugin.metadata.icon && getIconComponent(plugin.metadata.icon)}
          <span className="flex-1">{plugin.metadata.name}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

/**
 * Regular plugin sidebar item - shows the full plugin structure as before
 */
function PluginSidebarItem({ plugin }: { plugin: DevToolPlugin }) {
  return (
    <>
      {plugin.groups.map((group: PluginGroup, index: number) => (
        <div key={group.id}>
          {plugin.groups.length > 1 && (
            <SidebarGroupLabel className="px-2 py-1 text-xs text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
          )}
          {group.pages.map((page: PluginPage) => (
            <PluginPageItem key={page.id} page={page} pluginId={plugin.metadata.id} />
          ))}
          {index < plugin.groups.length - 1 && <SidebarSeparator className="my-1" />}
        </div>
      ))}
    </>
  )
}

/**
 * Renders a page item in the sidebar menu
 */
function PluginPageItem({ page, pluginId }: { page: PluginPage; pluginId: string }) {
  const registry = usePluginRegistry()
  const selectedPageData = registry.getSelectedPage()
  const isSelected = selectedPageData?.page.id === page.id

  const [isExpanded, setIsExpanded] = useState(false)

  const handlePageClick = () => {
    registry.selectPage(page.id, pluginId)
  }

  const handleToggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        isActive={isSelected}
        onClick={handlePageClick}
        className="group"
      >
        <div className="flex items-center gap-2 flex-1">
          {page.icon && getIconComponent(page.icon)}
          <span className="flex-1">{page.label}</span>
          {page.badge && (
            <Badge variant="secondary" className="text-xs">
              {page.badge}
            </Badge>
          )}
          {page.children && page.children.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
              onClick={handleToggleExpanded}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </SidebarMenuButton>

      {page.children && page.children.length > 0 && isExpanded && (
        <SidebarMenuSub>
          {page.children.map((childPage) => (
            <SidebarMenuSubItem key={childPage.id}>
              <SidebarMenuSubButton 
                isActive={selectedPageData?.page.id === childPage.id}
                onClick={() => registry.selectPage(childPage.id, pluginId)}
              >
                {childPage.icon && getIconComponent(childPage.icon)}
                <span>{childPage.label}</span>
                {childPage.badge && (
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {childPage.badge}
                  </Badge>
                )}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  )
}

/**
 * Renders the content for a selected page
 */
function PageContent({ page, plugin }: { page: PluginPage; plugin: any }) {
  const registry = usePluginRegistry()
  const context = {
    metadata: plugin.metadata,
    isActive: registry.isActive(plugin.metadata.id),
    activate: () => registry.activate(plugin.metadata.id),
    deactivate: () => registry.deactivate(plugin.metadata.id)
  }

  const PageComponent = page.component

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {page.icon && getIconComponent(page.icon)}
            {page.label}
            {page.badge && (
              <Badge variant="secondary">
                {page.badge}
              </Badge>
            )}
          </h1>
          {page.description && (
            <p className="text-muted-foreground mt-1">{page.description}</p>
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

      {/* Page content */}
      <div className="min-h-[200px]">
        <PageComponent context={context} />
      </div>
    </div>
  )
}