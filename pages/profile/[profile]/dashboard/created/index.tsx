import { ConnectionContext } from "@/contexts/connection"
import { DashboardProvider } from "@/contexts/dashboard"
import { conn } from "@/types"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { DashboardContext } from "@/contexts/dashboard"
import { faChartSimple } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { cutStr } from "@/utils/cutStr"
import { CrtdCampaigns } from "@/containers/exportConts"

export default function Dashboard() {
  const { isConnected, account, connect, isAuth, uNameVal }:conn = useContext(ConnectionContext)!
  const { activeTab, setActiveTab } = useContext(DashboardContext)!
  const router = useRouter()
  const profile = router.asPath.split("/")[2]

  return (
    <>
      <Head>
        <title>{"Manger | Dashboard"}</title>
        <meta name="description" content="Manger Project - Fundraising on the blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>
      <DashboardProvider owner={profile}>
        <div className="db">
          <aside className="db-side">
            <h3 className="db-sec-title">{"Dashboard"}</h3>
            <div className="db-menu">
              <span>{"Drafts"}</span>
              <Link href={`/settings/${account}`}><span>{"Account Settings"}</span></Link>
              <Link href={`/profile/${uNameVal}/dashboard/created`}><span>{"Campaigns Created"}</span></Link>
              <span>{"Campaigns Backed"}</span>
            </div>
            <Link href={`/profile/${uNameVal}`} className="db-user">
              <div className="db-user">
                <img src="/re3.jpg" alt="--" className="db-pfp"/>
                <span>{cutStr(uNameVal, 14)}</span>
              </div>
            </Link>
          </aside>
          <main className="db-main">
            {/* <div className="db-main-header">
              <div className="db-crt-dnt">
                <div className={`db-tab-indic ${activeTab == "BACKED" ? "--next" : ""}`}></div>
                <span onClick={()=>{setActiveTab("CREATED")}}>{"Created"}</span>
                <span onClick={()=>{setActiveTab("BACKED")}}>{"Backed"}</span>
              </div>
              <Link href={"/create-campaign"}>
                <button className="db-hdr-cta">
                  <FontAwesomeIcon icon={faChartSimple} className="db-hdr-cta-icon"/>
                  {"Start a campaign"}
                </button>
              </Link>
            </div> */}
            <CrtdCampaigns/>
          </main>
        </div>
      </DashboardProvider>
    </>
  )
}
