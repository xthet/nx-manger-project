import { useQUData } from "@/hooks/useQUData"
import { fcmp } from "@/types"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function CreatorBioModal({ data, offMe }:{data:fcmp, offMe:Function}) {
  const { uData } = useQUData(data.creator)
  return (
    <>
      <div className="tbx-reactive" onClick={()=>{offMe()}}></div>
      <div className="tbx-modal --tbx-bio-modal">
        <p className="cbm-title">{"About the creator"}</p>
        {uData && <div className="cbm-creator">
          <h2>{"@" + uData!.username}</h2>
          <p>{data.location}</p>
        </div>}
        <p className="--tbx-bio"><p>{data.bio}</p></p>
        <div className="cbm-contacts">
          <span className="cbm-contact">
            <img src="/assets/manger_bio_logo.svg" alt="--" className="cbm-social-icon"/>
            {uData?.username}
          </span>
          <span className="cbm-contact">
            <FontAwesomeIcon icon={faGlobe} className="cbm-social-icon"/>
            {data.website}
          </span>
          <span className="cbm-contact">
            <FontAwesomeIcon icon={faTwitter} className="cbm-social-icon"/>
            {data.twitter}
          </span>
          <span className="cbm-contact">
            <FontAwesomeIcon icon={faEnvelope} className="cbm-social-icon"/>
            {data.email}
          </span>
        </div>
      </div>
    </>
  )
}
