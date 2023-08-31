import { ConnectionContext } from "@/contexts/connection"
import { DashboardContext } from "@/contexts/dashboard"
import useUserStats from "@/hooks/useUserStats"
import { conn } from "@/types"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { faCircleInfo, faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext } from "react"
import s from "./user_backed_tab.module.sass"
import useFindUserBacked from "@/hooks/useFindUserBacked"
import CampaignRow from "@/components/campaignRow/CampaignRow"

export default function UserBackedTab() {
	const { account, isAuth, uNameVal }: conn = useContext(ConnectionContext)!
	const { activeTab, setActiveTab, uData } = useContext(DashboardContext)!
	const { bCampaignsSum, totalDonatedSum, creatorsSuppSum } =
		useUserStats(account)
	const { backedCampaigns } = useFindUserBacked()

	return (
		<>
			<div className={s["db-stats-grp"]}>
				<div className={s["db-stats-cont"]}>
					<div className={s["db-stat"]}>
						<p className={s["db-stat-act"]}>{"donated"}</p>
						<div className={s["db-stat-amt-grp"]}>
							<p className={s["db-stat-amt"]}>
								{totalDonatedSum.length > 5
									? totalDonatedSum.slice(0, 4) + "+"
									: totalDonatedSum}
							</p>

							<p className={s["db-stat-msr"]}>{"ETH"}</p>
						</div>
					</div>
					<div className={s["db-stat"]}>
						<p className={s["db-stat-act"]}>{"to"}</p>
						<div className={s["db-stat-amt-grp"]}>
							<p className={s["db-stat-amt"]}>{creatorsSuppSum}</p>
							<p className={s["db-stat-msr"]}>{`${"creator"}${
								~~creatorsSuppSum !== 1 ? "s" : ""
							}`}</p>
						</div>
					</div>
					<div className={s["db-stat"]}>
						<p className={s["db-stat-act"]}>{"across"}</p>
						<div className={s["db-stat-amt-grp"]}>
							<p className={s["db-stat-amt"]}>{bCampaignsSum}</p>
							<p className={s["db-stat-msr"]}>{`${"campaign"}${
								~~bCampaignsSum !== 1 ? "s" : ""
							}`}</p>
						</div>
					</div>
				</div>

				<div className={s["db-stats-info"]}>
					<p>
						<FontAwesomeIcon
							icon={faCircleInfo}
							className={s["db-stats-info-icon"]}
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

			<section className={s["db-table"]}>
				<div className={s["db-table-type"]}>
					<h3>{"Campaigns Backed"}</h3>
				</div>

				<div className={s["db-tbl-hdr"]}>
					<span className={s["db-tbl-hdr-ele"]}>{"Name"}</span>
					<span className={s["db-tbl-hdr-ele"]}>{"Status"}</span>
					<span className={`${s["db-tbl-hdr-ele"]} ${s["--eta"]}`}>
						{"ETA (days)"}
					</span>
					<span className={s["db-tbl-hdr-ele"]}>{"Balance"}</span>
				</div>

				{backedCampaigns.length > 0 &&
					backedCampaigns.slice(0, 4).map((cmp, idx) => {
						return <CampaignRow address={cmp.campaignAddress} key={idx} />
					})}
			</section>

			{backedCampaigns.length > 3 && (
				<div className={s["db-tbl-pgnt"]}>
					<button className={s["db-tbl-sm-btn"]}>{"See more"}</button>
				</div>
			)}
		</>
	)
}
