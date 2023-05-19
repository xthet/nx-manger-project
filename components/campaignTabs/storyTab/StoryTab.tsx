import { CampaignContext } from "@/contexts/currentCampaign"
import { useURIData } from "@/hooks/useURIData"
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext } from "react"
import ReactLoading from "react-loading"


export default function StoryTab() {
  const { currAddress } = useContext(CampaignContext)!
  const { cdata, fcLoading, cStory } = useURIData(currAddress)
  return (
    <section className="cpd-tab st-container fl-tl fl-c" id="s_story">
      <h3 className="st-title" style={{ "paddingLeft":"0.5rem" }}>
        {"Story"}
        {/* <span className="st-maximize">
          <FontAwesomeIcon icon={faCaretLeft} className="st-max-icon"/>
          <FontAwesomeIcon icon={faCaretRight} className="st-max-icon"/>
        </span> */}
      </h3>
      {
        !cdata || fcLoading || !cdata.story ? <ReactLoading type="bubbles" color="#C4A2E7"/> : <article className="st-story" dangerouslySetInnerHTML={cStory}/>
      }
    </section>
  )
}
