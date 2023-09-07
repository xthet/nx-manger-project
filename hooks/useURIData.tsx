import { ethers } from "ethers"
import { useCallback, useContext, useEffect, useState } from "react"
import campaignABI from "@/constants/abis/Campaign.json"
import { conn, fcmp, faq } from "@/types"
import { ConnectionContext } from "@/contexts/connection"
import DOMPurify from "dompurify"

export function useURIData(address:string){
  const { isConnected, defSigner }:conn = useContext(ConnectionContext)!
  const [cdata, setCdata] = useState<fcmp>()
  const [fcLoading, setFcLoading] = useState(true)
  const [visLoaded, setVisLoaded] = useState(false)
  const [visURI, setVisURI] = useState("")
  const [cStory, setCStory] = useState({ __html: "" })
  const [cRisks, setCRisks] = useState({ __html: "" })
  const [cFaqs, setCFaqs] = useState<faq[]>([])

  
  const start = useCallback(async () => {
    const cmpCntrt = new ethers.Contract(address, campaignABI.abi, defSigner!)
    let cmpd
    try{
      const uri = await cmpCntrt.s_campaignURI()
      const httpUri = uri.replace("ipfs://", "https://ipfs.io/ipfs/")
      cmpd = await fetch(httpUri).then(res => res.json()).then(data => data).catch(e=>console.log(e))
      if(cdata !== cmpd){
        setCdata(cmpd)
        setFcLoading(false)
        setVisURI(cmpd.httpVisualURI)
      }

      const story = { __html: DOMPurify.sanitize(cmpd.story) }
      cStory !== story && setCStory(story)

      if(cmpd.risks){
        const risks = { __html: DOMPurify.sanitize(cmpd.risks) }
        cRisks !== risks && setCRisks(risks)
      }

      if(cmpd.faqs.length){
        setCFaqs(cmpd.faqs)
      }
    }catch(e){console.log(e)}
  },[isConnected, address, defSigner])

  
  useEffect(()=>{
    let isIn = true
    isIn && defSigner && start().catch(e=>console.log(e))
    return () => {isIn = false}
  },[isConnected, start])

  return {
    fcLoading,
    cdata,
    visURI,
    visLoaded,
    setVisLoaded,
    cStory,
    cRisks,
    cFaqs
  }
}