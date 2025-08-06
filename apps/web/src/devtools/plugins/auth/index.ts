import { User } from 'lucide-react'
import { createPlugin, PluginUtils } from '../../sdk'
import { AuthPlugin } from './AuthPlugin'

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
  AuthPlugin,
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