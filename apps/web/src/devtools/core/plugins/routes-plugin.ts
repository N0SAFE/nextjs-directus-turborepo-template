import { createPlugin, PluginUtils } from '../../sdk'
import { RoutesOverviewComponent, ApiRoutesComponent } from './routes'

/**
 * Routes DevTool Plugin - Core plugin for route inspection
 */
export const routesPlugin = createPlugin(
  PluginUtils.createMetadata(
    'core-routes',
    'Routes',
    {
      description: 'View application routes and API endpoints',
      author: 'DevTools Core',
      icon: 'Activity',
    }
  ),
  [
    {
      id: 'routes-group',
      label: 'Application Routes',
      icon: 'Activity',
      pages: [
        {
          id: 'routes-overview',
          label: 'Routes Overview',
          description: 'View all application routes',
          icon: 'Activity',
          component: RoutesOverviewComponent
        },
        {
          id: 'api-routes',
          label: 'API Endpoints',
          description: 'View API endpoints and their status',
          icon: 'Database',
          component: ApiRoutesComponent
        }
      ]
    }
  ],
  {
    enabled: true,
    onRegister: () => {
      console.log('[DevTools Core] Routes plugin registered')
    },
  }
)