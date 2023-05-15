import { ConnectionContext } from "@/contexts/connection"
import { DashboardContext } from "@/contexts/dashboard"
import { conn } from "@/types"
import { faChartSimple } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useContext } from "react"
import { DshbBacked, DshbCreated } from "../exportConts"
import { cutStr } from "@/utils/cutStr"

export default function Dshbrd() {
  const { account, isAuth, uNameVal }:conn = useContext(ConnectionContext)!
  const { activeTab, setActiveTab } = useContext(DashboardContext)!

  return (
    <div className="db">
      <aside className="db-side">
        <Link href={`/profile/${uNameVal}/dashboard`}>
          <h3 className="db-sec-title">{"Dashboard"}</h3>
        </Link>
        <div className="db-menu">
          <span>{"Drafts"}</span>
          <Link href={`/settings/${account}`}><span>{"Account Settings"}</span></Link>
          <Link href={`/profile/${uNameVal}/dashboard/created`}><span>{"Campaigns Created"}</span></Link>
          <Link href={`/profile/${uNameVal}/dashboard/backed`}><span>{"Campaigns Backed"}</span></Link>
        </div>
        <Link href={`/profile/${uNameVal}`} className="db-user">
          <div className="db-user">
            <img src="/re3.jpg" alt="--" className="db-pfp"/>
            <span>{cutStr(uNameVal, 14)}</span>
          </div>
        </Link>
      </aside>
      <main className="db-main">
        <div className="db-main-header">
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
        </div>
        {activeTab == "CREATED" && <DshbCreated/>}
        {activeTab == "BACKED" && <DshbBacked/>}
      </main>
    </div>
  )
}
