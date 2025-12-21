import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/database";
import { topoLogicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channel/http-request";
import { manualTriggerChannel } from "./channel/manual-trigger";
import { googleFormTriggerChannel } from "./channel/google-form-trigger";
import { stripeTriggerChannel } from "./channel/stripe-trigger";
import { geminiChannel } from "./channel/gemini";
import { openaiChannel } from "./channel/openai";
import { anthropicChannel } from "./channel/anthropic";
import { discordChannel } from "./channel/discord";
import { slackChannel } from "./channel/slack";




export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow",retries:process.env.NODE_ENV==="production"?3:0,
    onFailure:async({event,step})=>{
      return prisma.execution.update({
        where:{
          inngestEventId:event.data.event.id
        },
        data:{
          status:ExecutionStatus.FAILED,
          error:event.data.error.message,
          errorStack:event.data.error.stack
        }
      })
    }
  },
  { event: "workflows/execute.workflow" , channels:[httpRequestChannel(),manualTriggerChannel(),googleFormTriggerChannel(),stripeTriggerChannel(),geminiChannel(),openaiChannel(),anthropicChannel(),discordChannel(),slackChannel()]},
 async({event,step,publish})=>{
  const inngestEventId = event.id
  const workflowId =event.data.workflowId

  if(!workflowId || !inngestEventId){
    throw new NonRetriableError("Event ID or Workflow ID is missing")
  }

  await step.run("create-execution",async()=>{
    return prisma.execution.create({
      data:{
        workflowId,
        inngestEventId,
      }
    })
  })

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

    const userId = await step.run("finduser-id",async()=>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where:{
          id:workflowId
        },
        select:{
          userId:true
        }
      })

      return workflow.userId
    })

    let context = event.data.initialData||{}
    
    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType)
      context = await executor({
        data:node.data as Record<string,unknown>,
        nodeId:node.id,
        userId,
        context,
        step,
        publish
      })
    }

    await step.run("update-execution",async ()=>{
      return prisma.execution.update({
        where:{
          inngestEventId,
          workflowId
        },
        data:{
          status:ExecutionStatus.SUCCESS,
          completedAt:new Date(),
          output:context

        }
      })
    })

    return {workflowId,result:context}
 }
);