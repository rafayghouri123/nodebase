"use client"

import {Node,NodeProps,useReactFlow} from "@xyflow/react"

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node"
import { memo, useState } from "react"
import { GlobeIcon } from "lucide-react"
import { HttpRequestDialog, HttpRequestValues } from "../dialog"
import { defaultConfig } from "next/dist/server/config-shared"


type HttpRequestNodeData = {
    endpoint?:string
    method?:"GET"|"POST"|"PUT"|"DELETE"|"PATCH"
    body?:string
   

}

type HttpRequestNodeType=Node<HttpRequestNodeData>

export const HttpRequestNode=memo((props:NodeProps<HttpRequestNodeType>)=>{
    const nodeData = props.data 
    const description = nodeData?.endpoint ? `${nodeData.method||"GET"}:${nodeData.endpoint}`:"Not configured"

    const nodeStatus = "success"

        const [dialogOpen,setDialogOpen] = useState(false)

        const {setNodes} = useReactFlow()
    
        const handleSetting=()=>{
            setDialogOpen(true)
        }

         const handleSubmit = (values: HttpRequestValues) => {
        setNodes(nodes =>
            nodes.map(node => {
                if (node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...values
                        }
                    }
                }
                return node
            })
        )
        setDialogOpen(false) // optional close after save
    }
    return(
        <>
            <HttpRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
            <BaseExecutionNode 
                {...props}
                id={props.id}
                name="Http Request"
                icon={GlobeIcon}
                description={description}
                status={nodeStatus}
                onSetting={handleSetting}
                onDoubleClick={handleSetting}
            />
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode"