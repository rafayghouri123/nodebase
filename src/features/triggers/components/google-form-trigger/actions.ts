"use server"

import { googleFormTriggerChannel } from "@/inngest/channel/google-form-trigger"
import { inngest } from "@/inngest/client"
import { getSubscriptionToken, Realtime } from "@inngest/realtime"

export type GoogleFromTriggerToken=Realtime.Token<typeof googleFormTriggerChannel,["status"]>


export async function fetchGoogleFormRealtimeToken():Promise<GoogleFromTriggerToken>{
    const token = await getSubscriptionToken(inngest,{
        channel:googleFormTriggerChannel(),
        topics:["status"],
    })

    return token
}