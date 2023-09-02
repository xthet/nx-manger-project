import CampaignRow from "@/components/campaignRow/CampaignRow"
import DashboardLayout from "@/containers/dashboardLayout"
import { ConnectionContext } from "@/contexts/connection"
import useDashboardValidator from "@/hooks/useDashboardValidator"
import useFindUserBacked from "@/hooks/useFindUserBacked"
import { conn } from "@/types"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Error from "next/error"
import Link from "next/link"
import { useContext } from "react"
import s from "./all_user_backed_page.module.sass"

export default function AllUserBackedPage() {
	const { account, isAuth, uNameVal }: conn = useContext(ConnectionContext)!
	const { validated } = useDashboardValidator()
	const { backedCampaigns } = useFindUserBacked()

	if (!validated) {
		return <Error statusCode={404} />
	}

	return (
		<DashboardLayout>
			<div className={s["db-table"]}>
				<div className={s["db-table-type"]}>
					<h3>{"Campaigns Backed"}</h3>
				</div>

				<div className={s["db-tbl-hdr"]}>
					<span className={s["db-tbl-hdr-ele"]}>{"Name"}</span>
					<span className={s["db-tbl-hdr-ele--status"]}>{"Status"}</span>
					<span className={`${s["db-tbl-hdr-ele"]} ${s["--eta"]}`}>
						{"ETA (days)"}
					</span>
					<span className={s["db-tbl-hdr-ele"]}>{"Balance"}</span>
				</div>

				{backedCampaigns.length > 0 &&
					backedCampaigns.map((cmp, idx) => {
						return (
							<Link
								href={`/dashboard/${uNameVal}/all_user_backed_page/${cmp.campaignAddress}`}
								key={idx}
								className={s["db-tbl-rw-link"]}
								style={{ width: "100%" }}
							>
								<CampaignRow address={cmp.campaignAddress} created={false} />
							</Link>
						)
					})}
			</div>
			<div className={s["db-tbl-pgnt"]}>
				{/* <button className="db-tbl-sm-btn">{"See more"}</button> */}
				<FontAwesomeIcon icon={faAngleLeft} className={s["db-tbl-pgnt-icon"]} />
				<div className={s["db-tbl-pgs-cont"]}>
					<span>{"1"}</span>
					<span className={s["--pgatv"]}>{"2"}</span>
				</div>
				<FontAwesomeIcon
					icon={faAngleRight}
					className={s["db-tbl-pgnt-icon"]}
				/>
			</div>
		</DashboardLayout>
	)
}
