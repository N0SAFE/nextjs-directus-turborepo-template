import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Button } from '@repo/ui/components/shadcn/button'
import { Appshowcase, AppshowcaseClient } from '@/routes'
import { ArrowLeft, Server, Zap, Shield, Globe } from 'lucide-react'
import ServerSideShowcase from './ServerSide'

const ShowcaseServerPage: React.FC = async function ShowcaseServerPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Back Navigation */}
            <Appshowcase.Link className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Showcase</span>
            </Appshowcase.Link>

            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                        <Server className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-bold">Server-Side Rendering</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Fast, SEO-friendly pages with pre-rendered data using React Server Components
                    </p>
                </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <Zap className="h-8 w-8 mx-auto text-yellow-500 mb-3" />
                        <h3 className="font-semibold mb-2">Lightning Fast</h3>
                        <p className="text-sm text-muted-foreground">
                            Immediate content display with no loading states required
                        </p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <Globe className="h-8 w-8 mx-auto text-blue-500 mb-3" />
                        <h3 className="font-semibold mb-2">SEO Optimized</h3>
                        <p className="text-sm text-muted-foreground">
                            Fully indexed content for better search engine visibility
                        </p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <Shield className="h-8 w-8 mx-auto text-green-500 mb-3" />
                        <h3 className="font-semibold mb-2">Secure</h3>
                        <p className="text-sm text-muted-foreground">
                            Server-side data access with better security controls
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Demo */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center space-x-2">
                                <Server className="h-5 w-5" />
                                <span>Pre-rendered Content</span>
                            </CardTitle>
                            <CardDescription>
                                Data fetched during build time or page generation
                            </CardDescription>
                        </div>
                        <AppshowcaseClient.Link>
                            <Button variant="outline">
                                Compare with CSR
                            </Button>
                        </AppshowcaseClient.Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <ServerSideShowcase />
                </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Implementation Details</CardTitle>
                    <CardDescription>
                        How server-side rendering works in this Next.js application
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="font-semibold">Key Technologies</h3>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• React Server Components</li>
                                <li>• Next.js App Router</li>
                                <li>• Direct Directus SDK calls</li>
                                <li>• TypeScript for type safety</li>
                                <li>• Streaming and Suspense</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold">Benefits</h3>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Faster initial page load</li>
                                <li>• Better SEO performance</li>
                                <li>• Reduced client-side JavaScript</li>
                                <li>• Improved Core Web Vitals</li>
                                <li>• Server-side security</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-2">Code Example</h3>
                        <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
{`// React Server Component
export default async function ServerComponent() {
    const users = await directus.DirectusUsers.query({
        fields: ['id', 'status']
    })
    
    return <div>{/* Render users */}</div>
}`}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowcaseServerPage
