import { CredentialsContainer, CredentialsError, CredentialsList, CredentialsLoading } from "@/features/credentials/components/credentials"
import { credentialsParamLoader } from "@/features/credentials/server/params-loader"
import { prefetchCredentials } from "@/features/credentials/server/prefetch"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"
import { SearchParams } from "nuqs"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

type Props = {
    searchParams:Promise<SearchParams>
}

const Page=async({searchParams}:Props)=>{
    await requireAuth()

    const params = await credentialsParamLoader(searchParams)
    prefetchCredentials(params)

    return(
        <CredentialsContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<CredentialsError/>}></ErrorBoundary>
            <Suspense fallback={<CredentialsLoading/>}></Suspense>
            <CredentialsList/>
        </HydrateClient>
        </CredentialsContainer>
    )
}

export default Page