import { ZodInvalidTypeIssue, ZodIssue } from 'zod'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/shadcn/card'
import { validateEnvSafe } from '#/env'
import RedirectAfterDelay from './RedirectAfterDelay'

function renderInvalidType(issue: ZodInvalidTypeIssue) {
    return (
        <div className="m-4 flex gap-4">
            <div className="flex justify-between gap-2">
                <div className="text-sm text-gray-500">Received: </div>
                <div className="text-sm text-red-500">
                    {issue.received.toString()}
                </div>
            </div>
            <div className="flex justify-between gap-2">
                <div className="text-sm text-gray-500">Expected Type: </div>
                <div className="text-sm text-red-500">
                    {issue.expected.toString()}
                </div>
            </div>{' '}
        </div>
    )
}

function renderByCode(issue: ZodIssue) {
    switch (issue.code) {
        case 'invalid_type':
            return renderInvalidType(issue)
        default:
            return null
    }
}

export default async function EnvPage({
    searchParams,
}: {
    searchParams: { redirect?: string }
}) {
    const parsedEnv = validateEnvSafe(process.env as any)
    if (parsedEnv.success) {
        return (
            <div className="mt-12 flex flex-col items-center justify-center">
                <Card className="w-[380px]">
                    <CardHeader className="text-center">
                        <CardTitle>Environment is Valid</CardTitle>
                        <CardDescription>Redirecting...</CardDescription>
                    </CardHeader>
                </Card>
                <RedirectAfterDelay
                    delay={3000}
                    to={searchParams.redirect || '/'}
                />
            </div>
        )
    }
    const issues = parsedEnv.error.issues
    return (
        <div className="mt-12 flex flex-col items-center justify-center">
            {issues.map((issue, index) => (
                <Card key={index} className="w-[380px]">
                    <CardHeader className="text-center">
                        <CardTitle className="text-red-500">
                            {issue.message}
                        </CardTitle>
                        <CardDescription>
                            {issue.path.join('.')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderByCode(issue)}
                        <div className="flex items-center justify-between pt-8">
                            <div className="text-sm text-gray-500">
                                Code: {issue.code}
                            </div>
                            <div className="text-sm text-yellow-500">
                                {issue.fatal || 'warning'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
