import { CampaignContext } from "@/contexts/currentCampaign"
import { useURIData } from "@/hooks/useURIData"
import { useContext } from "react"
import ReactLoading from "react-loading"

export default function RisksTab() {
  const { currAddress } = useContext(CampaignContext)!
  const { cdata, fcLoading, cRisks } = useURIData(currAddress)
  return (
    <section className="cpd-tab st-container fl-tl fl-c" id="s_risks">
      <h3 className="st-title">{"Risks"}</h3>
      {
        !cdata || fcLoading || !cdata.risks ? <ReactLoading type="bubbles" color="#C4A2E7"/> : <article className="st-story" dangerouslySetInnerHTML={cRisks}/>
      }
    </section>
  )
}
