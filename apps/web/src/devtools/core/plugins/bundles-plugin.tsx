import React from 'react'
import { oc } from '@orpc/contract'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { createPlugin, PluginUtils } from '../../sdk'
import { BundleAnalysisComponent, DependenciesComponent, BuildInfoComponent } from './bundles'
import { BUNDLES_HANDLER_ID } from '../../orpc-handlers'
import z from 'zod/v4'

// Bundles Plugin ORPC Contract
const bundlesContract = oc.router({
  // Get bundle information
  getBundleInfo: oc
    .output(z.object({
      dependencies: z.number(),
      devDependencies: z.number(),
      peerDependencies: z.number(),
      totalDependencies: z.number(),
      dependencyList: z.object({
        runtime: z.record(z.string(), z.string()),
        development: z.record(z.string(), z.string()),
        peer: z.record(z.string(), z.string()),
      }),
      buildInfo: z.object({
        buildDirectory: z.string(),
        buildSize: z.string(),
        buildExists: z.boolean(),
      }).nullable(),
    })),

  // Analyze dependencies for vulnerabilities and outdated packages
  analyzeDependencies: oc
    .output(z.object({
      outdated: z.array(z.object({
        name: z.string(),
        current: z.string(),
        wanted: z.string(),
        latest: z.string(),
        location: z.string(),
      })),
      vulnerabilities: z.array(z.object({
        name: z.string(),
        severity: z.enum(['info', 'low', 'moderate', 'high', 'critical']),
        via: z.string(),
        title: z.string(),
        url: z.string().optional(),
      })),
      summary: z.object({
        total: z.number(),
        outdated: z.number(),
        vulnerabilities: z.number(),
        criticalVulns: z.number(),
      }),
    })),

  // Get optimization suggestions
  getOptimizations: oc
    .output(z.object({
      suggestions: z.array(z.object({
        type: z.enum(['bundle-size', 'dependency', 'performance', 'security']),
        title: z.string(),
        description: z.string(),
        impact: z.enum(['low', 'medium', 'high']),
        effort: z.enum(['low', 'medium', 'high']),
      })),
      metrics: z.object({
        bundleScore: z.number(),
        dependencyScore: z.number(),
        securityScore: z.number(),
        overallScore: z.number(),
      }),
    })),

  // Get detailed dependency tree
  getDependencyTree: oc
    .input(z.object({ packageName: z.string().optional() }))
    .output(z.object({
      name: z.string(),
      version: z.string(),
      dependencies: z.array(z.any()),
      depth: z.number(),
      size: z.string().optional(),
    })),

  // Get build statistics
  getBuildStats: oc
    .output(z.object({
      buildTime: z.number().optional(),
      buildSize: z.string().optional(),
      pages: z.array(z.object({
        path: z.string(),
        size: z.string(),
        firstLoad: z.string(),
      })),
      chunks: z.array(z.object({
        name: z.string(),
        size: z.string(),
        type: z.string(),
      })),
      assets: z.array(z.object({
        name: z.string(),
        size: z.string(),
        type: z.string(),
      })),
    })),
})

/**
 * Get bundle information for reduced mode display
 */
function getBundleInfo() {
  // Mock bundle information - in a real implementation, this would come from build tools
  const bundleSize = Math.floor(Math.random() * 500) + 200 // 200-700 KB
  const dependencies = 45 + Math.floor(Math.random() * 20) // 45-65 deps
  const buildTime = Math.floor(Math.random() * 30) + 10 // 10-40 seconds
  
  return {
    bundleSize: `${bundleSize}KB`,
    dependencies,
    buildTime: `${buildTime}s`,
    status: bundleSize > 500 ? 'warning' : 'good'
  }
}

/**
 * Custom component for bundles reduced mode display
 */
function BundlesReducedDisplay({ context }: { context: any }) {
  const { bundleSize, status } = getBundleInfo()
  
  return (
    <Badge 
      variant={status === 'warning' ? 'destructive' : 'default'}
      className="text-xs"
    >
      {bundleSize}
    </Badge>
  )
}

/**
 * Bundles DevTool Plugin - Core plugin for bundle analysis
 */
export const bundlesPlugin = createPlugin(
  PluginUtils.createMetadata(
    'core-bundles',
    'Bundles',
    {
      description: 'Analyze bundle sizes and dependencies',
      author: 'DevTools Core',
      icon: 'Cpu',
    }
  ),
  [
    {
      id: 'bundles-group',
      label: 'Bundle Analysis',
      icon: 'Cpu',
      pages: [
        {
          id: 'bundle-analysis',
          label: 'Bundle Analysis',
          description: 'View bundle sizes and optimization metrics',
          icon: 'Cpu',
          component: BundleAnalysisComponent
        },
        {
          id: 'dependencies',
          label: 'Dependencies',
          description: 'View project dependencies',
          icon: 'Database',
          component: DependenciesComponent
        },
        {
          id: 'build-info',
          label: 'Build Info',
          description: 'View build configuration and status',
          icon: 'Settings',
          component: BuildInfoComponent
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
                description: 'Current bundle size',
                action: () => {
                  const { bundleSize } = getBundleInfo()
                  alert(`Current bundle size: ${bundleSize}`)
                }
              },
              {
                id: 'dependencies-count',
                label: 'Dependencies',
                description: 'Number of dependencies',
                action: () => {
                  const { dependencies } = getBundleInfo()
                  alert(`Dependencies: ${dependencies} packages`)
                }
              }
            ]
          },
          {
            label: 'Actions',
            items: [
              {
                id: 'analyze-bundle',
                label: 'Analyze Bundle',
                description: 'Open bundle analysis view',
                action: () => {
                  console.log('Opening bundle analysis')
                }
              },
              {
                id: 'optimize-tips',
                label: 'Optimization Tips',
                description: 'Get bundle optimization suggestions',
                action: () => {
                  alert('Consider code splitting and tree shaking for better performance')
                }
              }
            ]
          }
        ]
      },
      // Dynamic data function
      getData: () => {
        const { bundleSize, status } = getBundleInfo()
        return { bundleSize, status }
      }
    },
    // ORPC contract and identifier for server communication
    orpc: {
      contract: bundlesContract,
      identifier: BUNDLES_HANDLER_ID
    }
  }
)