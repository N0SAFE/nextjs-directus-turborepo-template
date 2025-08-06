'use client'

import { ReactNode } from 'react'
import { ReducedModeConfig, PluginContext } from '../types'

interface ReducedModeDisplayProps {
  config: ReducedModeConfig
  context: PluginContext
}

/**
 * Component that renders the reduced mode display for a plugin
 */
export function ReducedModeDisplay({ config, context }: ReducedModeDisplayProps) {
  // Get dynamic data if getData function is provided
  const dynamicData = config.getData?.() || {}
  
  // If plugin provides a custom component, render it
  if (config.component) {
    const CustomComponent = config.component
    return <CustomComponent context={context} />
  }
  
  // Default: render nothing (just the icon will be shown)
  return null
}

