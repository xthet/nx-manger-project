import { DashboardContext } from "@/contexts/dashboard"
import { faChartSimple } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import React, { useContext } from "react"
import { DshbBacked, DshbCreated } from "../../exportConts"


export default function DashboardHeader() {
  const { activeTab, setActiveTab } = useContext(DashboardContext)!
  return (
    <div className="db-main">
      <div className="db-main-header">
        <div className="db-crt-dnt">
          <div className={`db-tab-indic ${activeTab == "Backed" ? "--next" : ""}`}></div>
          <span onClick={()=>{setActiveTab("Created")}}>{"Created"}</span>
          <span onClick={()=>{setActiveTab("Backed")}}>{"Backed"}</span>
        </div>
        <Link href={"/create-campaign"}>
          <button className="db-hdr-cta">
            <FontAwesomeIcon icon={faChartSimple} className="db-hdr-cta-icon"/>
            {"Start a campaign"}
          </button>
        </Link>

        {activeTab == "CREATED" && <DshbCreated/>}
        {activeTab == "BACKED" && <DshbBacked/>}
      </div>
    </div>
  )
}
