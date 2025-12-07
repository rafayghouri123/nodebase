
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { NodeProps } from "@xyflow/react";


export const ManualTriggerNode = memo((props:NodeProps)=>{
    return(
        <>
            <BaseTriggerNode
                {...props}
                name="When Clicking 'Execute Workflow'"
                icon={MousePointerIcon}
                //status={nodestatus}
                // onSetting={()=>{}}
                // OnDoubleClick={()=>{}}
            />
        </>
    )
})