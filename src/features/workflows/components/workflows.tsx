"use client"

import { EntityContainer, EntityHeader } from "@/components/entity-component"
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"





export const WorkflowsList=()=>{
    const workflows = useSuspenseWorkflows()

    

    return(
       <div className="flex-1 flex justify-center items-center">
             <p>
            {JSON.stringify(workflows.data,null,2)}
            </p>
       </div>
    )
}

export const WorkflowsHeader=({disabled}:{disabled?:boolean})=>{
    const router = useRouter()
    const {handleError,modal}=useUpgradeModal()
    const createWorkflow = useCreateWorkflow()

    const handleCreate=()=>{
        createWorkflow.mutate(undefined,{
            onSuccess:(data)=>{
                router.push(`worksflows/${data.id}`)
            }
        ,
            onError:(error)=>{
                handleError(error)
            }
         }
        )
    }

    return(
        <>
        {modal}
        <EntityHeader 
            
            title="Workflows"
            description="Create and manage your workflows"
            onNew={handleCreate}
            newButtonLabel="New workflow"
            disabled={disabled}
            isCreating={createWorkflow.isPending}
        />

        </>
    )
}


export const WorkflowContainer = ({children}:{children:React.ReactNode})=>{

    return(
        <EntityContainer 
            header={<WorkflowsHeader/>}
            search={<></>}
            pagination={<></>}    
        >
            {children}

        </EntityContainer>
    )
}