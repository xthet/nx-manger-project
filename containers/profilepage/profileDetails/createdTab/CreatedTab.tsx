import { CampaignGrid } from "@/components/exportComps"
import { ProfileContext } from "@/contexts/currentProfile"
import useProfile from "@/hooks/useProfile"
import Error from "next/error"
import React, { useContext, useEffect, useState } from "react"
import ReactLoading from "react-loading"

export default function CreatedTab() {
  const { currProfile, activeTab, setActiveTab, isOwnPage } = useContext(ProfileContext)!
  const { campaigns, cldng } = useProfile("Created", currProfile)
  const [offset, setOffset] = useState(10)

  return (
    <section className="ctb-tab">
      {
        cldng ? <ReactLoading type={"bubbles"} color="#827B93"/> : !(campaigns.length > 0) ? <p className="ctb-notice">{"No campaigns created"}</p>
          : <CampaignGrid mapArray={campaigns.slice(0,offset)}/>
      }

      <button onClick={()=>{setOffset(prev=>prev + 10)}}
        className="ctb-see-more" style={!(campaigns && campaigns.length > 0) ? { "display":"none" } : {}}>
        {"See more"}
      </button>
    </section>
  )
}
