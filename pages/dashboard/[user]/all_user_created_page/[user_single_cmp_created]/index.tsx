import SingleUserCreatedActiveCmp from "@/containers/single_user_created_active_cmp"
import { CampaignProvider } from "@/contexts/currentCampaign"
import useDashboardValidator from "@/hooks/useDashboardValidator"
import Error from "next/error"
import { useRouter } from "next/router"
import s from "./user_single_cmp_created.module.sass"
import useRwdTab from "@/hooks/useRwdTab"
import UserCreatedCmpRwdCard from "@/components/user_created_cmp_rwd_card"
import PayoutBox from "@/components/payout_box"

export default function UserSingleCmpCreated() {
	const router = useRouter()
	const campaign_address = router.asPath.split("/")[4]
	const { loading, rwIds } = useRwdTab(campaign_address)
	const { validated } = useDashboardValidator()
	if (!validated) {
		return <Error statusCode={404} />
	}
	// pathname = /dashboard/[user]/all_user_created_page/[user_single_cmp_created]

	return (
		<main className={s.section}>
			<CampaignProvider address={campaign_address}>
				<SingleUserCreatedActiveCmp />
				<section className={s.campaign_dets}>
					<main className={s.rewards_section}>
						<div className={s.header}>
							<h3>REWARDS CREATED</h3>
							<div className={s.separator} />
						</div>
						<div className={s.rewards_cont}>
							{rwIds.map((rId: number, index: number) => {
								return (
									<UserCreatedCmpRwdCard
										address={campaign_address}
										id={rId}
										key={index}
										onEdit={false}
									/>
								)
							})}
						</div>
					</main>

					<aside className={s.payout_section}>
						<div className={s.header}>
							<h3 style={{ width: "100%", textAlign: "right" }}>PAYOUT</h3>
							<div className={s.separator} />
						</div>

						<div className={s.payout_cont}>
							<PayoutBox />
						</div>
					</aside>
				</section>
			</CampaignProvider>
		</main>
	)
}
