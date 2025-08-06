import { createPlugin, PluginUtils } from '../../sdk'
import { CliCommandsComponent, ScriptsComponent, EnvironmentComponent } from './cli'

/**
 * CLI DevTool Plugin - Core plugin for CLI tools and environment
 */
export const cliPlugin = createPlugin(
  PluginUtils.createMetadata(
    'core-cli',
    'CLI',
    {
      description: 'CLI commands, scripts, and environment information',
      author: 'DevTools Core',
      icon: 'Terminal',
    }
  ),
  [
    {
      id: 'cli-group',
      label: 'CLI Tools',
      icon: 'Terminal',
      pages: [
        {
          id: 'cli-commands',
          label: 'Commands',
          description: 'Available CLI commands',
          icon: 'Terminal',
          component: CliCommandsComponent
        },
        {
          id: 'scripts',
          label: 'Scripts',
          description: 'Package.json scripts',
          icon: 'Code',
          component: ScriptsComponent
        },
        {
          id: 'environment',
          label: 'Environment',
          description: 'Environment variables and configuration',
          icon: 'Settings',
          component: EnvironmentComponent
        }
      ]
    }
  ],
  {
    enabled: true,
    onRegister: () => {
      console.log('[DevTools Core] CLI plugin registered')
    },
  }
)