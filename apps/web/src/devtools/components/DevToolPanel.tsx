'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, Settings, X } from 'lucide-react'
import { Button } from '@repo/ui/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Separator } from '@repo/ui/components/shadcn/separator'

import { cn } from '@repo/ui/lib/utils'
import { usePluginRegistry, usePluginContext } from '../core/plugin-registry'

/**
 * Main DevTool panel component
 */
export function DevToolPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  
  const registry = usePluginRegistry()
  const activePlugins = registry.getActivePlugins()
  const selectedPlugin = registry.getSelectedPlugin()

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
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] shadow-2xl">
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
              <div className="space-y-0">
                {/* Plugin Tabs */}
                <div className="flex flex-wrap gap-1 p-2 border-b">
                  {activePlugins.map((plugin) => (
                    <Button
                      key={plugin.metadata.id}
                      variant={selectedPlugin?.metadata.id === plugin.metadata.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => registry.select(plugin.metadata.id)}
                      className="h-7 text-xs px-2"
                    >
                      {plugin.metadata.name}
                    </Button>
                  ))}
                </div>

                {/* Plugin Content */}
                <div className="h-[400px] overflow-y-auto">
                  {selectedPlugin ? (
                    <PluginRenderer plugin={selectedPlugin} />
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Select a plugin to view its content
                    </div>
                  )}
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
 * Renders the selected plugin component
 */
function PluginRenderer({ plugin }: { plugin: NonNullable<ReturnType<typeof usePluginRegistry>['getSelectedPlugin']> }) {
  const context = usePluginContext(plugin.metadata.id)
  const PluginComponent = plugin.component

  return (
    <div className="p-4">
      <PluginComponent context={context} />
    </div>
  )
}