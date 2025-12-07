"use client"

import type {Node,NodeProps,useReactFlow} from "@xyflow/react"

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node"
import { memo } from "react"
import { GlobeIcon } from "lucide-react"


type HttpRequestNodeData = {
    endpoint?:string
    method?:"GET"|"POST"|"PUT"|"DELETE"|"PATCH"
    body?:string
    [key:string]:unknown

}

type HttpRequestNodeType=Node<HttpRequestNodeData>

export const HttpRequestNode=memo((props:NodeProps<HttpRequestNodeType>)=>{
    const nodeData = props.data as HttpRequestNodeData
    const description = nodeData?.endpoint ? `${nodeData.method||"GET"}:${nodeData.endpoint}`:"Not configured"


    return(
        <>
            <BaseExecutionNode 
                {...props}
                id={props.id}
                name="Http Request"
                icon={GlobeIcon}
                description={description}
                onSetting={()=>{}}
                OnDoubleClick={()=>{}}
            />
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode"