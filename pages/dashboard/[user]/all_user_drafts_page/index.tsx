import DashboardLayout from "@/containers/dashboardLayout"
import s from "./all_user_drafts_page.module.sass"
import useFindUserDrafts from "@/hooks/useFindUserDrafts"
import useDashboardValidator from "@/hooks/useDashboardValidator"
import { useRouter } from "next/router"
import { ConnectionContext } from "@/contexts/connection"
import { useContext } from "react"
import { conn } from "@/types"
import Error from "next/error"
import Link from "next/link"
import CampaignRow from "@/components/campaignRow/CampaignRow"
import DraftRow from "@/components/draftRow"

export default function AllUserDraftsPage() {
	const { validated } = useDashboardValidator()
	const router = useRouter()
	const { isConnected, account, connect, isAuth, uNameVal }: conn =
		useContext(ConnectionContext)!
	const { drafts } = useFindUserDrafts(account)

	if (!validated) {
		return <Error statusCode={404} />
	}

	return (
		<DashboardLayout>
			<div className={s["db-table"]}>
				<div className={s["db-table-type"]}>
					<h3>{"Drafts"}</h3>
				</div>

				<div className={s["db-tbl-hdr"]}>
					<span className={s["db-tbl-hdr-ele"]}>{"Name"}</span>
					<span className={s["db-tbl-hdr-ele--status"]}>{"Status"}</span>
					<span className={`${s["db-tbl-hdr-ele"]} ${s["--eta"]}`}>
						{"ETA (days)"}
					</span>
					<span className={s["db-tbl-hdr-ele"]}>{"Balance"}</span>
				</div>

				{drafts.length > 0 &&
					drafts.map((cmp, idx) => {
						return (
							<Link
								href={`/edit-campaign/${cmp.campaignAddress}`}
								key={idx}
								className={s["db-tbl-rw-link"]}
							>
								<DraftRow address={cmp.campaignAddress} />
							</Link>
						)
					})}
			</div>
		</DashboardLayout>
	)
}
