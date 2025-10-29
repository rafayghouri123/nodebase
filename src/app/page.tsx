
import prisma from "@/lib/database";
import { getQueryClient, trpc } from "@/trpc/server";
import { caller } from "@/trpc/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Client from "./Client";

export default async function  Page() {

  const queryClient =getQueryClient()

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions())

  return (
    <div>
      <h1 className="text-red-500">Welcome home</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Client/>
      </HydrationBoundary>
      
    </div>
  );
}
