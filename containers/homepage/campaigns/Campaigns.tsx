import { CampaignGrid, CategoryFilter } from "@/components/exportComps"
import { GET_HOMEPAGE_CAMPAIGNS } from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { useCampaigns } from "@/hooks/useCampaigns"
import { conn } from "@/types"
import { ApolloClient, InMemoryCache, useQuery } from "@apollo/client"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import ReactLoading from "react-loading"

export default function Campaigns() {
  const { isConnected, loading, campaigns } = useCampaigns("home", 0)

  return (
    <section className="cp-campaigns sc-padding fl-cl fl-c">
      <CategoryFilter changeCat={()=>{}}/>
      {
        !isConnected && !campaigns
          ? <div className="cp-load-alert fl-cl fl-c">
            <p>{"Please connect your wallet to view campaigns"}</p> 
            <ReactLoading type={"bubbles"} color="#827B93"/>
          </div>
          : loading ? <ReactLoading type={"bubbles"} color="#827B93"/> 
            : !campaigns || !(campaigns.length > 0) 
              ? <p className="pg-notice">{"There are currently no campaigns in manger"}</p> 
              : <CampaignGrid mapArray={campaigns}/>
      }
      <Link href={"/campaigns"}><button className="cg-see-more fl-cc">{"See more"}</button></Link>
    </section>  
  )
}
