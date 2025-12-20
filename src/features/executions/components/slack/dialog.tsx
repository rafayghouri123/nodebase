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
   content:z.string().min(1,"Message content is required"),
   webhookUrl:z.string().min(1,"Webhook URL is required")

})

interface Props{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    onSubmit:(values:z.infer<typeof formSchema>)=>void;
    defaultValues?:Partial<SlackValues>

}

export type SlackValues = z.infer<typeof formSchema>

export const SlackDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues={}

   

}:Props)=>{

   
        
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            variableName:defaultValues.variableName||"",
            content:defaultValues.content|| "",
           webhookUrl:defaultValues.webhookUrl||""
        }
    })
    
    const handleSubmit = (value:z.infer<typeof formSchema>)=>{
        onSubmit(value)
        onOpenChange(false)
    }

    useEffect(()=>{
        if(open){
            form.reset({
                variableName:defaultValues.variableName||"",
                content:defaultValues.content|| "",
                webhookUrl:defaultValues.webhookUrl||""
            })
        }
    },[open,defaultValues,form])

    const watchVariableName = form.watch("variableName") || "mySlack"

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Slack Configuration</DialogTitle>
                    <DialogDescription>Configure the Slack webhook setting for this node</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >
                          <FormField control={form.control} name="variableName" render={({field})=>(
                            <FormItem>
                                <FormLabel>Variable Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="mySlack" {...field}/>
                                </FormControl>
                                <FormDescription>Use this name to reference the result in other nodes:{" "} {`{{${watchVariableName}.text}}`} </FormDescription>
                                <FormMessage/>
                                
                            </FormItem>
                        )} />

                        
                        <FormField control={form.control} name="webhookUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Webhook URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://hooks.slack.com/services/..." {...field}/>
                                    </FormControl>
                                    <FormControl>
                                        <FormDescription>
                                            Get this from Slck: Workspace Settings → Workflow → Webhooks
                                        </FormDescription>
                                    </FormControl>
                                    <FormControl>
                                        <FormDescription>
                                            Make sure you have "content" variable
                                        </FormDescription>
                                    </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        

                   
                            <FormField control={form.control} name="content" render={({field})=>(
                            <FormItem>
                                <FormLabel>Message Content</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Summary: {{aiResponse}}" {...field} className="min-h-[80px] font-mono text-sm "/>
                                </FormControl>
                                <FormDescription>
                                   The message to send. Use{"{{variables}}"} for simple values or {"{{json variable}}"} to stringyfy the objects
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