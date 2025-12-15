
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { NodeProps } from "@xyflow/react";
import { StripeTriggerDialog } from "./dialog";
import { UseNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeRealtimeToken } from "./actions";


export const StripeTriggerNode = memo((props:NodeProps)=>{

     const nodeStatus = UseNodeStatus({
                 nodeId:props.id,
                 channel:"stripe-trigger-execution",
                 topic:"status",
                 refreshToken:fetchStripeRealtimeToken
             })
    const [dialogOpen,setDialogOpen] = useState(false)

    const handleSetting=()=>{
        setDialogOpen(true)
    }

    return(
        <>
            <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode status={nodeStatus}
                {...props}
                name="Stripe"
                description="When stripe event is captured"
                icon="/logos/stripe.svg"
                //status={nodestatus}
                 onSetting={handleSetting}
                 OnDoubleClick={handleSetting}
            />
        </>
    )
})