'use client'

import Link from 'next/link'

import { Button } from '@repo/ui/components/shadcn/button'
import { Input } from '@repo/ui/components/shadcn/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@repo/ui/components/shadcn/form'
import { Alert, AlertDescription } from '@repo/ui/components/shadcn/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import redirect from '@/actions/redirect'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, Spinner } from '@repo/ui/components/atomics/atoms/Icon'
import { signIn } from '@/lib/auth/actions'
import { loginSchema } from './schema'
import { Home } from '@/routes'
import { ArrowLeft, Shield } from 'lucide-react'

const LoginPage: React.FC = () => {
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>('')

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (
        values: z.infer<typeof loginSchema>
    ): Promise<void> => {
        setIsLoading(true)
        const res = await signIn('credentials', { ...values, redirect: false })
        if (res?.error) {
            setError(res?.error)
            setIsLoading(false)
        } else {
            redirect(searchParams.get('callbackUrl') ?? '/')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                {/* Back to Home Link */}
                <Home.Link className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Home</span>
                </Home.Link>

                <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Shield className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                                <CardDescription className="text-base">
                                    Sign in to your account to access the Directus dashboard
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="email">
                                                        Email Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="john@example.com"
                                                            id="email"
                                                            type="email"
                                                            className="h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel htmlFor="password">
                                                            Password
                                                        </FormLabel>
                                                        <Link
                                                            href="/forgot-password"
                                                            className="text-sm text-primary hover:underline"
                                                        >
                                                            Forgot password?
                                                        </Link>
                                                    </div>
                                                    <FormControl>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            className="h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {error && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    {error}
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <Button
                                            disabled={isLoading}
                                            type="submit"
                                            className="w-full h-12 text-base"
                                        >
                                            {isLoading && <Spinner />}
                                            Sign In
                                        </Button>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">
                                                Demo Credentials
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 rounded-lg p-4 text-sm">
                                        <p className="font-medium text-foreground mb-2">Try the demo:</p>
                                        <div className="space-y-1 text-muted-foreground">
                                            <p><strong>Email:</strong> admin@admin.com</p>
                                            <p><strong>Password:</strong> adminadmin</p>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-muted-foreground">
                    <p>
                        Don&apos;t have an account?{' '}
                        <Link href="#" className="text-primary hover:underline">
                            Contact administrator
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
