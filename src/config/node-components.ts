import { InitialNode } from "@/components/ui/initial-node";
import { AnthropicNode } from "@/features/executions/components/anthropic/node";
import { DiscordNode } from "@/features/executions/components/discord/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { OpenAiNode } from "@/features/executions/components/open-ai/node";
import { SlackNode } from "@/features/executions/components/slack/node";
import { GoogleFormTriggerNode } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/strip-trigger/node";
import { NodeType } from "@prisma/client";
import { NodeTypes } from "@xyflow/react";



export const nodeComponents = {
    [NodeType.INITIAL]:InitialNode,
    [NodeType.HTTP_REQUEST]:HttpRequestNode,
    [NodeType.MANUAL_TRIGGER]:ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]:GoogleFormTriggerNode,
    [NodeType.STRIPE_TRIGGER]:StripeTriggerNode,
    [NodeType.GEMINNI]:GeminiNode,
    [NodeType.OPENAI]:OpenAiNode,
    [NodeType.ANTHROPIC]:AnthropicNode,
    [NodeType.DISCORD]:DiscordNode,
    [NodeType.SLACK]:SlackNode


}as const satisfies NodeTypes


export type RegisteredNodeType = keyof typeof nodeComponents