"use server"

import { discordChannel } from "@/inngest/channel/discord"
import { openaiChannel } from "@/inngest/channel/openai"
import { slackChannel } from "@/inngest/channel/slack"
import { inngest } from "@/inngest/client"
import { getSubscriptionToken, Realtime } from "@inngest/realtime"

export type SlackToken=Realtime.Token<typeof slackChannel,["status"]>


export async function fetchSlackRealtimeToken():Promise<SlackToken>{
    const token = await getSubscriptionToken(inngest,{
        channel:slackChannel(),
        topics:["status"],
    })

    return token
}