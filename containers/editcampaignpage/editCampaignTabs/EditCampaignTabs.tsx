import { ERewardsTab, EContentTab, ETeamTab, EBasicsTab } from "@/containers/exportConts"
import { CampaignCreatorContext } from "@/contexts/campaignCreator"
import { CampaignEditorContext } from "@/contexts/campaignEditor"
import { useRouter } from "next/router"
import { useContext } from "react"

export default function EditCampaignTabs() {
  const { activeTab, setActiveTab } = useContext(CampaignEditorContext)!
  const router = useRouter()

  return (
    <section className="cct-section sc-padding fl-tl fl-c">
      {/* <Timeline/> */}

      <>
        {activeTab === "Basics" && <EBasicsTab/>}
        {activeTab === "Team" && <ETeamTab/>}
        {activeTab === "Content" && <EContentTab/>}
        {activeTab === "Rewards" && <ERewardsTab/>}
      </>
    </section>
  )
}
