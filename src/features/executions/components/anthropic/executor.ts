import type { NodeExector } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import {createAnthropic} from "@ai-sdk/anthropic"
import Handlebars from "handlebars"
import {generateText} from "ai"
import { anthropicChannel } from "@/inngest/channel/anthropic";
import prisma from "@/lib/database";



Handlebars.registerHelper("json", (context) => {
    const stringyfied = JSON.stringify(context, null, 2)
    const safeString = new Handlebars.SafeString(stringyfied)

    return safeString
})


type AnthropicData = {
    variableName?:string
    credentialId?:string
    systemPrompt?:string
    userPrompt?:string
}

export const AnthropicExecutor: NodeExector<AnthropicData> = async ({ data, nodeId, userId,context, step, publish }) => {


    await publish(
        anthropicChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if(!data.variableName){
        await publish(
            anthropicChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Anthropic node: Variable name is missing")
    }

    if(!data.credentialId){
        await publish(
            anthropicChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Anthropic node: Credential is missing")
    }



    if(!data.userPrompt){
        await publish(
            anthropicChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Anthropic node:User prompt is missing")
    }

    //throw error CHeck credentials



    const systemPrompt = data.systemPrompt?Handlebars.compile(data.systemPrompt)(context): "You are helpful assistant"

    const userPrompt = Handlebars.compile(data.userPrompt)(context)

    //TODO Fetch credentials

    const credential=await step.run("get-credential",()=>{
        return prisma.credentials.findUnique({
        where: {
            id: data.credentialId,
            userId
          
        }
    })
     })  

      if(!credential){
         await publish(
            anthropicChannel().status({
                nodeId,
                status:"error"
            })
        )
         throw new NonRetriableError("Anthrpic node: Credential not found")
      }


    const anthropic = createAnthropic({
        apiKey:credential.value
    })

    try {
        const {steps} = await step.ai.wrap("anthropic-generate-text",generateText,{
            model:anthropic("claude-haiku-4-5"),
            system:systemPrompt,
            prompt:userPrompt,
            experimental_telemetry:{
                isEnabled:true,
                recordInputs:true,
                recordOutputs:true
            }
        })

        const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : ""

        await publish(
            anthropicChannel().status({
                nodeId,
                status:"success"
            })
        )

        return{
            ...context,
            [data.variableName]:{
                text
            }
        }
    } catch (error) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status:"error"
            })
        )
        throw error
    }
}