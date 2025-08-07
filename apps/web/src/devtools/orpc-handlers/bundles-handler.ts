import { SERVICE_KEYS } from '../services/registry'

/**
 * Bundles Plugin ORPC Handler Factory (uses dependency injection)
 * Creates handlers for bundle analysis and build information
 */
export function createBundlesHandlers(services: Record<string, unknown>) {
  const devtoolsService = services[SERVICE_KEYS.DEVTOOLS_SERVICE] as any
  
  if (!devtoolsService) {
    console.warn('[Bundles Plugin] DevtoolsService not found in dependency injection')
    return {
      getBundleInfo: async () => ({
        dependencies: 0,
        devDependencies: 0,
        peerDependencies: 0,
        totalDependencies: 0,
        dependencyList: { runtime: {}, development: {}, peer: {} },
        buildInfo: null,
      }),
      analyzeDependencies: async () => ({
        outdated: [],
        vulnerabilities: [],
        summary: { total: 0, outdated: 0, vulnerabilities: 0, criticalVulns: 0 },
      }),
      getOptimizations: async () => ({
        suggestions: [],
        metrics: { bundleScore: 0, dependencyScore: 0, securityScore: 0, overallScore: 0 },
      }),
      getDependencyTree: async () => ({
        name: 'unknown',
        version: '0.0.0',
        dependencies: [],
        depth: 0,
      }),
      getBuildStats: async () => ({
        pages: [],
        chunks: [],
        assets: [],
      }),
    }
  }

  return {
    getBundleInfo: async () => devtoolsService.getBundleInfo(),
    
    analyzeDependencies: async () => {
      // In a real implementation, you'd use npm audit and npm outdated
      try {
        const result = await devtoolsService.executeCommand({ command: 'npm outdated --json' })
        const outdatedData = result.success ? JSON.parse(result.output || '{}') : {}
        
        const outdated = Object.entries(outdatedData).map(([name, info]: [string, any]) => ({
          name,
          current: info.current,
          wanted: info.wanted,
          latest: info.latest,
          location: info.location || 'node_modules',
        }))

        // Mock vulnerability data
        const vulnerabilities = [
          {
            name: 'example-vuln',
            severity: 'moderate' as const,
            via: 'transitive dependency',
            title: 'Example vulnerability for demo',
          },
          {
            name: 'critical-vuln',
            severity: 'critical' as const,
            via: 'direct dependency',
            title: 'Critical vulnerability example',
          }
        ]

        return {
          outdated,
          vulnerabilities,
          summary: {
            total: Object.keys(outdatedData).length + vulnerabilities.length,
            outdated: Object.keys(outdatedData).length,
            vulnerabilities: vulnerabilities.length,
            criticalVulns: vulnerabilities.filter(v => v.severity === 'critical').length,
          },
        }
      } catch (error) {
        return {
          outdated: [],
          vulnerabilities: [],
          summary: { total: 0, outdated: 0, vulnerabilities: 0, criticalVulns: 0 },
        }
      }
    },
    
    getOptimizations: async () => {
      const bundleInfo = await devtoolsService.getBundleInfo()
      const suggestions = []
      
      // Generate optimization suggestions based on bundle info
      if (bundleInfo.totalDependencies > 50) {
        suggestions.push({
          type: 'dependency' as const,
          title: 'Reduce Dependencies',
          description: `You have ${bundleInfo.totalDependencies} dependencies. Consider removing unused packages.`,
          impact: 'medium' as const,
          effort: 'low' as const,
        })
      }

      if (bundleInfo.buildInfo?.buildSize && parseInt(bundleInfo.buildInfo.buildSize) > 500) {
        suggestions.push({
          type: 'bundle-size' as const,
          title: 'Optimize Bundle Size',
          description: 'Your bundle is quite large. Consider code splitting and tree shaking.',
          impact: 'high' as const,
          effort: 'medium' as const,
        })
      }

      // Calculate scores
      const bundleScore = bundleInfo.buildInfo ? 75 : 50
      const dependencyScore = Math.max(0, 100 - bundleInfo.totalDependencies)
      const securityScore = 85 // Mock security score
      const overallScore = Math.round((bundleScore + dependencyScore + securityScore) / 3)

      return {
        suggestions,
        metrics: {
          bundleScore,
          dependencyScore,
          securityScore,
          overallScore,
        },
      }
    },

    getDependencyTree: async (input: any) => {
      const packageName = input?.packageName || 'root'
      
      try {
        const result = await devtoolsService.executeCommand({
          command: `npm list ${packageName !== 'root' ? packageName : ''} --json --depth=2`
        })
        
        if (result.success && result.output) {
          const treeData = JSON.parse(result.output)
          return {
            name: treeData.name || packageName,
            version: treeData.version || '0.0.0',
            dependencies: Object.keys(treeData.dependencies || {}),
            depth: 2,
            size: treeData.size || undefined,
          }
        }
      } catch (error) {
        console.error('Error getting dependency tree:', error)
      }

      return {
        name: packageName,
        version: '0.0.0',
        dependencies: [],
        depth: 0,
      }
    },

    getBuildStats: async () => {
      try {
        // Mock build stats - in a real implementation, you'd parse .next/BUILD_ID or build output
        return {
          buildTime: 15000, // 15 seconds
          buildSize: '2.1MB',
          pages: [
            { path: '/', size: '85KB', firstLoad: '125KB' },
            { path: '/dashboard', size: '45KB', firstLoad: '95KB' },
            { path: '/api/auth', size: '12KB', firstLoad: '32KB' },
          ],
          chunks: [
            { name: 'main', size: '125KB', type: 'initial' },
            { name: 'framework', size: '45KB', type: 'initial' },
            { name: 'commons', size: '32KB', type: 'initial' },
          ],
          assets: [
            { name: 'main.js', size: '125KB', type: 'javascript' },
            { name: 'styles.css', size: '15KB', type: 'stylesheet' },
            { name: 'favicon.ico', size: '4KB', type: 'image' },
          ],
        }
      } catch (error) {
        return {
          pages: [],
          chunks: [],
          assets: [],
        }
      }
    },
  }
}

