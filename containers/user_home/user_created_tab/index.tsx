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
import s from "./user_created_tab.module.sass"

export default function UserCreatedTab() {
	const { account, isAuth, uNameVal }: conn = useContext(ConnectionContext)!
	const { activeTab, setActiveTab, uData } = useContext(DashboardContext)!
	const { backersSum, cCampaignsSum, totalRaisedSum } = useUserStats(account)
	const { cmps } = useUserCreatedCmps()

	return (
		<>
			<div className={s["db-stats-grp"]}>
				<div className={s["db-stats-cont"]}>
					<div className={s["db-stat"]}>
						<p className={s["db-stat-act"]}>{"raised"}</p>
						<div className={s["db-stat-amt-grp"]}>
							<p className={s["db-stat-amt"]}>{totalRaisedSum}</p>
							<p className={s["db-stat-msr"]}>{"ETH"}</p>
						</div>
					</div>
					<div className={s["db-stat"]}>
						<p className={s["db-stat-act"]}>{"from"}</p>
						<div className={s["db-stat-amt-grp"]}>
							<p className={s["db-stat-amt"]}>
								{backersSum}
								{/* <sup>{"+"}</sup> */}
							</p>
							<p className={s["db-stat-msr"]}>{`${"backer"}${
								~~backersSum !== 1 ? "s" : ""
							}`}</p>
						</div>
					</div>
					<div className={s["db-stat"]}>
						<p className={s["db-stat-act"]}>{"across"}</p>
						<div className={s["db-stat-amt-grp"]}>
							<p className={s["db-stat-amt"]}>{cCampaignsSum}</p>
							<p className={s["db-stat-msr"]}>{`${"campaign"}${
								~~cCampaignsSum !== 1 ? "s" : ""
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

			<section className={s["db-table"]}>
				<div className={s["db-table-type"]}>
					<h3>{"Campaigns Created"}</h3>
				</div>

				<div className={s["db-tbl-hdr"]}>
					<span className={s["db-tbl-hdr-ele"]}>{"Name"}</span>
					<span className={s["db-tbl-hdr-ele"]}>{"Status"}</span>
					<span className={`${s["db-tbl-hdr-ele"]} ${s["--eta"]}`}>
						{"ETA (days)"}
					</span>
					<span className={s["db-tbl-hdr-ele"]}>{"Balance"}</span>
				</div>

				<div className={s["db-tbl-rw"]}>
					<span className={s["db-tbl-rw-ele"]}>
						<img src="/e43.png" alt="--" className={s["db-tbl-rw-img"]} />
						<span>{"Rune Fencer Illyia - A Cute Metroidvania"}</span>
					</span>
					<span className={`${s["db-tbl-rw-ele"]} ${s["--status"]}`}>
						{"Fundraising"}
					</span>
					<span className={`${s["db-tbl-rw-ele"]}  ${s["--eta"]}`}>{"15"}</span>
					<span className={s["db-tbl-rw-ele"]}>
						<FontAwesomeIcon
							icon={faEthereum}
							className={s["db-tbl-act-icon"]}
						/>
						<span>{"3.58"}</span>
					</span>
					<span className={`${s["db-tbl-rw-ele"]} ${s["--options"]}`}>
						<FontAwesomeIcon icon={faPencil} className={s["db-tbl-act-icon"]} />
						<span className={s["db-tbl-details"]}>{"Details"}</span>
					</span>
				</div>

				<div className={s["db-tbl-rw"]}>
					<span className={s["db-tbl-rw-ele"]}>
						<img src="/e43.png" alt="--" className={s["db-tbl-rw-img"]} />
						<span>{"Rune Fencer Illyia - A Cute Metroidvania"}</span>
					</span>
					<span className={`${s["db-tbl-rw-ele"]} ${s["--status"]}`}>
						{"Fundraising"}
					</span>
					<span className={`${s["db-tbl-rw-ele"]}  ${s["--eta"]}`}>{"15"}</span>
					<span className={s["db-tbl-rw-ele"]}>
						<FontAwesomeIcon
							icon={faEthereum}
							className={s["db-tbl-act-icon"]}
						/>
						<span>{"3.58"}</span>
					</span>
					<span className={`${s["db-tbl-rw-ele"]} ${s["--options"]}`}>
						<FontAwesomeIcon icon={faPencil} className={s["db-tbl-act-icon"]} />
						<span className={s["db-tbl-details"]}>{"Details"}</span>
					</span>
				</div>

				<div className={s["db-tbl-rw"]}>
					<span className={s["db-tbl-rw-ele"]}>
						<img src="/e43.png" alt="--" className={s["db-tbl-rw-img"]} />
						<span>{"Rune Fencer Illyia - A Cute Metroidvania"}</span>
					</span>
					<span className={`${s["db-tbl-rw-ele"]} ${s["--status"]}`}>
						{"Fundraising"}
					</span>
					<span className={`${s["db-tbl-rw-ele"]}  ${s["--eta"]}`}>{"15"}</span>
					<span className={s["db-tbl-rw-ele"]}>
						<FontAwesomeIcon
							icon={faEthereum}
							className={s["db-tbl-act-icon"]}
						/>
						<span>{"3.58"}</span>
					</span>
					<span className={`${s["db-tbl-rw-ele"]} ${s["--options"]}`}>
						<FontAwesomeIcon icon={faPencil} className={s["db-tbl-act-icon"]} />
						<span className={s["db-tbl-details"]}>{"Details"}</span>
					</span>
				</div>
			</section>
			<div className={s["db-tbl-pgnt"]}>
				<button className={s["db-tbl-sm-btn"]}>{"See more"}</button>
			</div>
		</>
	)
}
