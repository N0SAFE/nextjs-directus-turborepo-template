import React from 'react'
import { oc } from '@orpc/contract'
import { createPlugin, PluginUtils } from '../../../sdk'
import { BundleAnalysisComponent, DependenciesComponent } from './components'
import { BUNDLES_HANDLER_ID } from '../../../orpc-handlers'
import z from 'zod/v4'

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
 * Custom component for Bundles reduced mode display
 */
function BundlesReducedDisplay({ context }: { context: any }) {
  const { bundleSize, status } = getBundleInfo()
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }
  
  return (
    <span className={`text-xs font-mono ${getStatusColor(status)}`}>
      {bundleSize}
    </span>
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