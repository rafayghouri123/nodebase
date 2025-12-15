"use server"

import { stripeTriggerChannel } from "@/inngest/channel/stripe-trigger"
import { inngest } from "@/inngest/client"
import { getSubscriptionToken, Realtime } from "@inngest/realtime"

export type stripeTriggerToken=Realtime.Token<typeof stripeTriggerChannel,["status"]>


export async function fetchStripeRealtimeToken():Promise<stripeTriggerToken>{
    const token = await getSubscriptionToken(inngest,{
        channel:stripeTriggerChannel(),
        topics:["status"],
    })

    return token
}