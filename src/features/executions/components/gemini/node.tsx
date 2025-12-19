"use client"

import {Node,NodeProps,useReactFlow} from "@xyflow/react"

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node"
import { memo, useState } from "react"
import { UseNodeStatus } from "../../hooks/use-node-status"
import { AVALIABLE_MODELS, GeminiDialog, GeminiValues } from "./dialog"
import { fetchGeminiRealtimeToken } from "./actions"


type GeminiNodeData = {
    variableName?:string
    credentialId?:string
    model?:"gemini-2.0-flash"|"gemini-1.5-flash" | "gemini-1.5-flash-8b" | "gemini-1.5-pro" | "gemini-1.0-pro" | "gemini-pro" ,
    systemPrompt?:string
    userPrompt?:string

}

type GeminiNodeType=Node<GeminiNodeData>

export const GeminiNode=memo((props:NodeProps<GeminiNodeType>)=>{
    const nodeData = props.data 
    const description = nodeData?.userPrompt ? `${nodeData.model||AVALIABLE_MODELS[0]}:${nodeData.userPrompt.slice(0,50)}...`:"Not configured"

    const nodeStatus = UseNodeStatus({
        nodeId:props.id,
        channel:"gemini-execution",
        topic:"status",
        refreshToken:fetchGeminiRealtimeToken
    })

        const [dialogOpen,setDialogOpen] = useState(false)

        const {setNodes} = useReactFlow()
    
        const handleSetting=()=>{
            setDialogOpen(true)
        }

         const handleSubmit = (values: GeminiValues) => {
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
            <GeminiDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
            <BaseExecutionNode 
                {...props}
                id={props.id}
                name="Gemini"
                icon="/logos/gemini.svg"
                description={description}
                status={nodeStatus}
                onSetting={handleSetting}
                onDoubleClick={handleSetting}
            />
        </>
    )
})

GeminiNode.displayName = "GeminiNode"