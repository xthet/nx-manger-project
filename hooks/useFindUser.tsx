import { FIND_USER } from "@/constants/subgraphQueries"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useEffect, useState } from "react"

export default function useFindUser(uVal:string) {
  useState()

  useEffect(()=>{
    async function findUser(){
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
        cache: new InMemoryCache(),
      })
      
      const userData = await client
        .query({
          query: FIND_USER,
          variables: { name: uVal }
        })
        .then(async (data) => {console.log(data); return data.data.userAddeds})
        .catch(err => console.log("Error fetching data: ", err))

    }
  
    uVal && findUser().catch(e=>console.log(e))
  },[uVal])

  return (
    <div>useFindUser</div>
  )
}
