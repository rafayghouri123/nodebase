import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request:NextRequest){
    try{
        const url = new URL(request.url)
        const workflowId = url.searchParams.get("worksflowId")

        if(!workflowId){
            console.log("workflow id not found")
            return NextResponse.json({success:false ,error:"Missing required query parameter: WorkflowId"},{status:400})
        }

      const body=await request.json()
      const formData={
        formId:body.formId,
        formTitle:body.formTitle,
        responseId:body.responseId,
        timestamp:body.timestamp,
        respondentEmail:body.respondentEmail,
        responses:body.responses,
        raw:body.raw,
      }

      await sendWorkflowExecution({
        workflowId,
        initialData:{
            googleForm:formData
        }
      })
    }catch(error){
        console.error("Google form webhook error:",error)
        return NextResponse.json({success:false ,error:"Failed to process Google Form submission"},{status:500})
    }
}