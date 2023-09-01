import UserSingleActiveRwd from "@/containers/user_single_active_rwd"
import useDashboardValidator from "@/hooks/useDashboardValidator"
import useRwdCard from "@/hooks/useRwdCard"
import Error from "next/error"
import { useRouter } from "next/router"
import s from "./user_created_cmp_rwd.module.sass"
import DashboardPath from "@/components/dashboard_path"
import { useContext } from "react"
import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"

export default function UserCreatedCmpRwd() {
	const router = useRouter()
	const campaign_address = router.asPath.split("/")[4]
	const r_id = Number(router.asPath.split("/")[5])
	const { isConnected, signer, isAuth, account, uNameVal }: conn =
		useContext(ConnectionContext)!
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
						{/* <p>No responses have been made to this survey.</p> */}
						<div className={s.entries_cont}>
							<div className={s.resp_entry}>
								<span>cod_alligator</span>
								<button>View response</button>
							</div>
							<div className={s.resp_entry}>
								<span>cod_alligator</span>
								<button>View response</button>
							</div>
							<div className={s.resp_entry}>
								<span>cod_alligator</span>
								<button>View response</button>
							</div>
							<div className={s.resp_entry}>
								<span>cod_alligator</span>
								<button>View response</button>
							</div>
							<div className={s.resp_entry}>
								<span>cod_alligator</span>
								<button>View response</button>
							</div>
							<div className={s.resp_entry}>
								<span>cod_alligator</span>
								<button>View response</button>
							</div>
						</div>
					</div>
				</main>
				<div className={s.separator} />
				<aside className={s.response_in_view}>
					<div className={s.resp_section_header}>
						{rwdDetails && <h3>{rwdDetails.title}</h3>}
						<p>cod_alligator</p>
					</div>

					<div className={s.staged_resp}>
						<div className={s.shipping_details}>
							<h4>Shipping details</h4>
							<div className={s.shipping_dets_cont}>
								<p>
									<span>Name:</span>
									<span>James Fraser</span>
								</p>
								<p>
									<span>Address:</span>
									<span>34, Eugene Drive, Palo Alto, CA.</span>
								</p>
								<p>
									<span>City/State:</span>
									<span>Aurora/California</span>
								</p>
								<p>
									<span>Zip/Postal Code:</span>
									<span>110115</span>
								</p>
								<p>
									<span>Country:</span>
									<span>United States of America</span>
								</p>
							</div>
						</div>
						<div className={s.resp_separator} />
						<div className={s.enquiry}>
							<p>Do you want your book as an NFT?</p>
							<p>— Yes</p>
							<div className={s.resp_separator} />
						</div>
						<div className={s.enquiry}>
							<p>Did you apply for any other reward tier?</p>
							<p>— No</p>
							<div className={s.resp_separator} />
						</div>
					</div>
				</aside>
			</section>
		</section>
	)
}
