import { pagination } from "@/config/constant";
import { CredentialsType } from "@prisma/client"
import prisma from "@/lib/database";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";

import z from "zod";


export const exectionsRouter = createTRPCRouter({

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return prisma.execution.findFirstOrThrow({
                where: {
                    id: input.id,
                    workflow: {
                        userId: ctx.auth.user.id,
                    },
                },
                include: {
                    workflow: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        }),


    getMany: protectedProcedure.input(z.object({
        page: z.number().default(pagination.DEFAULT_PAGE),
        pageSize: z.number().min(pagination.MIN_PAGE_SIZE).max(pagination.MAX_PAGE_SIZE).default(pagination.DEFAULT_PAGE_SIZE),
        search: z.string().default("")
    }))
        .query(async ({ ctx, input }) => {
            const { page, pageSize } = input

            const [items, totalCount] = await Promise.all([
                prisma.execution.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    where: {
                        workflow: { userId: ctx.auth.user.id },

                    },
                    orderBy: {
                        startedAt: "desc"
                    },
                    include: {
                        workflow: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }

                }),
                prisma.execution.count({
                    where: {
                        workflow: { userId: ctx.auth.user.id },
                    },
                }),
            ])

            const totalPages = Math.ceil(totalCount / pageSize);
            const hasNextPage = page < totalPages
            const hasPreviousPage = page > 1


            return {
                items,
                page,
                pageSize,
                totalCount,
                totalPages,
                hasNextPage,
                hasPreviousPage
            }

        }),

})