import { FIND_USER_PUBLISHED_CMPS } from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useContext, useEffect, useState } from "react"

export default function useUserCreatedCmps() {
  const { account, isAuth, uNameVal, isConnected }: conn =
    useContext(ConnectionContext)!
  const [cmps, setCmps] = useState("yo")

  async function initTable() {
    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })

    const userPubCmps = await client
      .query({
        query: FIND_USER_PUBLISHED_CMPS,
        variables: { cmpAddress: account.toLowerCase() },
      })
      .then(async (data) => {
        return data.data.campaignAddeds
      })
      .catch((err) => console.log("Error fetching data: ", err))
  }

  useEffect(() => {
    isConnected && account && initTable()
  }, [account, isAuth, isConnected])

  return {
    cmps,
  }
}
