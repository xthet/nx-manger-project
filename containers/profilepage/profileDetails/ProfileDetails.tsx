import { CampaignGrid } from "@/components/exportComps"
import { ProfileContext } from "@/contexts/currentProfile"
import { useContext, useEffect, useState } from "react"
import { BackedTab, CreatedTab } from "@/containers/exportConts"


export default function ProfileDetails() {
  const { currProfile, activeTab, setActiveTab, isOwnPage } = useContext(ProfileContext)!

  return (
    <section className="crd-section sc-padding fl-cl fl-c">
      <>
        {activeTab === "CREATED" && <CreatedTab/>}
        {activeTab === "BACKED" && <BackedTab/>}
      </>
    </section>
  )
}
