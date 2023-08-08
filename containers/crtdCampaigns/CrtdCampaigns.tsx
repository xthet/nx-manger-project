import CampaignRow from "@/components/campaignRow/CampaignRow"
import { ConnectionContext } from "@/contexts/connection"
import useFindUserPublished from "@/hooks/useFindUserPublished"
import { conn } from "@/types"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import {
  faAngleLeft,
  faAngleRight,
  faPencil,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/router"
import { useContext } from "react"

export default function CrtdCampaigns() {
  const router = useRouter()
  const { isConnected, account, connect, isAuth, uNameVal }: conn =
    useContext(ConnectionContext)!
  const { createdCampaigns } = useFindUserPublished(account)
  // console.log(createdCampaigns)

  return (
    <>
      <div className="db-table">
        <div className="db-table-type">
          <h3>{"Campaigns Created"}</h3>
        </div>

        <div className="db-tbl-hdr">
          <span className="db-tbl-hdr-ele">{"Name"}</span>
          <span className="db-tbl-hdr-ele">{"Status"}</span>
          <span className="db-tbl-hdr-ele --eta">{"ETA (days)"}</span>
          <span className="db-tbl-hdr-ele">{"Balance"}</span>
        </div>

        {createdCampaigns.length > 0 &&
          createdCampaigns.map((cmp, idx) => {
            return <CampaignRow address={cmp.campaignAddress} key={idx} />
          })}
      </div>
      <div className="db-tbl-pgnt">
        {/* <button className="db-tbl-sm-btn">{"See more"}</button> */}
        <FontAwesomeIcon icon={faAngleLeft} className="db-tbl-pgnt-icon" />
        <div className="db-tbl-pgs-cont">
          <span>{"1"}</span>
          <span className="--pgatv">{"2"}</span>
        </div>
        <FontAwesomeIcon icon={faAngleRight} className="db-tbl-pgnt-icon" />
      </div>
    </>
  )
}
