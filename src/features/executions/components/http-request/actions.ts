"use server"

import { httpRequestChannel } from "@/inngest/channel/http-request"
import { inngest } from "@/inngest/client"
import { getSubscriptionToken, Realtime, topic } from "@inngest/realtime"

export type httpRequestToken=Realtime.Token<typeof httpRequestChannel,["status"]>


export async function fetchHttpRequestRealtimeToken():Promise<httpRequestToken>{
    const token = await getSubscriptionToken(inngest,{
        channel:httpRequestChannel(),
        topics:["status"],
    })

    return token
}