"use client"

import {Node,NodeProps,useReactFlow} from "@xyflow/react"

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node"
import { memo, useState } from "react"
import { UseNodeStatus } from "../../hooks/use-node-status"
import {  AnthropicDialog, AnthropicValues } from "./dialog"
import { fetchAnthropicRealtimeToken } from "./actions"


type AnthropicNodeData = {
    variableName?:string
    credentialId?:string
    systemPrompt?:string
    userPrompt?:string

}

type AnthropicNodeType=Node<AnthropicNodeData>

export const AnthropicNode=memo((props:NodeProps<AnthropicNodeType>)=>{
    const nodeData = props.data 
    const description = nodeData?.userPrompt ? `claude-haiku-4-5:${nodeData.userPrompt.slice(0,50)}...`:"Not configured"

    const nodeStatus = UseNodeStatus({
        nodeId:props.id,
        channel:"anthropic-execution",
        topic:"status",
        refreshToken:fetchAnthropicRealtimeToken
    })

        const [dialogOpen,setDialogOpen] = useState(false)

        const {setNodes} = useReactFlow()
    
        const handleSetting=()=>{
            setDialogOpen(true)
        }

         const handleSubmit = (values: AnthropicValues) => {
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
            <AnthropicDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
            <BaseExecutionNode 
                {...props}
                id={props.id}
                name="Anthropic"
                icon="/logos/anthropic.svg"
                description={description}
                status={nodeStatus}
                onSetting={handleSetting}
                onDoubleClick={handleSetting}
            />
        </>
    )
})

AnthropicNode.displayName = "AnthropicNode"