import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Button } from '@repo/ui/components/shadcn/button'
import { Appshowcase, AppshowcaseServer } from '@/routes'
import { ArrowLeft, Monitor, Zap, RefreshCw, Database } from 'lucide-react'
import ClientSideShowcase from './ClientSide'

const ShowcaseClientPage: React.FC = async function ShowcaseClientPage() {
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
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Monitor className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-bold">Client-Side Data Fetching</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Interactive data fetching with React Query, loading states, and real-time updates
                    </p>
                </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <Zap className="h-8 w-8 mx-auto text-yellow-500 mb-3" />
                        <h3 className="font-semibold mb-2">React Query</h3>
                        <p className="text-sm text-muted-foreground">
                            Powerful data synchronization with caching and background updates
                        </p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <RefreshCw className="h-8 w-8 mx-auto text-green-500 mb-3" />
                        <h3 className="font-semibold mb-2">Loading States</h3>
                        <p className="text-sm text-muted-foreground">
                            Smooth user experience with loading indicators and error handling
                        </p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <Database className="h-8 w-8 mx-auto text-blue-500 mb-3" />
                        <h3 className="font-semibold mb-2">Real-time Data</h3>
                        <p className="text-sm text-muted-foreground">
                            Live updates and optimistic UI patterns for better interactivity
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
                                <Monitor className="h-5 w-5" />
                                <span>Live Demo</span>
                            </CardTitle>
                            <CardDescription>
                                Watch the data load dynamically with performance metrics
                            </CardDescription>
                        </div>
                        <AppshowcaseServer.Link>
                            <Button variant="outline">
                                Compare with SSR
                            </Button>
                        </AppshowcaseServer.Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <ClientSideShowcase />
                </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Implementation Details</CardTitle>
                    <CardDescription>
                        How client-side data fetching works in this application
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="font-semibold">Key Technologies</h3>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• React Query for data fetching</li>
                                <li>• Custom Directus SDK wrapper</li>
                                <li>• TypeScript for type safety</li>
                                <li>• Suspense for loading states</li>
                                <li>• Error boundaries for error handling</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold">Benefits</h3>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Faster subsequent navigation</li>
                                <li>• Real-time data updates</li>
                                <li>• Optimistic UI updates</li>
                                <li>• Background refetching</li>
                                <li>• Intelligent caching strategies</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-2">Code Example</h3>
                        <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
{`const { data: users, isFetched } = useQuery({
    queryKey: ['users'],
    queryFn: () => directus.DirectusUsers.query()
})`}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowcaseClientPage
