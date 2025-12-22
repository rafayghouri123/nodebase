"use client";
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialsType } from "@prisma/client";


export const useSuspenseCredentials = () => {

    const trpc = useTRPC();
    const [params] = useCredentialsParams()

    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params))

}

export const useSuspenseCredential =(id:string)=>{

    const trpc = useTRPC();

    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({id}))

}


export const useCreateCredentials=()=>{
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.credentials.create.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Credential "${data.name}" created`)
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
            },
        onError:(error)=>{
            toast.error(`Failed to create credential : ${error.message}`)
        }
        })

    )
}





export const useUpdateCredentials=()=>{
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.credentials.update.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Credentials "${data.name}" saved`)
                queryClient.invalidateQueries(trpc.credentials.getOne.queryOptions({id:data.id}))
            },
        onError:(error)=>{
            toast.error(`Failed to save credential : ${error.message}`)
        }
        })

    )
}




export const useRemoveCredentials=()=>{
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Credentials "${data.name}" remove`)
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
                
            },
        onError:(error)=>{
            toast.error(`Failed to remove credential : ${error.message}`)
        }
        })

    )
}


export const useCredentialsByType=(type:CredentialsType)=>{
    const trpc = useTRPC()
    return useQuery(trpc.credentials.getByType.queryOptions({type}))
}