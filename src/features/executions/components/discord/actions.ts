"use server"

import { discordChannel } from "@/inngest/channel/discord"
import { openaiChannel } from "@/inngest/channel/openai"
import { inngest } from "@/inngest/client"
import { getSubscriptionToken, Realtime } from "@inngest/realtime"

export type DiscordToken=Realtime.Token<typeof discordChannel,["status"]>


export async function fetchDiscordRealtimeToken():Promise<DiscordToken>{
    const token = await getSubscriptionToken(inngest,{
        channel:discordChannel(),
        topics:["status"],
    })

    return token
}