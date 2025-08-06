'use client'

import { useState } from 'react'
import { Settings, Pin, PinOff, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@repo/ui/components/shadcn/button'
import { Switch } from '@repo/ui/components/shadcn/switch'
import { Slider } from '@repo/ui/components/shadcn/slider'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Separator } from '@repo/ui/components/shadcn/separator'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/shadcn/dialog'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@repo/ui/components/shadcn/tooltip'

import { useDevToolState } from '../core/devtool-state'
import { usePluginRegistry } from '../core/plugin-registry'
import { routesPlugin, bundlesPlugin, cliPlugin } from '../core/plugins'
import { DevToolPlugin } from '../types'

// Map of icon names to components for consistency
const IconMap = {
  ArrowLeft,
  ArrowRight, 
  ArrowUp,
  ArrowDown,
  Activity: () => <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse" />,
  Cpu: () => <div className="h-4 w-4 bg-blue-500 rounded" />,
  Terminal: () => <div className="h-4 w-4 bg-gray-800 rounded" />,
  AlertTriangle: () => <div className="h-4 w-4 bg-yellow-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />,
  User: () => <div className="h-4 w-4 bg-indigo-500 rounded-full" />,
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
 * DevTool Settings Dialog
 */
export function DevToolSettings() {
  const [open, setOpen] = useState(false)
  const { 
    position, 
    setPosition, 
    pinnedPlugins, 
    pinPlugin, 
    unpinPlugin, 
    isPluginPinned,
    settings,
    updateSettings
  } = useDevToolState()
  
  const registry = usePluginRegistry()
  const additionalPlugins = registry.getActivePlugins()
  
  // Core plugins that are always available
  const corePlugins: DevToolPlugin[] = [routesPlugin, bundlesPlugin, cliPlugin]
  const allPlugins = [...corePlugins, ...additionalPlugins]

  const positionOptions = [
    { value: 'left' as const, label: 'Left', icon: ArrowLeft },
    { value: 'right' as const, label: 'Right', icon: ArrowRight },
    { value: 'top' as const, label: 'Top', icon: ArrowUp },
    { value: 'bottom' as const, label: 'Bottom', icon: ArrowDown },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Settings className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            DevTools Settings
          </DialogTitle>
          <DialogDescription>
            Configure DevTools behavior and plugin visibility
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Position Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Position & Layout</CardTitle>
              <CardDescription>
                Configure how the DevTools sidebar appears
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Sidebar Position</label>
                <div className="flex gap-2 mt-2">
                  {positionOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <Button
                        key={option.value}
                        variant={position.side === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPosition({ side: option.value })}
                        className="flex-1"
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {option.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Sidebar Size: {position.size}px</label>
                <Slider
                  value={[position.size]}
                  onValueChange={([value]) => setPosition({ size: value })}
                  min={32}
                  max={80}
                  step={4}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">General Settings</CardTitle>
              <CardDescription>
                Configure DevTools behavior and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Show Tooltips</div>
                  <div className="text-xs text-muted-foreground">
                    Display helpful tooltips in normal mode
                  </div>
                </div>
                <Switch
                  checked={settings.showTooltips}
                  onCheckedChange={(checked) => updateSettings({ showTooltips: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Auto Expand</div>
                  <div className="text-xs text-muted-foreground">
                    Automatically expand on first visit
                  </div>
                </div>
                <Switch
                  checked={settings.autoExpand}
                  onCheckedChange={(checked) => updateSettings({ autoExpand: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Enable Animations</div>
                  <div className="text-xs text-muted-foreground">
                    Show transition animations
                  </div>
                </div>
                <Switch
                  checked={settings.enableAnimations}
                  onCheckedChange={(checked) => updateSettings({ enableAnimations: checked })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Max Plugins in Normal Mode: {settings.maxNormalPlugins}
                </label>
                <Slider
                  value={[settings.maxNormalPlugins]}
                  onValueChange={([value]) => updateSettings({ maxNormalPlugins: value })}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Maximum number of plugins to show in the sidebar
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plugin Pinning */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Plugin Visibility</CardTitle>
              <CardDescription>
                Pin plugins to show them in normal mode sidebar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allPlugins.map((plugin) => {
                  const isPinned = isPluginPinned(plugin.metadata.id)
                  const isCore = corePlugins.some(p => p.metadata.id === plugin.metadata.id)
                  
                  return (
                    <div key={plugin.metadata.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center">
                          {getIconComponent(plugin.metadata.icon)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{plugin.metadata.name}</span>
                            {isCore && (
                              <Badge variant="secondary" className="text-xs">
                                Core
                              </Badge>
                            )}
                          </div>
                          {plugin.metadata.description && (
                            <div className="text-xs text-muted-foreground">
                              {plugin.metadata.description}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (isPinned) {
                                  unpinPlugin(plugin.metadata.id)
                                } else {
                                  pinPlugin(plugin.metadata.id)
                                }
                              }}
                              className={isPinned ? "text-blue-600" : ""}
                            >
                              {isPinned ? (
                                <Pin className="h-4 w-4" />
                              ) : (
                                <PinOff className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isPinned ? 'Unpin from sidebar' : 'Pin to sidebar'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )
                })}
              </div>
              
              {allPlugins.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No plugins available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Storage Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Storage Information</CardTitle>
              <CardDescription>
                Settings are automatically saved to localStorage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div>Pinned plugins: {pinnedPlugins.size}</div>
                <div>Position: {position.side} ({position.size}px)</div>
                <div>Settings saved: ✓</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}