import { CmpObject, conn } from "@/types"
import { ethers } from "ethers"
import { useContext, useEffect, useState } from "react"
import campaignABI from "../constants/abis/Campaign.json"
import { ConnectionContext } from "@/contexts/connection"

export default function useFirstFundable(campaigns:CmpObject[]) {
  const { isConnected, connect, account, uNameVal, defSigner }:conn = useContext(ConnectionContext)!
  const [address, setAddress] = useState<string|null>(null)

  async function findCmp(){
    for (var cmpg of campaigns){
      const cmpCt = new ethers.Contract(cmpg.campaignAddress, campaignABI.abi, defSigner!)
      const state = await cmpCt.c_state()
      if(state == 0){
        setAddress(cmpg.campaignAddress)
        return
      }
    }
  }

  useEffect(()=>{
    campaigns && findCmp().catch(e=>console.log(e))
  },[campaigns])

  return {
    address:address!
  }
}
