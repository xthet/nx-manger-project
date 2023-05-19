import { basicCmpObj, fcmp } from "@/types"
import { BigNumber } from "ethers"
import { createContext, ReactNode, useEffect, useState } from "react"

interface cec {
  activeTab: string
  setActiveTab: Function
  updateGrandCmp: Function
  // setBasicCmp: Function
  setNewCampaignAddr: Function
  newCampaignAddr:string
  grandCmp:fcmp
  grandURI:string
  setGrandURI:Function
}

const CampaignCreatorContext = createContext<cec|null>(null)

const initFullCmp:fcmp = {
  campaign: "",
  creator: "",
  website:"",
  twitter: "",
  email: "",
  title: "",
  tagline: "",
  category: "",
  tags: [],
  bio: "",
  location: "",
  duration: BigNumber.from("0"),
  goalAmount: BigNumber.from("0"),
  imageURI: "",
  visualURI: "",
  faqs: [],
  risks: "",
  rewards: false,
  creators: [],
  story: ""
}

function CampaignCreatorProvider ({ children }:{children:ReactNode}) {
  const [activeTab, setActiveTab] = useState("Basics")
  const [grandCmp, setGrandCmp] = useState<fcmp>(initFullCmp)
  const [grandURI, setGrandURI] = useState("")
  // const [basicCmp, setBasicCmp] = useState<basicCmpObj>()
  const [newCampaignAddr, setNewCampaignAddr] = useState("")


  function updateGrandCmp(obj:Object){
    setGrandCmp(prev=>({ ...prev, ...obj }))
  }

  useEffect(()=>{
    const grandRec = localStorage.getItem("grandCmp")
    if(grandRec){
      const grandObj:fcmp = JSON.parse(grandRec)
      updateGrandCmp(grandObj)
    }
    const tabRec = localStorage.getItem("currTab")
    if(tabRec){
      const nTab = JSON.parse(tabRec)
      setActiveTab(nTab.currTab)
    }else{
      setActiveTab("Basics")
    }
  },[])

  useEffect(()=>{
    (activeTab !== "Basics") && newCampaignAddr && localStorage.setItem("currTab", JSON.stringify({ currTab: activeTab }))
  },[activeTab])

  return (
    <CampaignCreatorContext.Provider value={{ activeTab, setActiveTab, updateGrandCmp, setNewCampaignAddr, newCampaignAddr, grandCmp, grandURI, setGrandURI }}>
      {children}
    </CampaignCreatorContext.Provider>
  )
}

export { CampaignCreatorContext, CampaignCreatorProvider }