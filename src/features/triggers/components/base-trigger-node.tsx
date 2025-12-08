"use client"

import { type NodeProps, Position, useReactFlow } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node"
import { BaseHandle } from "../../../components/react-flow/base-handle"
import { WorkflowNode } from "../../../components/workflow-node"
import { memo, ReactNode } from "react"
import { string } from "zod"
import Image from "next/image"
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator"



interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string
    name: string
    description?: string
    children?: ReactNode
    status:NodeStatus
    onSetting?: () => void
    OnDoubleClick?: () => void

}

export const BaseTriggerNode = memo(
    ({
        id,
        icon: Icon,
        name,
        description,
        children,
        onSetting,
        OnDoubleClick,
        status="initial"
    }: BaseTriggerNodeProps) => {

        const { setNodes, setEdges } = useReactFlow()

        const handleDelete = () => {
            setNodes((currentNodes) => {
                const updateNodes = currentNodes.filter((node) => node.id !== id)
                return updateNodes
            })

            setEdges((currentEdges) => {
                const updatedEdges = currentEdges.filter((edge) => edge.source !== id && edge.target !== id)

                return updatedEdges
            })
        }

        return (
            <WorkflowNode name={name} description={description} onDelete={handleDelete} onSettings={onSetting}>
                <NodeStatusIndicator status={status} variant="border" className="rounded-l-2xl">
                    <BaseNode onDoubleClick={OnDoubleClick} className="rounded-l-2xl relative group" status={status}>
                        <BaseNodeContent>
                            {typeof Icon === "string" ? (
                                <Image src={Icon} alt={name} width={16} height={16} />
                            ) : (
                                <Icon className="size-4 text-muted-foreground" />
                            )}
                            {children}

                            <BaseHandle
                                id="source-1"
                                type="source"
                                position={Position.Right}
                            />
                        </BaseNodeContent>
                    </BaseNode>
                </NodeStatusIndicator>

            </WorkflowNode>

        )
    }
)

BaseTriggerNode.displayName = "BaseTriggerNode"