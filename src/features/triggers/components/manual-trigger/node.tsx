
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { ManualTriggerDialog } from "./dialog";
import { UseNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchManualTriggerRealtimeToken } from "./actions";


export const ManualTriggerNode = memo((props:NodeProps)=>{

     const nodeStatus = UseNodeStatus({
            nodeId:props.id,
            channel:"manual-trigger-execution",
            topic:"status",
            refreshToken:fetchManualTriggerRealtimeToken
        })
    const [dialogOpen,setDialogOpen] = useState(false)

    const handleSetting=()=>{
        setDialogOpen(true)
    }

    return(
        <>
            <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode status={nodeStatus}
                {...props}
                name="When Clicking 'Execute Workflow'"
                icon={MousePointerIcon}
                 onSetting={handleSetting}
                 OnDoubleClick={handleSetting}
            />
        </>
    )
})