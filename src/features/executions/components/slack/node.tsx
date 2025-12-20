"use client"

import {Node,NodeProps,useReactFlow} from "@xyflow/react"

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node"
import { memo, useState } from "react"
import { UseNodeStatus } from "../../hooks/use-node-status"
import {  SlackDialog, SlackValues } from "./dialog"
import { fetchSlackRealtimeToken } from "./actions"


type SlackNodeData = {
    webhookUrl?:string,
    content?:string,
    username?:string

}

type SlackNodeType=Node<SlackNodeData>

export const SlackNode=memo((props:NodeProps<SlackNodeType>)=>{
    const nodeData = props.data 
    const description = nodeData?.content ? `Send:${nodeData.content.slice(0,50)}...`:"Not configured"

    const nodeStatus = UseNodeStatus({
        nodeId:props.id,
        channel:"slack-execution",
        topic:"status",
        refreshToken:fetchSlackRealtimeToken
    })

        const [dialogOpen,setDialogOpen] = useState(false)

        const {setNodes} = useReactFlow()
    
        const handleSetting=()=>{
            setDialogOpen(true)
        }

        const handleSubmit = (values: SlackValues) => {
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
            <SlackDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
            <BaseExecutionNode 
                {...props}
                id={props.id}
                name="Slack"
                icon="/logos/slack.svg"
                description={description}
                status={nodeStatus}
                onSetting={handleSetting}
                onDoubleClick={handleSetting}
            />
        </>
    )
})

SlackNode.displayName = "SlackNode"