import { requireAuth } from "@/lib/auth-utils"

interface PageProps {
    params: Promise<{
        worksflowId:string
    }>
}



const Page=async({params}:PageProps)=>{
      await requireAuth()
    const {worksflowId} = await params

    return(
        <div>Crendtials ID: {worksflowId}</div>
    )
}

export default Page