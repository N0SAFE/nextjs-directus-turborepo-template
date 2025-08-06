'use client'

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@repo/ui/components/shadcn/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/shadcn/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/shadcn/tabs'
import { Button } from '@repo/ui/components/shadcn/button'
import { Input } from '@repo/ui/components/shadcn/input'
import { Label } from '@repo/ui/components/shadcn/label'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { ChevronDown } from 'lucide-react'

import { PluginOption, PluginContext } from '../types'

interface OptionRendererProps {
  option: PluginOption
  context: PluginContext
}

// Simple Switch component fallback
function Switch({ checked, onCheckedChange, size }: { checked: boolean, onCheckedChange: (checked: boolean) => void, size?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
        checked ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

// Simple Textarea component fallback
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ''}`}
    />
  )
}

/**
 * Renders different types of plugin options
 */
export function OptionRenderer({ option, context }: OptionRendererProps) {
  switch (option.type) {
    case 'dialog':
      return <DialogOptionRenderer option={option} context={context} />
    case 'menu':
      return <MenuOptionRenderer option={option} context={context} />
    case 'tabs':
      return <TabsOptionRenderer option={option} context={context} />
    case 'toggle':
      return <ToggleOptionRenderer option={option} context={context} />
    case 'list':
      return <ListOptionRenderer option={option} context={context} />
    case 'input':
      return <InputOptionRenderer option={option} context={context} />
    case 'custom':
      return <CustomOptionRenderer option={option} context={context} />
    default:
      return null
  }
}

function DialogOptionRenderer({ option, context }: { option: Extract<PluginOption, { type: 'dialog' }>, context: PluginContext }) {
  const ContentComponent = option.content

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{option.label}</Label>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              {option.triggerText || 'Open'}
            </Button>
          </DialogTrigger>
          <DialogContent className={`${option.size === 'sm' ? 'max-w-md' : option.size === 'lg' ? 'max-w-4xl' : option.size === 'xl' ? 'max-w-7xl' : 'max-w-2xl'}`}>
            <DialogHeader>
              <DialogTitle>{option.title}</DialogTitle>
              {option.description && (
                <DialogDescription>{option.description}</DialogDescription>
              )}
            </DialogHeader>
            <ContentComponent context={context} />
          </DialogContent>
        </Dialog>
      </div>
      {option.description && (
        <p className="text-xs text-muted-foreground">{option.description}</p>
      )}
    </div>
  )
}

function MenuOptionRenderer({ option, context }: { option: Extract<PluginOption, { type: 'menu' }>, context: PluginContext }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{option.label}</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {option.triggerText || 'Menu'}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {option.items.map((item) => (
              <DropdownMenuItem key={item.id} onClick={item.onClick}>
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {option.description && (
        <p className="text-xs text-muted-foreground">{option.description}</p>
      )}
    </div>
  )
}

function TabsOptionRenderer({ option, context }: { option: Extract<PluginOption, { type: 'tabs' }>, context: PluginContext }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{option.label}</Label>
      {option.description && (
        <p className="text-xs text-muted-foreground">{option.description}</p>
      )}
      <Tabs defaultValue={option.defaultTab || option.tabs[0]?.id} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${option.tabs.length}, minmax(0, 1fr))` }}>
          {option.tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {option.tabs.map((tab) => {
          const TabContent = tab.content
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-2">
              <TabContent context={context} />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}

function ToggleOptionRenderer({ option, context }: { option: Extract<PluginOption, { type: 'toggle' }>, context: PluginContext }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{option.label}</Label>
        <Switch
          checked={option.checked}
          onCheckedChange={option.onChange}
          size={option.size}
        />
      </div>
      {option.description && (
        <p className="text-xs text-muted-foreground">{option.description}</p>
      )}
    </div>
  )
}

function ListOptionRenderer({ option, context }: { option: Extract<PluginOption, { type: 'list' }>, context: PluginContext }) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleItemClick = (itemId: string) => {
    if (!option.selectable) return

    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId]
    
    setSelectedItems(newSelection)
    option.onSelectionChange?.(newSelection)
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{option.label}</Label>
      {option.description && (
        <p className="text-xs text-muted-foreground">{option.description}</p>
      )}
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {option.items.map((item) => (
          <div
            key={item.id}
            className={`p-2 rounded text-xs border cursor-pointer transition-colors ${
              option.selectable && selectedItems.includes(item.id)
                ? 'bg-primary/10 border-primary'
                : 'bg-muted/50 border-border hover:bg-muted'
            }`}
            onClick={() => handleItemClick(item.id)}
          >
            <div className="font-medium">{item.label}</div>
            {item.secondary && (
              <div className="text-muted-foreground text-xs mt-1">{item.secondary}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function InputOptionRenderer({ option, context }: { option: Extract<PluginOption, { type: 'input' }>, context: PluginContext }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = option.inputType === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
    option.onChange(value)
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{option.label}</Label>
      {option.description && (
        <p className="text-xs text-muted-foreground">{option.description}</p>
      )}
      {option.inputType === 'textarea' ? (
        <Textarea
          value={option.value.toString()}
          onChange={handleChange}
          placeholder={option.placeholder}
          disabled={option.disabled}
          className="text-xs"
          rows={3}
        />
      ) : (
        <Input
          type={option.inputType}
          value={option.value.toString()}
          onChange={handleChange}
          placeholder={option.placeholder}
          disabled={option.disabled}
          className="text-xs"
        />
      )}
    </div>
  )
}

function CustomOptionRenderer({ option, context }: { option: Extract<PluginOption, { type: 'custom' }>, context: PluginContext }) {
  const CustomComponent = option.component

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{option.label}</Label>
      {option.description && (
        <p className="text-xs text-muted-foreground">{option.description}</p>
      )}
      <CustomComponent context={context} />
    </div>
  )
}