import { workflowsRouter } from '@/features/workflows/server/routers';
import {  createTRPCRouter, protectedProcedure } from '../init';
import { credentialsRouter } from '@/features/credentials/server/routers';
import { exectionsRouter } from '@/features/executions/server/routers';



export const appRouter = createTRPCRouter({
  workflows:workflowsRouter,
  credentials:credentialsRouter,
  executions:exectionsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;