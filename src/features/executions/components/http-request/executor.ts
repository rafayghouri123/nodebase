import type { NodeExector } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as KyOption} from "ky"

type HttpRequestData = {
    variableName?:string
    endpoint?:string
    method?:"GET"|"POST"|"PATCH"|"PUT"|"DELETE"
    body?:string
}

export const httpRequestExecutor:NodeExector<HttpRequestData>=async({data,nodeId,context,step})=>{


    if(!data.endpoint){
        throw new NonRetriableError("HTTP Request node: no endpoint configured")
    }
    if(!data.variableName){
        throw new NonRetriableError(" No variableName configured")
    }

    const result = await step.run("http-request",async()=>{
        const endpoint = data.endpoint!;
        const method = data.method||"GET"
        const options:KyOption = {method}

        if(["POST","PUT","PATCH"].includes(method)){
           
                options.body = data.body
                options.headers={
                    "Content-Type":"application/json"
                }

        }

                const response = await ky(endpoint,options);
                const contentType= response.headers.get("content-type")
                const responseData = contentType?.includes("application/json")? await response.json():await response.text()
                
                const responsePayload = {
                    httpResponse:{
                        status:response.status,
                        statusText:response.statusText,
                        data:responseData
                    }
                }
          

            if(data.variableName){
                return {
                    ...context,
                    [data.variableName]:responsePayload
                    
                }
            }

            return{
                ...context,
                ...responsePayload
            }
        

    })



    return result

}