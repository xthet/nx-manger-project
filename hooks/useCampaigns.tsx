import { GET_ALL_CAMPAIGNS, GET_HOMEPAGE_CAMPAIGNS, GET_SOME_CAMPAIGNS } from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useCallback, useContext, useEffect, useState } from "react"

export function useCampaigns(id:string, offset:number){
  const { isConnected }:conn = useContext(ConnectionContext)!
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState([])

  const callHomeCampaigns = useCallback(async()=>{
    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })

    const campaigns = await client
      .query({
        query: GET_HOMEPAGE_CAMPAIGNS
      })
      .then(async data => data.data.campaignAddeds)
      .catch(error => console.log(error))

    setCampaigns(campaigns)
    campaigns && setLoading(false)
  },[]) 

  const callAllCampaigns = useCallback(async(offValue:number)=>{
    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })

    const campaigns = await client
      .query({
        query: GET_ALL_CAMPAIGNS,
        variables: { offset: offValue }
      })
      .then(async data => data.data.campaignAddeds)
      .catch(error => console.log(error))

    setCampaigns(campaigns)
    campaigns && setLoading(false)
  },[])

  const callSomeCampaigns = useCallback(async(id:string, offValue:number)=>{
    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })

    const campaigns = await client
      .query({
        query: GET_SOME_CAMPAIGNS,
        variables: { category: id, offset: offValue }
      })
      .then(async data => data.data.campaignAddeds)
      .catch(error => console.log(error))

    setCampaigns(campaigns)
    campaigns && setLoading(false)
  },[])

  useEffect(() => {
    let isIn = true 
    if(id == "home"){isIn && callHomeCampaigns()}
    else if(id == "All Categories"){isIn && callAllCampaigns(offset)}
    else{isIn && isConnected && callSomeCampaigns(id, offset)}
    return () => {isIn = false}
  }, [isConnected, callHomeCampaigns, id, offset])

  return {
    isConnected,
    loading,
    campaigns,
    callAllCampaigns,
    callSomeCampaigns
  }
}