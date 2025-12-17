"use client"

import {Node,NodeProps,useReactFlow} from "@xyflow/react"

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node"
import { memo, useState } from "react"
import { UseNodeStatus } from "../../hooks/use-node-status"
import {  OpenAiValues, OpenAiDialog } from "./dialog"
import { fetchOpenAIRealtimeToken } from "./actions"


type OpenAiNodeData = {
    variableName?:string
    systemPrompt?:string
    userPrompt?:string

}

type OpenAiNodeType=Node<OpenAiNodeData>

export const OpenAiNode=memo((props:NodeProps<OpenAiNodeType>)=>{
    const nodeData = props.data 
    const description = nodeData?.userPrompt ? `gpt-4:${nodeData.userPrompt.slice(0,50)}...`:"Not configured"

    const nodeStatus = UseNodeStatus({
        nodeId:props.id,
        channel:"openai-execution",
        topic:"status",
        refreshToken:fetchOpenAIRealtimeToken
    })

        const [dialogOpen,setDialogOpen] = useState(false)

        const {setNodes} = useReactFlow()
    
        const handleSetting=()=>{
            setDialogOpen(true)
        }

         const handleSubmit = (values: OpenAiValues) => {
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
            <OpenAiDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
            <BaseExecutionNode 
                {...props}
                id={props.id}
                name="OpenAi"
                icon="/logos/openai.svg"
                description={description}
                status={nodeStatus}
                onSetting={handleSetting}
                onDoubleClick={handleSetting}
            />
        </>
    )
})

OpenAiNode.displayName = "OpenAiNode"