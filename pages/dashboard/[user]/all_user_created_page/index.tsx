import CampaignRow from "@/components/campaignRow/CampaignRow"
import DashboardLayout from "@/containers/dashboardLayout"
import { ConnectionContext } from "@/contexts/connection"
import useDashboardValidator from "@/hooks/useDashboardValidator"
import useFindUserPublished from "@/hooks/useFindUserPublished"
import { conn } from "@/types"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Error from "next/error"
import { useRouter } from "next/router"
import { useContext } from "react"
import s from "./all_user_created_page.module.sass"
import Link from "next/link"

export default function AllUserCreatedPage() {
	const { validated } = useDashboardValidator()
	const router = useRouter()
	const { isConnected, account, connect, isAuth, uNameVal }: conn =
		useContext(ConnectionContext)!
	const { createdCampaigns } = useFindUserPublished(account)
	if (!validated) {
		return <Error statusCode={404} />
	}

	return (
		<DashboardLayout>
			<div className={s["db-table"]}>
				<div className={s["db-table-type"]}>
					<h3>{"Campaigns Created"}</h3>
				</div>

				<div className={s["db-tbl-hdr"]}>
					<span className={s["db-tbl-hdr-ele"]}>{"Name"}</span>
					<span className={s["db-tbl-hdr-ele--status"]}>{"Status"}</span>
					<span className={`${s["db-tbl-hdr-ele"]} ${s["--eta"]}`}>
						{"ETA (days)"}
					</span>
					<span className={s["db-tbl-hdr-ele"]}>{"Balance"}</span>
				</div>

				{createdCampaigns.length > 0 &&
					createdCampaigns.map((cmp, idx) => {
						return (
							<Link
								href={`/dashboard/${uNameVal}/all_user_created_page/${cmp.campaignAddress}`}
								key={idx}
								className={s["db-tbl-rw-link"]}
								style={{ width: "100%" }}
							>
								<CampaignRow address={cmp.campaignAddress} created />
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
