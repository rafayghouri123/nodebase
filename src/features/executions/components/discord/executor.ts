import type { NodeExector } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars"
import { discordChannel } from "@/inngest/channel/discord";
import {decode} from "html-entities"
import ky from "ky";




Handlebars.registerHelper("json", (context) => {
    const stringyfied = JSON.stringify(context, null, 2)
    const safeString = new Handlebars.SafeString(stringyfied)

    return safeString
})


type DiscordData = {
    variableName?:string
    webhookUrl?:string
    content?:string
    username?:string
}

export const DiscordExecutor: NodeExector<DiscordData> = async ({ data, nodeId, context, step, publish }) => {


    await publish(
        discordChannel().status({
            nodeId,
            status: "loading"
        })
    )

   

    if(!data.content){
        await publish(
            discordChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Discord node:Message content is required")
    }


    const rawContent = Handlebars.compile(data.content)(context)
    const content = decode(rawContent)
    const username = data.username?decode(Handlebars.compile(data.username)(context)) : undefined;

    try {
        const result = await step.run('discord-webhook',async()=>{

            
    if(!data.webhookUrl){
        await publish(
            discordChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Discord node: Webhook URL is required")
    }

            await ky.post(data.webhookUrl!,{
                json:{
                    content:content.slice(0,2000),
                    username
                }
            })

             if(!data.variableName){
        await publish(
            discordChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("OpenAi node: Variable name is missing")
    }

            return {
                ...context,
                [data.variableName]:{
                    messageContent:content.slice(0,2000)
                }
            }
        })
        await publish(
            discordChannel().status({
                nodeId,
                status:"success"
            })
        )

        return result
    } catch (error) {
        await publish(
            discordChannel().status({
                nodeId,
                status:"error"
            })
        )
        throw error
    }
}