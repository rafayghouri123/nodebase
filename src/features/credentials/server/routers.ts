import { pagination } from "@/config/constant";
import { CredentialsType } from "@/generated/prisma/enums";
import prisma from "@/lib/database";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";

import z from "zod";


export const credentialsRouter = createTRPCRouter({
    create:premiumProcedure.input(
        z.object({
            name:z.string().min(1,"Name is required"),
            type:z.enum(CredentialsType),
            value:z.string().min(1,"Value is required")
        })
    ).mutation(({ctx,input})=>{

        const {name,type,value} = input

        return prisma.credentials.create({
            data:{
                name,
                userId:ctx.auth.user.id,
                value,
                type //Encryption
            }
        })
    }),
    remove:protectedProcedure.input(z.object({id:z.string()})).mutation(({ctx,input})=>{

        return prisma.credentials.delete({
            where:{
                id:input.id,
                userId:ctx.auth.user.id
            }
        })
    }),

    update:protectedProcedure.input(z.object({id:z.string(),
        name:z.string().min(1,"Name is requried"),
        type:z.enum(CredentialsType),
        value:z.string().min(1,"Value is required")
        })).mutation(({ctx,input})=>{

            const {id,name,type,value} = input
           return prisma.credentials.update({
            where:{id,userId:ctx.auth.user.id},
            data:{
                name,
                type,
                value
            }
           })

           
    }),

    getOne:protectedProcedure.input(z.object({id:z.string()})).query(async({ctx,input})=>{

        return prisma.credentials.findUniqueOrThrow({
            where:{
                id:input.id,
                userId:ctx.auth.user.id,
                
            },
           
        });

    }),

    getMany:protectedProcedure.input(z.object({
        page:z.number().default(pagination.DEFAULT_PAGE),
        pageSize:z.number().min(pagination.MIN_PAGE_SIZE).max(pagination.MAX_PAGE_SIZE).default(pagination.DEFAULT_PAGE_SIZE),
        search:z.string().default("")}))
        .query(async({ctx,input})=>{
            const {page,pageSize,search} = input

            const [items,totalCount] = await Promise.all([
                    prisma.credentials.findMany({
                    skip:(page-1)*pageSize,
                    take:pageSize,
                    where:{
                        userId:ctx.auth.user.id,
                        name:{
                            contains:search,
                            mode:"insensitive"
                        }
                    },
                    orderBy:{
                        updatedAt:"desc"
                    },
                    
                }),
                prisma.credentials.count({
                    where:{
                        userId:ctx.auth.user.id,
                        name:{
                            contains:search,
                            mode:"insensitive"
                        }
                    }
                })
            ])

        const totalPages = Math.ceil(totalCount/pageSize);
        const hasNextPage = page<totalPages
        const hasPreviousPage = page>1


        return{
            items,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }

    }),

    getByType:protectedProcedure.input(z.object({type:z.enum(CredentialsType)})).query(({input,ctx})=>{
        const {type} = input
       return prisma.credentials.findMany({
            where:{type,userId:ctx.auth.user.id},
            orderBy:{
                updatedAt:"desc"
            }
        })
    })
       
})