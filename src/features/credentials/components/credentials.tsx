"use client"
import { formatDistanceToNow } from "date-fns"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-component"
import { useRouter } from "next/navigation"
import {useCredentialsParams  } from "../hooks/use-credentials-params"
import { useEntitySearch } from "@/hooks/use-entity-search"
import  { Credentials,CredentialsType} from "@/generated/prisma/browser"
import { useRemoveCredentials, useSuspenseCredentials } from "../hooks/use-credentials"
import Image from "next/image"



export const CredentialsSearch=()=>{

    const [params,setParams] = useCredentialsParams()

    const {searchValue,onSearchChange} = useEntitySearch({
        params,
        setParams
    })

    return(
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search crednetials"
        />
    )


}



export const CredentialsList=()=>{
    const credentials = useSuspenseCredentials()
    
    return(
        <EntityList 
        items={credentials.data.items}
        getKey={(credential)=>credential.id}
        renderItem={(credential)=><CredentialsItem data={credential}/>}
        emptyView={<CredentialsEmpty/>}
        />
    )
}

export const CredentialsHeader=({disabled}:{disabled?:boolean})=>{


    return(
    
     
        <EntityHeader 
            
            title="Credentials"
            description="Create and manage your credential"
            newButtonHref="/credentials/new"
            newButtonLabel="New Credential"
            disabled={disabled}
           
        />

        
    )
}


export const CredentialsPagination=()=>{
    const credential = useSuspenseCredentials()
    const [params,setParams] = useCredentialsParams()

    return(
        <EntityPagination
            disabled={credential.isFetching}
            totalPages={credential.data.totalPages}
            page={credential.data.page}
            onPageChange={(page)=>setParams({...params,page})}
        />
    )
}

export const CredentialsContainer = ({children}:{children:React.ReactNode})=>{


    return(
        <EntityContainer 
            header={<CredentialsHeader/>}
            search={<CredentialsSearch/>}
            pagination={<CredentialsPagination/>}    
        >
            {children}

        </EntityContainer>
    )
}

export const CredentialsLoading=()=>{
    return(
        <LoadingView message="Loading Credentials...."/>
    )
}

export const CredentialsError=()=>{
    return(
        <ErrorView message="Error loading Credentials"/>
    )
}


export const CredentialsEmpty=()=>{
    const router = useRouter()

    const handleCreate=()=>{

                router.push(`credentials/new`)

        }
    

    return(
     
        <EmptyView onNew={handleCreate} message="No credential found. Get started by creating your first credentials"/>
       
    )
}

const credentialLogos:Record<CredentialsType,string>={
    [CredentialsType.OPENAI]:"/logos/openai.svg",
    [CredentialsType.GEMINI]:"/logos/gemini.svg",
    [CredentialsType.ANTHROPIC]:"/logos/anthropic.svg"
}

export const CredentialsItem=({data}:{data:Credentials})=>{

    const removeCredential = useRemoveCredentials()

    const handleRemove = ()=>{
        removeCredential.mutate({id:data.id})
    }

     const logo=credentialLogos[data.type]||"/logos/openai.svg"

    return(
        <EntityItem
            href={`/credentials/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Update {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "}
                    &bull; Created {formatDistanceToNow(data.createdAt,{addSuffix:true})}{" "} 
                    
                </>
            } 
            image={
                <div className="size-8 flex items-center justify-center">
                     <Image src={logo} alt={data.type} width={20} height={20}/>
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}   
        />
    )
}

