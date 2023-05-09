import { createContext, ReactNode, useState } from "react"

interface props{
  children: ReactNode
  address: string
}

interface currCampaign{
  currAddress: string
}

const CampaignContext = createContext<currCampaign | null>(null)

function CampaignProvider ({ children, address }:props){
  // const [currAddress, setCurrAddress] = useState(address)

  return (
    <CampaignContext.Provider value={{ currAddress: address }}>
      {children}
    </CampaignContext.Provider>
  )
}

export { CampaignContext, CampaignProvider }