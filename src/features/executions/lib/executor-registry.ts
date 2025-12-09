import { NodeType } from "@/generated/prisma/enums";
import { unknown } from "zod";
import { NodeExector } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { HttpRequestNode } from "../components/http-request/node";
import { httpRequestExecutor } from "../components/http-request/executor";


export const executeRegistry :Record<NodeType,NodeExector> ={
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.INITIAL]:manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]:httpRequestExecutor
    

}

export const getExecutor=(type:NodeType):NodeExector=>{
    const executor = executeRegistry[type]
    if(!executor){
        throw new Error(`No executor found for this node type: ${type}`)
    }

    return executor
}