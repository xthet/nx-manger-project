import {
  CreateCampaignHeader,
  CreateCampaignTabs,
} from "@/containers/exportConts"
import { CampaignCreatorProvider } from "@/contexts/campaignCreator"
import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"

export default function CreateCampaign() {
  const { isConnected, isAuth }: conn = useContext(ConnectionContext)!
  const router = useRouter()

  useEffect(() => {
    const time = setTimeout(() => {
      !isAuth && router.push("/signUp")
    }, 5000)
    return () => {
      clearTimeout(time)
    }
  }, [isConnected, isAuth])
  return (
    <>
      <Head>
        <title>{"Manger | Create Campaign"}</title>
        <meta
          name="description"
          content="Manger Project - Fundraising on the blockchain"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>

      <CampaignCreatorProvider>
        <CreateCampaignHeader />
        <CreateCampaignTabs />
      </CampaignCreatorProvider>
    </>
  )
}
