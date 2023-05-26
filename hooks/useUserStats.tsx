import { FIND_BACKER_COUNT, FIND_CREATORS_SUPP_COUNT, GET_USER_DETAILS } from "@/constants/subgraphQueries"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"

export default function useUserStats(addr:string) {
  const [backersSum, setBackersSum] = useState("--")
  const [creatorsSuppSum, setCreatorsSuppSum] = useState("--")
  const [totalRaisedSum, setTotalRaisedSum] = useState("--")
  const [cCampaignsSum, setCCampaignsSum] = useState("--")
  const [totalDonatedSum, setTotalDonatedSum] = useState("--")
  const [bCampaignsSum, setBCampaignsSum] = useState("--")

  async function findStats(){
    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })
    
    const userData = await client
      .query({
        query: GET_USER_DETAILS,
        variables: { userAddress: addr.toLowerCase() }
      })
      .then(async (data) => {return data.data.userAdded})
      .catch(err => console.log("Error fetching data: ", err))

    setTotalRaisedSum(ethers.utils.formatEther(BigNumber.from(userData.totalRaised)))
    setCCampaignsSum(userData.publishedCount)
    setTotalDonatedSum(ethers.utils.formatEther(BigNumber.from(userData.totalDonated)))
    setBCampaignsSum(userData.backedCount)

    const userBackers = await client
      .query({
        query: FIND_BACKER_COUNT,
        variables: { addresses: userData.created }
      })
      .then((data) => {return data.data.campaignAddeds})
      .catch(err => console.log("Error fetching data: ", err))
    
    let counts:number[] = []
    for (var cmp of userBackers){
      counts.push(~~(cmp.funderCount))
    }
    const backers = counts.reduce((pSum, a)=>pSum + a,0)
    setBackersSum(backers.toString()) 

    const userCreatorsSupp = await client
      .query({
        query: FIND_CREATORS_SUPP_COUNT,
        variables: { addresses: userData.backed }
      })
      .then((data) => {return data.data.campaignAddeds})
      .catch(err => console.log("Error fetching data: ", err))

    let cSupp:string[] = []
    for (var cmp of userCreatorsSupp){
      counts.push(cmp.creator.id)
    }
    const uniqueCSupp = [...new Set(cSupp)]
    setCreatorsSuppSum(uniqueCSupp.length.toString())

    let reciFunders:string[] = []
    if(userBackers.length > 0){
      for (var cmp of userBackers){
        reciFunders = [...reciFunders, ...cmp.funders]
        if(reciFunders.length >= 3){
          break
        }
      }
    }

    
  }

  useEffect(()=>{
    addr && findStats().catch(e=>console.log(e))
  },[addr])
  return {
    backersSum,
    totalRaisedSum,
    cCampaignsSum,
    totalDonatedSum,
    bCampaignsSum,
    creatorsSuppSum
  }
}
