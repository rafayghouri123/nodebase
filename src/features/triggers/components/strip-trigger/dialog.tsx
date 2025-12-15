"use client"

import { Button } from "@/components/ui/button";
import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";


interface Props{
    open:boolean;
    onOpenChange:(open:boolean)=>void

}

export const StripeTriggerDialog = ({
    open,
    onOpenChange,
    
}:Props)=>{

    const params= useParams()
    console.log(params)

    const workflowId = params.worksflowId as string

    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const webhookURL =`${baseURL}/api/webhook/stripe?worksflowId=${workflowId}` 

    const copyToClipboard = async()=>{
        try{
            await navigator.clipboard.writeText(webhookURL)
            toast.success("Webhook URL copied to clipboard")
        }catch{
            toast.error("Faild to copy URL")
        }
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stripe Trigger Configuration</DialogTitle>
                    <DialogDescription>Configure this webhook URL in your Stripe Dashboard to trigger this workflow on payment event</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-4">
                        <Label htmlFor="webhook-url">Webhook URL</Label>   
                        <div className="flex gap-2">
                            <Input id="webhook-url" value={webhookURL} readOnly className="font-mono text-sm"/>
                            <Button type="button" size="icon" variant="outline" onClick={copyToClipboard}><CopyIcon className="size-4 "/></Button>
                        </div> 
                    </div>  

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Setup Instruction</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Open your Stripe Dashboard</li>
                            <li>Go to Developers → Webhooks</li>
                            <li>Click Add Endpoint</li>
                            <li>Paste the WEBHOOK_URL above</li>
                            <li>Select event to listen for (e.g.,payment_intent.succeeded)</li>
                            <li>Save and copy the signing secret</li>
                        </ol>
                    </div>       
                     
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Avaliable Variable</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                           <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.amount}}"}</code>- Payment amount</li>
                           <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.curreny}}"}</code>- Currency code</li>
                           <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.customerId}}"}</code>- Customer ID</li>
                           <li><code className="bg-background px-1 py-0.5 rounded">{"{{json stripe}}"}</code>- full event data as JSON</li>
                           <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.eventType}}"}</code>- Event type (e.g., payment_intent.succeeded)</li>
                        </ul>
                        
                    </div>
              </div>
            </DialogContent>
        </Dialog>
    )
}














