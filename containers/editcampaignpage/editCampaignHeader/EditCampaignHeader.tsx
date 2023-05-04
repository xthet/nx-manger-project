import { CampaignCreatorContext } from "@/contexts/campaignCreator"
import { CampaignEditorContext } from "@/contexts/campaignEditor"
import { useContext } from "react"

export default function EditCampaignHeader() {
  const { activeTab, setActiveTab, ptitle } = useContext(CampaignEditorContext)!

  return (
    <section className="cch-section sc-padding fl-tl fl-c">
      <h2 className="cch-section-title">{ptitle}</h2>
      <div className="cch-nav fl-cl">
        <h3 
          className={`cch-tab-title ${activeTab == "Basics" && "cch-active-tab"}`}
          onClick={()=>{setActiveTab("Basics")}}
        >
          {"Basics"}
        </h3>
        <h3 
          className={`cch-tab-title ${activeTab == "Rewards" && "cch-active-tab"}`}
          onClick={()=>{setActiveTab("Rewards")}}
        >
          {"Rewards"}
        </h3>  
        <h3 
          className={`cch-tab-title ${activeTab == "Content" && "cch-active-tab"}`}
          onClick={()=>{setActiveTab("Content")}}
        >
          {"Content"}
        </h3>      
        <h3 
          className={`cch-tab-title ${activeTab == "Team" && "cch-active-tab"}`}
          onClick={()=>{setActiveTab("Team")}}
        >
          {"Team"}
        </h3>
      </div>
    </section>
  )
}
