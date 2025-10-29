
import { baseProcedure, createTRPCRouter } from '../init';
import prisma from '@/lib/database';
export const appRouter = createTRPCRouter({
  getUsers: baseProcedure.query(() => {
      return  prisma.user.findMany();
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;