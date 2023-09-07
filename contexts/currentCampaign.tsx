import { useCdata } from "@/hooks/useCdata"
import { createContext, ReactNode, useState } from "react"

interface props{
  children: ReactNode
  address: string
}

interface currCampaign{
  currAddress: string
  currState: number
}

const CampaignContext = createContext<currCampaign | null>(null)

function CampaignProvider ({ children, address }:props){
  // const [currAddress, setCurrAddress] = useState(address)
  const {    
    loading,
    campaignDetails,
    imageURI,
    imgLoad,
    setImgLoad,
    progress,
    daysUntil,
    deadlineStatement
  } = useCdata(address)

  return (
    <CampaignContext.Provider value={{ currAddress: address, currState: campaignDetails.state }}>
      {children}
    </CampaignContext.Provider>
  )
}

export { CampaignContext, CampaignProvider }