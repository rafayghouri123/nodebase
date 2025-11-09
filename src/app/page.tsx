"use client"
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import Logout from "./logout";
import { mutationOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default  function Page() {
 const trpc  =useTRPC()
  const {data} =useQuery(trpc.getWorkflows.queryOptions())
  const queryClient = useQueryClient()
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess:()=>{
      toast.success("Job queued")
    }
  }))

  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess:()=>{
      toast.success("Ai-Job queued")
    }
  }))

  return (
    <>
      <div>
        Protected route
        {JSON.stringify(data,null,2)}
      </div>
      <Button onClick={()=>create.mutate()} disabled={create.isPending}>create worklfow</Button>
      <Button onClick={()=>testAi.mutate()} disabled={create.isPending}>testAi</Button>
      <Logout />
    </>
  );
}
