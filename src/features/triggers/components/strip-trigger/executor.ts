import type { NodeExector } from "@/features/executions/types";
import { stripeTriggerChannel } from "@/inngest/channel/stripe-trigger";

type StripeTriggerData = Record<string,unknown>

export const StripeExecutorTriggerExecutor:NodeExector<StripeTriggerData>=async({nodeId,context,step,publish})=>{

    await publish(
        stripeTriggerChannel().status({
            nodeId,
            status:"loading"
        })
    )
    const result = await step.run("stripe-form-trigger",async()=>context)

     await publish(
        stripeTriggerChannel().status({
            nodeId,
            status:"success"
        })
    )

    return result

}