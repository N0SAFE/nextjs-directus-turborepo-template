'use server'

export default async function HealthCheckPage({
    searchParams,
}: {
    searchParams?: { json?: string }
}) {
    return searchParams?.json ? searchParams?.json : '{status: "ko"}'
}
