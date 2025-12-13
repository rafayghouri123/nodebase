import type { NodeExector } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channel/google-form-trigger";

type GoogleFormTriggerData = Record<string,unknown>

export const GoogleFormExecutorTriggerExecutor:NodeExector<GoogleFormTriggerData>=async({nodeId,context,step,publish})=>{

    await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status:"loading"
        })
    )
    const result = await step.run("google-form-trigger",async()=>context)

     await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status:"success"
        })
    )

    return result

}