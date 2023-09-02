import UserSingleActiveRwd from "@/containers/user_single_active_rwd"
import useDashboardValidator from "@/hooks/useDashboardValidator"
import useRwdCard from "@/hooks/useRwdCard"
import Error from "next/error"
import { useRouter } from "next/router"
import s from "./user_created_cmp_rwd.module.sass"
import DashboardPath from "@/components/dashboard_path"
import { useContext, useState } from "react"
import { ConnectionContext } from "@/contexts/connection"
import { conn, survey_response } from "@/types"
import useFindSurveyResponders from "@/hooks/useFindSurveyResponders"
import { cutStr } from "@/utils/cutStr"
import { truncateStr } from "@/utils/truncateStr"
import ResponseRow from "@/components/response_row"

export default function UserCreatedCmpRwd() {
	const router = useRouter()
	const campaign_address = router.asPath.split("/")[4]
	const r_id = Number(router.asPath.split("/")[5])
	const { isConnected, signer, isAuth, account, uNameVal }: conn =
		useContext(ConnectionContext)!
	const { loading, setLoading, rwdDetails, deliDate, shipping, rwdAddress } =
		useRwdCard(campaign_address, r_id)
	const { responders } = useFindSurveyResponders(
		rwdAddress,
		rwdDetails.donators
	)
	const [resInView, setResInView] = useState<survey_response>()
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
					style={resInView ? { width: "60%" } : { width: "100%" }}
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
							{responders &&
								responders.map((responder, idx) => {
									return (
										<ResponseRow
											address={responder.address}
											key={idx}
											onClick={() => {
												async function get_res() {
													const rsp = await fetch(responder.res_link)
														.then((res) => res.json())
														.then((data) => data)
													console.log(rsp)
													setResInView(rsp)
												}
												get_res()
											}}
										/>
									)
								})}
						</div>
					</div>
				</main>
				<div className={s.separator} />
				<aside
					className={s.response_in_view}
					style={
						resInView ? { width: "40%", display: "block" } : { display: "none" }
					}
				>
					<div className={s.resp_section_header}>
						{rwdDetails && <h3>{rwdDetails.title}</h3>}
						<p>{resInView ? resInView.responder_name : ""}</p>
					</div>

					{resInView && (
						<div className={s.staged_resp}>
							{resInView.credentials && (
								<div className={s.shipping_details}>
									<h4>Shipping details</h4>
									<div className={s.shipping_dets_cont}>
										<p>
											<span>Name:</span>
											<span>{resInView.credentials.name}</span>
										</p>
										<p>
											<span>Address:</span>
											<span>{resInView.credentials.str_address}</span>
										</p>
										<p>
											<span>City/State:</span>
											<span>{`${resInView.credentials.city}/${resInView.credentials.state}`}</span>
										</p>
										<p>
											<span>Zip/Postal Code:</span>
											<span>{resInView.credentials.postal_code}</span>
										</p>
										<p>
											<span>Country:</span>
											<span>{resInView.credentials.country}</span>
										</p>
									</div>
								</div>
							)}
							<div className={s.resp_separator} />
							{resInView.responses.map((response, idx) => {
								return (
									<div className={s.enquiry} key={idx}>
										<p>{response.question}</p>
										<p>{`—${response.answer}`}</p>
										<div className={s.resp_separator} />
									</div>
								)
							})}
						</div>
					)}
				</aside>
			</section>
		</section>
	)
}
