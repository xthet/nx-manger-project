import SingleUserCreatedActiveCmp from "@/containers/single_user_created_active_cmp"
import { CampaignProvider } from "@/contexts/currentCampaign"
import useDashboardValidator from "@/hooks/useDashboardValidator"
import Error from "next/error"
import { useRouter } from "next/router"
import s from "./user_single_cmp_created.module.sass"

export default function UserSingleCmpCreated() {
	const router = useRouter()
	const campaign_address = router.asPath.split("/")[4]
	const { validated } = useDashboardValidator()
	if (!validated) {
		return <Error statusCode={404} />
	}
	// pathname = /dashboard/[user]/all_user_created_page/[user_single_cmp_created]

	return (
		<main className={s.section}>
			<CampaignProvider address={campaign_address}>
				<SingleUserCreatedActiveCmp />
			</CampaignProvider>
		</main>
	)
}
