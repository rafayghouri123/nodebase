import type { NodeExector } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as KyOption} from "ky"
import Handlebars from "handlebars"


Handlebars.registerHelper("json",(context)=>{
    const stringyfied=JSON.stringify(context,null,2)
    const safeString = new Handlebars.SafeString(stringyfied)

    return safeString
})


type HttpRequestData = {
    variableName:string
    endpoint:string
    method:"GET"|"POST"|"PATCH"|"PUT"|"DELETE"
    body?:string
}

export const httpRequestExecutor:NodeExector<HttpRequestData>=async({data,nodeId,context,step})=>{


    if(!data.endpoint){
        throw new NonRetriableError("HTTP Request node: no endpoint configured")
    }
    if(!data.variableName){
        throw new NonRetriableError(" No variableName configured")
    }

    if(!data.method){
        throw new NonRetriableError(" No method configured")
    }

    const result = await step.run("http-request",async()=>{
        const endpoint =Handlebars.compile(data.endpoint)(context);
        console.log("ENDPOINT :"  +endpoint)
        const method = data.method
        const options:KyOption = {method}

        if(["POST","PUT","PATCH"].includes(method)){
                const resolved = Handlebars.compile(data.body||"{}")(context)
                JSON.parse(resolved)
                options.body = resolved
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
          

           
                return {
                    ...context,
                    [data.variableName]:responsePayload
                    
                }
        

          
        

    })



    return result

}