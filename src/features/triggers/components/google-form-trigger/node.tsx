
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { NodeProps } from "@xyflow/react";
import { GoogleFormDialog } from "./dialog";
import { UseNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormRealtimeToken } from "./actions";


export const GoogleFormTriggerNode = memo((props:NodeProps)=>{

     const nodeStatus = UseNodeStatus({
                 nodeId:props.id,
                 channel:"google-form-trigger-execution",
                 topic:"status",
                 refreshToken:fetchGoogleFormRealtimeToken
             })
    const [dialogOpen,setDialogOpen] = useState(false)

    const handleSetting=()=>{
        setDialogOpen(true)
    }

    return(
        <>
            <GoogleFormDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode status={nodeStatus}
                {...props}
                name="Google Form"
                description="When From is submitted"
                icon="/logos/google-forms.png"
                //status={nodestatus}
                 onSetting={handleSetting}
                 OnDoubleClick={handleSetting}
            />
        </>
    )
})