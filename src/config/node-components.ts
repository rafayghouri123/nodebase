import { InitialNode } from "@/components/ui/initial-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { GoogleFormTriggerNode } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/strip-trigger/node";
import { NodeType } from "@/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";



export const nodeComponents = {
    [NodeType.INITIAL]:InitialNode,
    [NodeType.HTTP_REQUEST]:HttpRequestNode,
    [NodeType.MANUAL_TRIGGER]:ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]:GoogleFormTriggerNode,
    [NodeType.STRIPE_TRIGGER]:StripeTriggerNode


}as const satisfies NodeTypes


export type RegisteredNodeType = keyof typeof nodeComponents