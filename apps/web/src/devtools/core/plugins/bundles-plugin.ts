import { createPlugin, PluginUtils } from '../../sdk'
import { BundleAnalysisComponent, DependenciesComponent, BuildInfoComponent } from './bundles'

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
    reducedMode: {
      displayType: 'status',
      status: {
        text: 'Loading...',
        variant: 'secondary'
      },
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
      getDisplayData: () => {
        const { bundleSize, status } = getBundleInfo()
        return {
          status: {
            text: bundleSize,
            variant: status === 'warning' ? 'destructive' as const : 'default' as const
          }
        }
      }
    }
  }
)