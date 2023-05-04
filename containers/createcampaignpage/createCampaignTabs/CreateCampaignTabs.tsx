import { RewardsTab, BasicsTab, ContentTab, ProfileTab, TeamTab } from "@/containers/exportConts"
import { CampaignCreatorContext } from "@/contexts/campaignCreator"
import { useRouter } from "next/router"
import { useContext } from "react"

export default function CreateCampaignTabs() {
  const { activeTab, setActiveTab } = useContext(CampaignCreatorContext)!
  const router = useRouter()

  return (
    <section className="cct-section sc-padding fl-tl fl-c">
      {/* <Timeline/> */}

      <>
        {activeTab === "Basics" && <BasicsTab/>}
        {activeTab === "Team" && <TeamTab/>}
        {activeTab === "Content" && <ContentTab/>}
        {activeTab === "Rewards" && <RewardsTab/>}
      </>
    </section>
  )
}
