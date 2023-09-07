import { ActiveCampaign, CampaignDetails } from "@/containers/exportConts"
import { CampaignProvider } from "@/contexts/currentCampaign"
import Error from "next/error"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import ReactLoading from "react-loading"


export default function Campaign() {
  const router = useRouter()
  const { campaign } = router.query
  const [isFund, setIsFund] = useState(false)
  const [title, setTitle] = useState("")

  return (
    <>
      <Head>
        <title>{`Manger | ${title}`}</title>
        <meta name="description" content="Manger Project - Fundraising on the blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>
      {
        !campaign 
          ? <ReactLoading type="bubbles" color="#827B93"/> 
          : typeof(campaign) == "string" && campaign.includes("0x") && campaign.length == 42 
            ? <>
              <CampaignProvider address={campaign}>
                <ActiveCampaign click={()=>{setIsFund(true)}} setPTitle={setTitle}/>
                <CampaignDetails onFund={isFund} resetter={()=>{setIsFund(false)}}/>
              </CampaignProvider>
            </>
            : <Error statusCode={404}/>
      }
    </>
  )
}
