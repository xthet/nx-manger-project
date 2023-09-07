import { GET_USER_DETAILS } from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { auth, conn, udata, usr } from "@/types"
import { truncateStr } from "@/utils/truncateStr"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"

export function useQUData(user:string){
  const { isConnected, account, isAuth }:conn = useContext(ConnectionContext)!
  const [uLoading, setULoading] = useState(true)
  const [uNameVal, setUNameVal] = useState("")
  const [uData, setUData] = useState<udata | null>(null)
  const router = useRouter()

  useEffect(()=>{
    let isIn = true
    async function getUserDetails(){
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
        cache: new InMemoryCache(),
      })
      
      const userData:udata = await client
        .query({
          query: GET_USER_DETAILS,
          variables: { userAddress: user.toLowerCase() }
        })
        .then(async (data) => {return data.data.userAdded})
        .catch(err => console.log("Error fetching data: ", err))
      setUData(userData)
      isIn && setUNameVal(!userData || !userData.username ? truncateStr(user, 10) : userData.username)
      isIn && setULoading(false)
    }
    isIn && getUserDetails().catch(e=>console.log(e))
    return () => {isIn = false}
  },[isConnected, user, account, isAuth, router.asPath])

  return (
    {
      uData,
      uNameVal,
      uLoading,
    }
  )
}
