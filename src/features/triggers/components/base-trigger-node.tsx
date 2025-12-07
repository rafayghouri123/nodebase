"use client"

import { type NodeProps,Position } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node" 
import { BaseHandle } from "../../../components/react-flow/base-handle"
import { WorkflowNode } from "../../../components/workflow-node"
import { memo, ReactNode } from "react"
import { string } from "zod"
import Image from "next/image"



interface BaseTriggerNodeProps extends NodeProps {
    icon:LucideIcon|string
    name:string
    description?:string
    children?:ReactNode
    //status:
    onSetting?:()=>void
    OnDoubleClick?:()=>void

}

export const BaseTriggerNode=memo(
    ({
        id,
        icon:Icon,
        name,
        description,
        children,
        onSetting,
        OnDoubleClick
    }:BaseTriggerNodeProps)=>{

        const handleDelete=()=>{

        }

        return(
            <WorkflowNode name={name} description={description} onDelete={handleDelete} onSettings={onSetting}>

                <BaseNode onDoubleClick={OnDoubleClick} className="rounded-l-2xl relative group ">
                    <BaseNodeContent>
                        {typeof Icon==="string"?(
                            <Image src={Icon} alt={name} width={16} height={16}/>
                        ):(
                            <Icon className="size-4 text-muted-foreground"/>
                        )}
                        {children}
                       
                        <BaseHandle
                            id="source-1"
                            type="source"
                            position={Position.Right}
                        />
                    </BaseNodeContent>
                </BaseNode>

            </WorkflowNode>

        )
    }
)

BaseTriggerNode.displayName = "BaseTriggerNode"