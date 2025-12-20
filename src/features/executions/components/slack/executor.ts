import type { NodeExector } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars"
import { discordChannel } from "@/inngest/channel/discord";
import {decode} from "html-entities"
import ky from "ky";
import { slackChannel } from "@/inngest/channel/slack";




Handlebars.registerHelper("json", (context) => {
    const stringyfied = JSON.stringify(context, null, 2)
    const safeString = new Handlebars.SafeString(stringyfied)

    return safeString
})


type SlackData = {
    variableName?:string
    webhookUrl?:string
    content?:string
    username?:string
}

export const SlackExecutor: NodeExector<SlackData> = async ({ data, nodeId, context, step, publish }) => {


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

        throw new NonRetriableError("Slack node:Message content is required")
    }


    const rawContent = Handlebars.compile(data.content)(context)
    const content = decode(rawContent)

    try {
        const result = await step.run('slack-webhook',async()=>{

            
    if(!data.webhookUrl){
        await publish(
            slackChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Slack node: Webhook URL is required")
    }

            await ky.post(data.webhookUrl!,{
                json:{
                   content: content,
                    
                }
            })

             if(!data.variableName){
        await publish(
            slackChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Slack node: Variable name is missing")
    }

            return {
                ...context,
                [data.variableName]:{
                    messageContent:content.slice(0,2000)
                }
            }
        })
        await publish(
            slackChannel().status({
                nodeId,
                status:"success"
            })
        )

        return result
    } catch (error) {
        await publish(
            slackChannel().status({
                nodeId,
                status:"error"
            })
        )
        throw error
    }
}