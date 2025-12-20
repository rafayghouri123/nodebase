"use client"

import {Node,NodeProps,useReactFlow} from "@xyflow/react"

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node"
import { memo, useState } from "react"
import { UseNodeStatus } from "../../hooks/use-node-status"
import { DiscordDialog, DiscordValues } from "./dialog"
import { fetchDiscordRealtimeToken } from "./actions"


type DiscordNodeData = {
    webhookUrl?:string,
    content?:string,
    username?:string

}

type DiscordNodeType=Node<DiscordNodeData>

export const DiscordNode=memo((props:NodeProps<DiscordNodeType>)=>{
    const nodeData = props.data 
    const description = nodeData?.content ? `Send:${nodeData.content.slice(0,50)}...`:"Not configured"

    const nodeStatus = UseNodeStatus({
        nodeId:props.id,
        channel:"discord-execution",
        topic:"status",
        refreshToken:fetchDiscordRealtimeToken
    })

        const [dialogOpen,setDialogOpen] = useState(false)

        const {setNodes} = useReactFlow()
    
        const handleSetting=()=>{
            setDialogOpen(true)
        }

         const handleSubmit = (values: DiscordValues) => {
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
            <DiscordDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
            <BaseExecutionNode 
                {...props}
                id={props.id}
                name="Discord"
                icon="/logos/discord.svg"
                description={description}
                status={nodeStatus}
                onSetting={handleSetting}
                onDoubleClick={handleSetting}
            />
        </>
    )
})

DiscordNode.displayName = "DiscordNode"