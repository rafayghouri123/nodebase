"use client"
import { formatDistanceToNow } from "date-fns"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-component"
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"
import { Workflow } from "@prisma/client"
import { WorkflowIcon } from "lucide-react"



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
        <EntityList 
        items={workflows.data.items}
        getKey={(workflow)=>workflow.id}
        renderItem={(workflow)=><WorkflowItem data={workflow}/>}
        emptyView={<WorkflowsEmpty/>}
        />
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

export const WorkflowsLoading=()=>{
    return(
        <LoadingView message="Loading Workflows...."/>
    )
}

export const WorkflowsError=()=>{
    return(
        <ErrorView message="Error loading Workflows"/>
    )
}


export const WorkflowsEmpty=()=>{
    const createWorkflow = useCreateWorkflow()
    const router = useRouter()

    const {handleError,modal} = useUpgradeModal()

    const handleCreate=()=>{
        createWorkflow.mutate(undefined
            ,{
             onSuccess:(data)=>{
                router.push(`worksflows/${data.id}`)
             }   ,
            onError:(error)=>{
                handleError(error)
            }
        })
    }

    return(
        <>
        {modal}
        <EmptyView onNew={handleCreate} message="No workflows found. Get started by creating your first workflow"/>
        </>
    )
}



export const WorkflowItem=({data}:{data:Workflow})=>{

    const removeWorkflow = useRemoveWorkflow()

    const handleRemove = ()=>{
        removeWorkflow.mutate({id:data.id})
    }

    return(
        <EntityItem
            href={`worksflows/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Update {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "}
                    &bull; Created {formatDistanceToNow(data.createdAt,{addSuffix:true})}{" "} 
                    
                </>
            } 
            image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground"/>
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeWorkflow.isPending}   
        />
    )
}

