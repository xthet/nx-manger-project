import { FIND_USER } from "@/constants/subgraphQueries"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useEffect, useState } from "react"

export default function useFindUser(uVal:string) {
  const [address, setAddress] = useState<string|null>(null)

  useEffect(()=>{
    async function findUser(){
      console.log("here")
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
      userData && setAddress(userData.address)
    }
  
    uVal && findUser().catch(e=>console.log(e))
  },[uVal])

  return {
    address: address!
  }
}
