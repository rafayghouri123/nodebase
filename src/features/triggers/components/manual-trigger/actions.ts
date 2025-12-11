"use server"

import { manualTriggerChannel } from "@/inngest/channel/manual-trigger"
import { inngest } from "@/inngest/client"
import { getSubscriptionToken, Realtime, topic } from "@inngest/realtime"

export type ManualTriggerToken=Realtime.Token<typeof manualTriggerChannel,["status"]>


export async function fetchManualTriggerRealtimeToken():Promise<ManualTriggerToken>{
    const token = await getSubscriptionToken(inngest,{
        channel:manualTriggerChannel(),
        topics:["status"],
    })

    return token
}