import { DashboardHeader, DashboardTabs, Dshbrd } from "@/containers/exportConts"
import { ConnectionContext } from "@/contexts/connection"
import { DashboardProvider } from "@/contexts/dashboard"
import { conn } from "@/types"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { faAngleLeft, faAngleRight, faChartSimple, faCircleInfo, faPencil, faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"

export default function Dashboard() {
  const { isConnected, account, connect, isAuth, uNameVal }:conn = useContext(ConnectionContext)!
  const router = useRouter()
  const profile = router.asPath.split("/")[2]
  const [activeTab, setActiveTab] = useState("Created")

  return (
    <>
      <Head>
        <title>{"Manger | Dashboard"}</title>
        <meta name="description" content="Manger Project - Fundraising on the blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>
      <DashboardProvider owner={profile}>
        <Dshbrd/>
      </DashboardProvider>
    </>
  )
}
