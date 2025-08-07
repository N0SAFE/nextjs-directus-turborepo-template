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
      id: 'user-group',
      label: 'User Management',
      icon: 'User',
      pages: [
        {
          id: 'user-info',
          label: 'Current User',
          description: 'Display current authenticated user information',
          icon: 'User',
          component: UserInfoComponent
        }
      ]
    },
    {
      id: 'session-group', 
      label: 'Session Data',
      icon: 'Shield',
      pages: [
        {
          id: 'session-details',
          label: 'Session Details',
          description: 'Detailed session information',
          icon: 'Info',
          component: SessionDetailsComponent
        },
        {
          id: 'session-raw',
          label: 'Raw Data',
          description: 'Raw session data for debugging',
          icon: 'Code',
          component: RawSessionDataComponent
        }
      ]
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