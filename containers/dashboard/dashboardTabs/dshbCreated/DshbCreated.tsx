import { ConnectionContext } from "@/contexts/connection"
import { DashboardContext } from "@/contexts/dashboard"
import { useQUData } from "@/hooks/useQUData"
import useUserCreatedCmps from "@/hooks/useUserCreatedCmps"
import useUserStats from "@/hooks/useUserStats"
import { conn } from "@/types"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { faCircleInfo, faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext } from "react"

export default function DshbCreated() {
  const { account, isAuth, uNameVal }: conn = useContext(ConnectionContext)!
  const { activeTab, setActiveTab, uData } = useContext(DashboardContext)!
  const { backersSum, cCampaignsSum, totalRaisedSum } = useUserStats(account)
  const {} = useUserCreatedCmps(account)

  return (
    <>
      <div className="db-stats-grp">
        <div className="db-stats-cont">
          <div className="db-stat">
            <p className="db-stat-act">{"raised"}</p>
            <div className="db-stat-amt-grp">
              <p className="db-stat-amt">{totalRaisedSum}</p>
              <p className="db-stat-msr">{"ETH"}</p>
            </div>
          </div>
          <div className="db-stat">
            <p className="db-stat-act">{"from"}</p>
            <div className="db-stat-amt-grp">
              <p className="db-stat-amt">
                {backersSum}
                {/* <sup>{"+"}</sup> */}
              </p>
              <p className="db-stat-msr">{`${"backer"}${
                ~~backersSum !== 1 ? "s" : ""
              }`}</p>
            </div>
          </div>
          <div className="db-stat">
            <p className="db-stat-act">{"across"}</p>
            <div className="db-stat-amt-grp">
              <p className="db-stat-amt">{cCampaignsSum}</p>
              <p className="db-stat-msr">{`${"campaign"}${
                ~~cCampaignsSum !== 1 ? "s" : ""
              }`}</p>
            </div>
          </div>
        </div>

        <div className="db-stats-info">
          <p>
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="db-stats-info-icon"
            />
            {`
            Did you know: Manger runs a flexible crowdfunding system i.e. 
            all earnings at the end of a campaign, belong to the campaign creator, 
            even if the campaign goal isn't reached. 
            `}
          </p>
        </div>
      </div>

      {/* <section className="db-recents">
        <h3>{"Recent Donations"}</h3>
        <div className="db-recents-cont">
          <div className="db-recent">
            <div className="db-recent-dets-grp">
              <img src="/re3.jpg" alt="--" />
              <div className="db-recent-dets">
                <span>{"Emma Ryan Jr."}</span>
                <span>{"Dark Metroidvania"}</span>
              </div>
            </div>
            <span className="db-recent-amt">{"0.03"}<span>{"ETH"}</span></span>
          </div>
          <div className="db-recent">
            <div className="db-recent-dets-grp">
              <img src="/re3.jpg" alt="--" />
              <div className="db-recent-dets">
                <span>{"Emma Ryan Jr."}</span>
                <span>{"Dark Metroidvania"}</span>
              </div>
            </div>
            <span className="db-recent-amt">{"0.03"}<span>{"ETH"}</span></span>
          </div>
          <div className="db-recent">
            <div className="db-recent-dets-grp">
              <img src="/re3.jpg" alt="--" />
              <div className="db-recent-dets">
                <span>{"Emma Ryan Jr."}</span>
                <span>{"Dark Metroidvania"}</span>
              </div>
            </div>
            <span className="db-recent-amt">{"0.03"}<span>{"ETH"}</span></span>
          </div>
        </div>
      </section> */}

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

        <div className="db-tbl-rw">
          <span className="db-tbl-rw-ele">
            <img src="/e43.png" alt="--" className="db-tbl-rw-img" />
            <span>{"Rune Fencer Illyia - A Cute Metroidvania"}</span>
          </span>
          <span className="db-tbl-rw-ele --status">{"Fundraising"}</span>
          <span className="db-tbl-rw-ele  --eta">{"15"}</span>
          <span className="db-tbl-rw-ele">
            <FontAwesomeIcon icon={faEthereum} className="db-tbl-act-icon" />
            <span>{"3.58"}</span>
          </span>
          <span className="db-tbl-rw-ele --options">
            <FontAwesomeIcon icon={faPencil} className="db-tbl-act-icon" />
            {/* <FontAwesomeIcon icon={faTrash} className="db-tbl-act-icon"/> */}
            <span className="db-tbl-details">{"Details"}</span>
          </span>
        </div>

        <div className="db-tbl-rw">
          <span className="db-tbl-rw-ele">
            <img src="/e43.png" alt="--" className="db-tbl-rw-img" />
            <span>{"Dark Metroidvania"}</span>
          </span>
          <span className="db-tbl-rw-ele --status">{"Fundraising"}</span>
          <span className="db-tbl-rw-ele --eta">{"53"}</span>
          <span className="db-tbl-rw-ele">
            <FontAwesomeIcon icon={faEthereum} className="db-tbl-act-icon" />
            <span>{"3.58"}</span>
          </span>
          <span className="db-tbl-rw-ele --options">
            <FontAwesomeIcon icon={faPencil} className="db-tbl-act-icon" />
            {/* <FontAwesomeIcon icon={faTrash} className="db-tbl-act-icon"/> */}
            <span className="db-tbl-details">{"Details"}</span>
          </span>
        </div>

        <div className="db-tbl-rw">
          <span className="db-tbl-rw-ele">
            <img src="/e43.png" alt="--" className="db-tbl-rw-img" />
            <span>{"Dark Metroidvania"}</span>
          </span>
          <span className="db-tbl-rw-ele --status">{"Fundraising"}</span>
          <span className="db-tbl-rw-ele  --eta">{"5"}</span>
          <span className="db-tbl-rw-ele">
            <FontAwesomeIcon icon={faEthereum} className="db-tbl-act-icon" />
            <span>{"3.58"}</span>
          </span>
          <span className="db-tbl-rw-ele --options">
            <FontAwesomeIcon icon={faPencil} className="db-tbl-act-icon" />
            {/* <FontAwesomeIcon icon={faTrash} className="db-tbl-act-icon"/> */}
            <span className="db-tbl-details">{"Details"}</span>
          </span>
        </div>
      </div>

      <div className="db-tbl-pgnt">
        <button className="db-tbl-sm-btn">{"See more"}</button>
        {/* <FontAwesomeIcon icon={faAngleLeft} className="db-tbl-pgnt-icon"/>
        <div className="db-tbl-pgs-cont">
          <span>{"1"}</span>
          <span className="--pgatv">{"2"}</span>
        </div>
        <FontAwesomeIcon icon={faAngleRight} className="db-tbl-pgnt-icon"/> */}
      </div>
    </>
  )
}
