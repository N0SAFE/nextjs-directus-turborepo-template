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
    timeZoneName: 'short'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Build Information
        </h1>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Build Time
            </h2>
            <p className="text-gray-900 font-mono text-sm">
              {buildTimeFormatted}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ISO Format
            </h2>
            <p className="text-gray-900 font-mono text-sm break-all">
              {buildTime}
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              📋 Info
            </h2>
            <p className="text-blue-800 text-sm">
              This page was generated at build time and shows when the application was last built.
              The timestamp will only change when the application is rebuilt.
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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