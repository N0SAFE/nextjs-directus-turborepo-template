// This function runs at build time and makes the page static
export default function BuildInfoPage() {
    // This timestamp is captured at build time
    const buildTime = new Date().toISOString()
    const buildTimeFormatted = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    })

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
                    Build Information
                </h1>

                <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                        <h2 className="mb-2 text-lg font-semibold text-gray-700">
                            Build Time
                        </h2>
                        <p className="font-mono text-sm text-gray-900">
                            {buildTimeFormatted}
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                        <h2 className="mb-2 text-lg font-semibold text-gray-700">
                            ISO Format
                        </h2>
                        <p className="font-mono text-sm break-all text-gray-900">
                            {buildTime}
                        </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-4">
                        <h2 className="mb-2 text-lg font-semibold text-blue-700">
                            📋 Info
                        </h2>
                        <p className="text-sm text-blue-800">
                            This page was generated at build time and shows when
                            the application was last built. The timestamp will
                            only change when the application is rebuilt.
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    )
}

// Force static generation at build time
export const dynamic = 'force-static'
export const revalidate = false
