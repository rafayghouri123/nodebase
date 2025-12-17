import test from "node:test";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/database";
import { topoLogicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channel/http-request";
import { manualTriggerChannel } from "./channel/manual-trigger";
import { googleFormTriggerChannel } from "./channel/google-form-trigger";
import { stripeTriggerChannel } from "./channel/stripe-trigger";
import { geminiChannel } from "./channel/gemini";
import { openaiChannel } from "./channel/openai";
import { anthropicChannel } from "./channel/anthropic";




export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" , channels:[httpRequestChannel(),manualTriggerChannel(),googleFormTriggerChannel(),stripeTriggerChannel(),geminiChannel(),openaiChannel(),anthropicChannel()]},
 async({event,step,publish})=>{

  const workflowId =event.data.workflowId

  if(!workflowId){
    throw new NonRetriableError("Workflow ID is missing")
  }

    const sortedNodes=  await step.run("prepare-workflow",async()=>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where:{
          id:workflowId
        },
        include:{
          nodes:true,
          connections:true
        }
      })

      return topoLogicalSort( workflow.nodes,workflow.connections)    
    })

    let context = event.data.initialData||{}
    
    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType)
      context = await executor({
        data:node.data as Record<string,unknown>,
        nodeId:node.id,
        context,
        step,
        publish
      })
    }


    return {workflowId,result:context}
 }
);