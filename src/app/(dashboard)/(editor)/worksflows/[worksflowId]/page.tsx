import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor"
import { EditorHeader } from "@/features/editor/components/editor-header"
import { WorkflowsError, WorkflowsLoading } from "@/features/workflows/components/workflows"
import { prefetchWorkflow } from "@/features/workflows/server/prefetch"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient, prefetch } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface PageProps {
    params: Promise<{
        worksflowId: string
    }>
}



const Page = async ({ params }: PageProps) => {
    await requireAuth()
    const { worksflowId } = await params

    prefetchWorkflow(worksflowId)


    return (

        <HydrateClient>
            <ErrorBoundary fallback={<EditorError/>}>

                <Suspense fallback={<EditorLoading/>}>
                <EditorHeader workflowId={worksflowId}/>
                <main className="flex-1">
                    <Editor workflowId={worksflowId}/>
                </main>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    )

}
export default Page