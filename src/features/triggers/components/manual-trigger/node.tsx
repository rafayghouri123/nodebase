
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { ManualTriggerDialog } from "./dialog";


export const ManualTriggerNode = memo((props:NodeProps)=>{

    const nodeStatus = "loading"
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
                //status={nodestatus}
                 onSetting={handleSetting}
                 OnDoubleClick={handleSetting}
            />
        </>
    )
})