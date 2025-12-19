import type { NodeExector } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import Handlebars from "handlebars"
import { geminiChannel } from "@/inngest/channel/gemini";
import {generateText} from "ai"
import prisma from "@/lib/database";



Handlebars.registerHelper("json", (context) => {
    const stringyfied = JSON.stringify(context, null, 2)
    const safeString = new Handlebars.SafeString(stringyfied)

    return safeString
})


type GeminiData = {
    variableName?:string
    credentialId?:string
    model?:"gemini-2.0-flash" | "gemini-1.5-flash-8b" | "gemini-1.5-pro" | "gemini-1.0-pro" | "gemini-pro" ,
    systemPrompt?:string
    userPrompt?:string
}

export const geminiExecutor: NodeExector<GeminiData> = async ({ data, nodeId, context, step, publish }) => {


    await publish(
        geminiChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if(!data.variableName){
        await publish(
            geminiChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Gemini node: Variable name is missing")
    }

    if(!data.credentialId){
        await publish(
            geminiChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Gemini node: Credential is missing")
    }
    if(!data.userPrompt){
        await publish(
            geminiChannel().status({
                nodeId,
                status:"error"
            })
        )

        throw new NonRetriableError("Gemini node:User prompt is missing")
    }




    const systemPrompt = data.systemPrompt?Handlebars.compile(data.systemPrompt)(context): "You are helpful assistant"

    const userPrompt = Handlebars.compile(data.userPrompt)(context)

 const credential=await step.run("get-credential",()=>{
    return prisma.credentials.findUnique({
    where: {
        id: data.credentialId
      
    }
})
 })  

 if(!credential){
    throw new NonRetriableError("Gemini node: Credential not found")
 }


    

    const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;

    const google = createGoogleGenerativeAI({
        apiKey:credential.value
    })

    try {
        const {steps} = await step.ai.wrap("gemini-generate-text",generateText,{
            model:google("gemini-2.0-flash"),
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
            geminiChannel().status({
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
            geminiChannel().status({
                nodeId,
                status:"error"
            })
        )
        throw error
    }
}