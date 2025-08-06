import { createPlugin, PluginUtils } from '../../sdk'
import { BundleAnalysisComponent, DependenciesComponent, BuildInfoComponent } from './bundles'

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
  }
)