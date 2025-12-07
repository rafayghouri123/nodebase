"use client"

import { type NodeProps,Position } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node" 
import { BaseHandle } from "../../../components/react-flow/base-handle"
import { WorkflowNode } from "../../../components/workflow-node"
import { memo, ReactNode } from "react"
import { string } from "zod"
import Image from "next/image"



interface BaseExecutionNodeProps extends NodeProps {
    icon:LucideIcon|string
    name:string
    description?:string
    children?:ReactNode
    //status:
    onSetting?:()=>void
    OnDoubleClick?:()=>void

}

export const BaseExecutionNode=memo(
    ({
        id,
        icon:Icon,
        name,
        description,
        children,
        onSetting,
        OnDoubleClick
    }:BaseExecutionNodeProps)=>{

        const handleDelete=()=>{

        }

        return(
            <WorkflowNode name={name} description={description} onDelete={handleDelete} onSettings={onSetting}>

                <BaseNode onDoubleClick={OnDoubleClick}>
                    <BaseNodeContent>
                        {typeof Icon==="string"?(
                            <Image src={Icon} alt={name} width={16} height={16}/>
                        ):(
                            <Icon className="size-4 text-muted-foreground"/>
                        )}
                        {children}
                        <BaseHandle
                            id="target-1"
                            type="target"
                            position={Position.Left}
                        />
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

BaseExecutionNode.displayName = "BaseExecutionNode"