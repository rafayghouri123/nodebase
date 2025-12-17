"use client"

import { Button } from "@/components/ui/button";
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";






const formSchema = z.object({
    variableName:z.string().min(1,{message:"Variable name is required"}).regex(/^[A-za-z_$][A-Za-z0-9_$]*$/,{
        message:"Variable name must start with a letter or underscore and only contain letters,numbers, and underscores"
    }),
    systemPrompt:z.string().optional(),
    userPrompt:z.string().min(1,"User prompt is required")

})

interface Props{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    onSubmit:(values:z.infer<typeof formSchema>)=>void;
    defaultValues?:Partial<OpenAiValues>

}

export type OpenAiValues = z.infer<typeof formSchema>

export const OpenAiDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues={}

   

}:Props)=>{

    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            variableName:defaultValues.variableName||"",
            systemPrompt:defaultValues.systemPrompt||"",
            userPrompt:defaultValues.userPrompt||""
        }
    })
    //const watchMethod = form.watch("method")
    //const showBodyField = ["POST","PUT","PATCH"].includes(watchMethod)
    
    const handleSubmit = (value:z.infer<typeof formSchema>)=>{
        onSubmit(value)
        onOpenChange(false)
    }

    useEffect(()=>{
        if(open){
            form.reset({
                variableName:defaultValues.variableName|| "",
                systemPrompt:defaultValues.systemPrompt||"",
                userPrompt:defaultValues.userPrompt||""
            })
        }
    },[open,defaultValues,form])

    const watchVariableName = form.watch("variableName") || "MyOpenAi"

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>OpenAi Configuration</DialogTitle>
                    <DialogDescription>Configure the AI model and prompt for this node</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >
                          <FormField control={form.control} name="variableName" render={({field})=>(
                            <FormItem>
                                <FormLabel>Variable Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="MyOpenAi" {...field}/>
                                </FormControl>
                                <FormDescription>Use this name to reference the result in other nodes:{" "} {`{{${watchVariableName}.text}}`} </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )} />

                        
                        
                        

                   
                            <FormField control={form.control} name="systemPrompt" render={({field})=>(
                            <FormItem>
                                <FormLabel>System Prompt (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="You are a helpfull assistance" {...field} className="min-h-[80px] font-mono text-sm "/>
                                </FormControl>
                                <FormDescription>
                                    Sets behaviour of assitant. Use{"{{variables}}"} for simple values or {"{{json variable}}"}
                                </FormDescription>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="userPrompt" render={({field})=>(
                            <FormItem>
                                <FormLabel>User Prompt</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Summarize this text:{{json httpResponse.data}}" {...field} className="min-h-[120px] font-mono text-sm "/>
                                </FormControl>
                                <FormDescription>
                                    The prompt to send to the AI. Use{"{{variables}}"} for simple values or {"{{json variable}}"} to stringify the object
                                </FormDescription>
                            </FormItem>
                        )} />
                        
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}