import type { NodeExector } from "@/features/executions/types";

type ManualTriggerData = Record<string,unknown>

export const manualTriggerExecutor:NodeExector<ManualTriggerData>=async({nodeId,context,step})=>{

    const result = await step.run("manual-trigger",async()=>context)

    return result

}