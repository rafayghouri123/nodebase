import { requireAuth } from "@/lib/auth-utils"

const Page=async()=>{

    await requireAuth()
    return(
        <div>Worksflows</div>
    )
}

export default Page