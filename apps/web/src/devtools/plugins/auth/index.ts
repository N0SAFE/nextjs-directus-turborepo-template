import { User } from 'lucide-react'
import { createPlugin, PluginUtils } from '../../sdk'
import { UserInfoComponent, SessionDetailsComponent, RawSessionDataComponent } from './AuthComponents'

/**
 * Authentication DevTool Plugin
 * Displays current user information and session details using better-auth
 */
export const authPlugin = createPlugin(
  PluginUtils.createMetadata(
    'auth',
    'Authentication',
    {
      description: 'Display current user and session information',
      author: 'DevTools',
      icon: 'User',
    }
  ),
  [
    {
      id: 'user-info',
      type: 'custom',
      label: 'Current User',
      description: 'Display current authenticated user information',
      component: UserInfoComponent
    },
    {
      id: 'session-tabs',
      type: 'tabs',
      label: 'Session Information',
      description: 'Detailed session data and debugging information',
      tabs: [
        {
          id: 'details',
          label: 'Details',
          content: SessionDetailsComponent
        },
        {
          id: 'raw',
          label: 'Raw Data',
          content: RawSessionDataComponent
        }
      ],
      defaultTab: 'details'
    }
  ],
  {
    enabled: true,
    onRegister: () => {
      console.log('[DevTools] Auth plugin registered')
    },
    onActivate: () => {
      console.log('[DevTools] Auth plugin activated')
    },
    onDeactivate: () => {
      console.log('[DevTools] Auth plugin deactivated')
    },
  }
)