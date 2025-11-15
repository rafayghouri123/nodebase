"use client"

import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-component"
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"


export const WorkflowSearch=()=>{

    const [params,setParams] = useWorkflowsParams()

    const {searchValue,onSearchChange} = useEntitySearch({
        params,
        setParams
    })

    return(
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search Workflow"
        />
    )
}



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


export const WorkflowsPagination=()=>{
    const workflows = useSuspenseWorkflows()
    const [params,setParams] = useWorkflowsParams()

    return(
        <EntityPagination
            disabled={workflows.isFetching}
            totalPages={workflows.data.totalPages}
            page={workflows.data.page}
            onPageChange={(page)=>setParams({...params,page})}
        />
    )
}

export const WorkflowContainer = ({children}:{children:React.ReactNode})=>{


    return(
        <EntityContainer 
            header={<WorkflowsHeader/>}
            search={<WorkflowSearch/>}
            pagination={<WorkflowsPagination/>}    
        >
            {children}

        </EntityContainer>
    )
}