import { WorkflowContainer, WorkflowsList } from "@/features/workflows/components/workflows"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

const Page = async () => {

    await requireAuth()
    return (
        <WorkflowContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<p>Error!</p>}>

                    <Suspense fallback={<p>Loading...</p>}>
                        <WorkflowsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowContainer>
    )
}

export default Page