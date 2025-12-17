import { NodeType } from "@/generated/prisma/enums";
import { unknown } from "zod";
import { NodeExector } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { HttpRequestNode } from "../components/http-request/node";
import { httpRequestExecutor } from "../components/http-request/executor";
import { GoogleFormExecutorTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { StripeExecutorTriggerExecutor } from "@/features/triggers/components/strip-trigger/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { OpenAiNode } from "../components/open-ai/node";
import { OpenAiExecutor } from "../components/open-ai/executor";
import { AnthropicExecutor } from "../components/anthropic/executor";


export const executeRegistry :Record<NodeType,NodeExector> ={
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.INITIAL]:manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]:httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]:GoogleFormExecutorTriggerExecutor,
    [NodeType.STRIPE_TRIGGER]:StripeExecutorTriggerExecutor,
    [NodeType.GEMINNI]:geminiExecutor,
    [NodeType.OPENAI]:OpenAiExecutor,
    [NodeType.ANTHROPIC]:AnthropicExecutor
    

}

export const getExecutor=(type:NodeType):NodeExector=>{
    const executor = executeRegistry[type]
    if(!executor){
        throw new Error(`No executor found for this node type: ${type}`)
    }

    return executor
}