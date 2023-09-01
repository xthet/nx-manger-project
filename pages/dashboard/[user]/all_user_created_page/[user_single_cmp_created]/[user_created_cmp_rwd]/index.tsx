import UserSingleActiveRwd from "@/containers/user_single_active_rwd"
import useDashboardValidator from "@/hooks/useDashboardValidator"
import useRwdCard from "@/hooks/useRwdCard"
import Error from "next/error"
import { useRouter } from "next/router"
import s from "./user_created_cmp_rwd.module.sass"
import DashboardPath from "@/components/dashboard_path"

export default function UserCreatedCmpRwd() {
	const router = useRouter()
	const campaign_address = router.asPath.split("/")[4]
	const r_id = Number(router.asPath.split("/")[5])
	const { loading, setLoading, rwdDetails, deliDate, shipping, rwdAddress } =
		useRwdCard(campaign_address, r_id)
	const { validated } = useDashboardValidator()
	if (!validated) {
		return <Error statusCode={404} />
	}

	return (
		<section className={s.page}>
			<div className={s.dashboard_path}>
				<DashboardPath />
			</div>
			<section className={s.section}>
				<main
					className={s.rwd_in_view}
					style={!rwdDetails.surveyLink ? { width: "100%" } : {}}
				>
					<UserSingleActiveRwd
						address={campaign_address}
						id={r_id}
						onEdit={false}
					/>
					<div className={s.responses}>
						<div className={s.rwd_response_header}>
							<h3>SURVEY RESPONSES</h3>
							<div className={s.rwd_separator} />
						</div>
						<p>No responses have been made to this survey.</p>
					</div>
				</main>
				<div className={s.separator} />
				<aside className={s.response_in_view}>
					<div className={s.resp_section_header}>
						<h3>Palomino Vol 2 & 3</h3>
						<p>darkplanetcomics</p>
					</div>
				</aside>
			</section>
		</section>
	)
}
