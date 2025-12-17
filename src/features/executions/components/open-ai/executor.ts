import type { NodeExector } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import {createOpenAI} from "@ai-sdk/openai"
import Handlebars from "handlebars"
import {generateText} from "ai"
import { openaiChannel } from "@/inngest/channel/openai";



Handlebars.registerHelper("json", (context) => {
    const stringyfied = JSON.stringify(context, null, 2)
    const safeString = new Handlebars.SafeString(stringyfied)

    return safeString
})


type OpenAiData = {
    variableName?:string
    systemPrompt?:string
    userPrompt?:string
}

export const OpenAiExecutor: NodeExector<OpenAiData> = async ({ data, nodeId, context, step, publish }) => {


    await publish(
        openaiChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if(!data.variableName){
        await publish(
            openaiChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("OpenAi node: Variable name is missing")
    }

    if(!data.userPrompt){
        await publish(
            openaiChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Open AI node:User prompt is missing")
    }

    //throw error CHeck credentials



    const systemPrompt = data.systemPrompt?Handlebars.compile(data.systemPrompt)(context): "You are helpful assistant"

    const userPrompt = Handlebars.compile(data.userPrompt)(context)

    //TODO Fetch credentials


    const credentialValue = process.env.OPENAI_API_KEY!;

    const openai = createOpenAI({
        apiKey:credentialValue
    })

    try {
        const {steps} = await step.ai.wrap("openai-generate-text",generateText,{
            model:openai("gpt-4"),
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
            openaiChannel().status({
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
            openaiChannel().status({
                nodeId,
                status:"error"
            })
        )
        throw error
    }
}