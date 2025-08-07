'use client'

import React, { useState, useEffect } from 'react'
import { oc } from '@orpc/contract'
import { createPlugin, PluginUtils } from '../../../sdk'
import { BundleAnalysisComponent, DependenciesComponent } from './components'
import z from 'zod/v4'
import { useEnhancedDevToolAPI } from '../../../hooks/useEnhancedDevToolAPI'
import { BUNDLES_HANDLER_ID } from '../../../orpc-handlers/constants'

// Bundles Plugin ORPC Contract
const bundlesContract = oc.router({
  // Get bundle analysis information
  getBundleAnalysis: oc
    .output(z.object({
      totalSize: z.number(),
      gzippedSize: z.number(),
      chunks: z.array(z.object({
        name: z.string(),
        size: z.number(),
        gzippedSize: z.number(),
        files: z.array(z.string()),
      })),
      assets: z.array(z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
      })),
    })),

  // Get dependency information
  getDependencies: oc
    .output(z.object({
      dependencies: z.record(z.string(), z.string()),
      devDependencies: z.record(z.string(), z.string()),
      totalCount: z.number(),
      outdated: z.array(z.object({
        name: z.string(),
        current: z.string(),
        wanted: z.string(),
        latest: z.string(),
        type: z.enum(['dependency', 'devDependency']),
      })),
    })),

  // Get bundle optimization suggestions
  getOptimizationSuggestions: oc
    .output(z.array(z.object({
      type: z.string(),
      severity: z.enum(['low', 'medium', 'high']),
      message: z.string(),
      suggestion: z.string(),
    }))),

  // Get build statistics
  getBuildStats: oc
    .output(z.object({
      buildTime: z.number(),
      bundleSize: z.number(),
      chunkCount: z.number(),
      assetCount: z.number(),
      errors: z.array(z.string()),
      warnings: z.array(z.string()),
      timestamp: z.string(),
    })),
})

/**
 * Get bundle information for reduced mode display
 */
function getBundleInfo() {
  // This would normally come from webpack/build stats
  return {
    bundleSize: '2.4MB',
    status: 'optimized', // 'optimized', 'warning', 'error'
    chunkCount: 12,
    compressionRatio: 0.35,
  }
}

/**
 * Enhanced Bundles reduced mode display with real-time bundle monitoring
 */
function BundlesReducedDisplay({ context }: { context: any }) {
  const [bundleStats, setBundleStats] = useState<any>(null)
  const [outdatedCount, setOutdatedCount] = useState(0)
  const [bundleSize, setBundleSize] = useState('...')
  const enhancedAPI = useEnhancedDevToolAPI()
  
  useEffect(() => {
    // Subscribe to bundle changes
    const unsubscribe = enhancedAPI.bundles.subscribeToBundleChanges(async (stats) => {
      setBundleStats(stats)
      
      // Format bundle size
      const sizeInMB = (stats.totalSize / 1024 / 1024).toFixed(1)
      setBundleSize(`${sizeInMB}MB`)
      
      // Get dependency info
      try {
        const deps = await enhancedAPI.bundles.getDependencies()
        setOutdatedCount(deps.outdated?.length || 0)
      } catch (error) {
        console.error('Failed to get dependencies:', error)
      }
    })

    return unsubscribe
  }, [enhancedAPI])
  
  const getStatusColor = () => {
    if (!bundleStats) return 'text-gray-600'
    
    const sizeInMB = bundleStats.totalSize / 1024 / 1024
    if (outdatedCount > 5) return 'text-red-600'
    if (sizeInMB > 10 || outdatedCount > 0) return 'text-yellow-600'
    return 'text-green-600'
  }
  
  return (
    <div className="flex items-center gap-1">
      <span className={`text-xs font-mono ${getStatusColor()}`}>
        {bundleSize}
      </span>
      {outdatedCount > 0 && (
        <span className="text-xs text-red-600">
          !{outdatedCount}
        </span>
      )}
    </div>
  )
}

/**
 * Bundles DevTool Plugin - Core plugin for bundle analysis and optimization
 */
export const bundlesPlugin = createPlugin(
  PluginUtils.createMetadata(
    'core-bundles',
    'Bundles',
    {
      description: 'Bundle analysis, dependencies, and build optimization',
      author: 'DevTools Core',
      icon: 'Package',
    }
  ),
  [
    {
      id: 'bundles-group',
      label: 'Bundle Analysis',
      icon: 'Package',
      pages: [
        {
          id: 'bundle-analysis',
          label: 'Bundle Analysis',
          description: 'Bundle size and composition analysis',
          icon: 'Package',
          component: BundleAnalysisComponent
        },
        {
          id: 'dependencies',
          label: 'Dependencies',
          description: 'Package dependencies and versions',
          icon: 'GitBranch',
          component: DependenciesComponent
        }
      ]
    }
  ],
  {
    enabled: true,
    onRegister: () => {
      console.log('[DevTools Core] Bundles plugin registered')
    },
    // Reduced mode configuration
    reduced: {
      component: BundlesReducedDisplay,
      menu: {
        groups: [
          {
            label: 'Bundle Info',
            items: [
              {
                id: 'bundle-size',
                label: 'Bundle Size',
                description: 'View current bundle size',
                action: () => {
                  const { bundleSize, chunkCount } = getBundleInfo()
                  alert(`Bundle size: ${bundleSize} (${chunkCount} chunks)`)
                }
              },
              {
                id: 'compression-info',
                label: 'Compression Ratio',
                description: 'View compression statistics',
                action: () => {
                  const { compressionRatio } = getBundleInfo()
                  alert(`Compression ratio: ${Math.round(compressionRatio * 100)}%`)
                }
              }
            ]
          },
          {
            label: 'Optimization',
            items: [
              {
                id: 'optimization-tips',
                label: 'Optimization Tips',
                description: 'View bundle optimization suggestions',
                action: () => {
                  alert('Tips: Use dynamic imports for large dependencies, optimize images, enable tree shaking')
                }
              },
              {
                id: 'view-dependencies',
                label: 'View Dependencies',
                description: 'Open dependencies overview',
                action: () => {
                  console.log('Opening dependencies overview')
                }
              }
            ]
          }
        ]
      },
      // Dynamic data function
      getData: () => {
        const { bundleSize, status, chunkCount } = getBundleInfo()
        return { bundleSize, status, chunkCount }
      }
    },
    // ORPC contract and identifier for server communication
    orpc: {
      contract: bundlesContract,
      identifier: BUNDLES_HANDLER_ID
    }
  }
)