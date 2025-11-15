import { pagination } from "@/config/constant";
import { useEffect, useState } from "react";



interface UseEntitySearchProps<T extends {search:string ;page:number}>{
    params:T
    setParams:(params:T)=>void
    debounceMs?:number
}


export function useEntitySearch<T extends {
    search:string,
    page:number
}>({ params,setParams,debounceMs=500}:UseEntitySearchProps<T>){

    const [localSearch,setLocalSearch] = useState(params.search)

    useEffect(()=>{
        if(localSearch===""&&params.search!==""){
            setParams({
                ...params,
                search:"",
                page:pagination.DEFAULT_PAGE
            })
            return
        }

        const timer = setTimeout(()=>{
            if(localSearch!==params.search){
                setParams({
                    ...params,
                    search:localSearch,
                    page:pagination.DEFAULT_PAGE
                })
            }
        },debounceMs)

        return()=>clearTimeout(timer)
    },[localSearch,params,setParams,debounceMs])


    useEffect(()=>{
        setLocalSearch(params.search)

    },[params.search])

    return{
        searchValue:localSearch,
        onSearchChange:setLocalSearch
    }
}
