import { EditCampaignHeader, EditCampaignTabs } from "@/containers/exportConts"
import { CampaignCreatorProvider } from "@/contexts/campaignCreator"
import { CampaignEditorProvider } from "@/contexts/campaignEditor"
import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import Error from "next/error"
import Head from "next/head"
import { useRouter } from "next/router"
import Script from "next/script"
import ReactLoading from "react-loading"
import { useContext, useEffect, useState } from "react"

export default function EditableCampaign() {
  const { isConnected, connect, account, signer, isAuth }:conn = useContext(ConnectionContext)!
  const router = useRouter()
  const { campaign } = router.query
  const [isCreator, setIsCreator] = useState(false)

  function validate(){
    setIsCreator(true)
  }

  return (
    <>
      <Head>
        <title>{"Manger | Edit Campaign"}</title>
        <meta name="description" content="Manger Project - Fundraising on the blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>

      {
        !campaign 
          ? <ReactLoading type="bubbles" color="#827B93"/> 
          : typeof(campaign) == "string" && campaign.includes("0x") && campaign.length == 42 
            ? <>
              <CampaignEditorProvider cmpAddress={campaign} validator={()=>{validate()}}>
                { isCreator ?
                  <>
                    <EditCampaignHeader/>
                    <EditCampaignTabs/> 
                  </> : <ReactLoading type="bubbles" color="#827B93"/>
                }
              </CampaignEditorProvider>
            </>
            : <Error statusCode={404}/>
      }
    </>
  )
}
