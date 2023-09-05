import getCountrySelect from "@/utils/getCountrySelect"
import s from "./survey_response_form.module.sass"
import { useContext, useEffect, useState } from "react"
import Select from "react-select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { conn, creds, survey } from "@/types"
import { useRouter } from "next/router"
import { CampaignContext } from "@/contexts/currentCampaign"
import { useCdata } from "@/hooks/useCdata"
import { ConnectionContext } from "@/contexts/connection"
import fleek from "@fleekhq/fleek-storage-js"
import { ethers } from "ethers"
import RewardABI from "@/constants/abis/Reward.json"
import { NotificationContext } from "@/contexts/notification"
import { v4 } from "uuid"
import ReactLoading from "react-loading"

const counOptionsArr = getCountrySelect().slice(1, getCountrySelect().length)

export default function SurveyResponseForm({
	offMe,
	link,
}: {
	offMe: Function
	link: string
}) {
	const [selectedOption, setSelectedOption] = useState<any>()
	const [surveyJSON, setSurveyJSON] = useState<survey | null>(null)
	const { currAddress, currState } = useContext(CampaignContext)!
	const router = useRouter()
	const { campaignDetails } = useCdata(currAddress)
	const { isConnected, connect, account, signer, isAuth, uNameVal }: conn =
		useContext(ConnectionContext)!
	const { dispatch } = useContext(NotificationContext)!
	const [sLoading, setSLoading] = useState(false)

	async function uploadResponse(grand_survey_response: any) {
		const date = new Date()
		const timestamp = date.getTime()
		const data = {
			apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY!,
			apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SEC!,
			key: `manger/survey_responses/${uNameVal}/MNG_${timestamp}`,
			data: JSON.stringify(grand_survey_response),
		}
		try {
			const response = await fleek.upload(data)
			return response.hashV0
		} catch (error) {
			console.log(error)
		}
	}

	async function relayResponse(e: any) {
		setSLoading(true)
		const data = new FormData(e.target)
		const credentials: creds | null = !surveyJSON?.credentials
			? null
			: {
					name: data.get("Full name")!.toString(),
					str_address: data.get("Address")!.toString(),
					city: data.get("City")!.toString(),
					state: data.get("State")!.toString(),
					postal_code: data.get("Zip or Postal Code")!.toString(),
					country: data.get("Country")!.toString(),
			  }
		const responses = []
		for (var enquiry of surveyJSON!.enquiries) {
			const response = {
				question: enquiry.question,
				answer: data.get(enquiry.question)!.toString(),
			}
			responses.push(response)
		}
		const grand_survey_response = {
			responder_name: uNameVal,
			reward_in_view: surveyJSON?.reward_address,
			credentials,
			responses,
		}

		const res_hash = await uploadResponse(grand_survey_response)
		const res_link = `ipfs://${res_hash}`

		const reward = new ethers.Contract(
			surveyJSON!.reward_address,
			RewardABI.abi,
			signer
		)
		try {
			const respondTx = await reward.respondToSurvey(res_link)
			await respondTx.wait(1)
			dispatch({
				type: "ADD_NOTI",
				payload: {
					id: v4(),
					type: "SUCCESS",
					title: "Response Submitted Successfully",
					message: "",
				},
			})
		} catch (error) {
			console.log(error)
			dispatch({
				type: "ADD_NOTI",
				payload: {
					id: v4(),
					type: "FAILURE",
					title: "Survey Response Failed",
					message: "A problem occurred: we couldn't process your response",
				},
			})
		}
		setSLoading(false)
		offMe()
	}

	useEffect(() => {
		async function fetchQuestions() {
			const r_link = link.replace("ipfs://", "https://ipfs.io/ipfs/")
			const survey_object: survey = await fetch(r_link)
				.then((res) => res.json())
				.then((data) => data)
			survey_object && setSurveyJSON(survey_object)
		}
		link && fetchQuestions().catch((e) => console.log(e))
	}, [link])
	return (
		<>
			<div className={s.reactive} />
			<main className={s.form_cont}>
				<FontAwesomeIcon
					icon={faXmarkCircle}
					className={s.cancel_icon}
					onClick={() => {
						offMe()
					}}
				/>
				<div className={s.header}>
					<h2 className={s.cmp_name}>{campaignDetails?.title}</h2>
					<p className={s.cmp_creator}>{surveyJSON?.reward_creator}</p>
				</div>
				<p className={s.intro}>{surveyJSON?.intro}</p>
				<div className={s.separator} />

				<form
					className={s.form}
					onSubmit={(e) => {
						e.preventDefault()
						if (surveyJSON) {
							relayResponse(e)
						}
					}}
				>
					{surveyJSON?.credentials && (
						<div className={s.enquiry}>
							<div className={s.shipping_details}>
								<label className={s.shipping_details_label}>
									Shipping details
								</label>
								<input
									type="text"
									className={s.input}
									placeholder="Full name"
									name="Full name"
									required
								/>
								<div className={s.input_small}>
									<input
										type="text"
										className={s.input}
										placeholder="Address"
										name="Address"
										required
									/>
									<small>Street Address, P.O. box</small>
								</div>
								<div className={s.input_grp}>
									<input
										type="text"
										className={s.input}
										placeholder="City"
										name="City"
										required
									/>
									<input
										type="text"
										className={s.input}
										placeholder="State"
										name="State"
										required
									/>
								</div>
								<div className={s.input_grp}>
									<input
										type="number"
										className={s.input}
										placeholder="Zip or Postal Code"
										name="Zip or Postal Code"
										required
									/>
									<Select
										options={counOptionsArr}
										onChange={setSelectedOption}
										value={selectedOption}
										className={s.country_select}
										placeholder="Select country"
										name="Country"
										hideSelectedOptions={false}
										required
									/>
								</div>
								<div className={s.separator} />
							</div>
						</div>
					)}
					{surveyJSON?.enquiries.map((enquiry, idx) => {
						if (enquiry.type == "single") {
							return (
								<div className={s.enquiry} key={idx}>
									<div className={s.single_question}>
										<label className={s.question_label}>
											{enquiry.question}
										</label>
										<input
											name={enquiry.question}
											type="text"
											className={s.input}
											placeholder="required"
											required
										/>
									</div>
									<div className={s.separator} />
								</div>
							)
						} else if (enquiry.type == "multi") {
							return (
								<div className={s.enquiry} key={idx}>
									<div className={s.multi_question}>
										<label className={s.question_label}>
											{enquiry.question}
										</label>
										<div className={s.options}>
											{enquiry.options?.map((option: string, o_idx: number) => {
												return (
													<div className={s.option} key={o_idx}>
														<input
															type="radio"
															value={option}
															required
															name={enquiry.question}
															className={s.option_radio}
														/>
														<span>{option}</span>
													</div>
												)
											})}
										</div>
									</div>
									<div className={s.separator} />
								</div>
							)
						}
					})}

					<div className={s.footer}>
						{sLoading ? (
							<ReactLoading type="bubbles" color="#827B93" />
						) : (
							<button type="submit" className={s.submit}>
								Submit
							</button>
						)}
					</div>
				</form>
			</main>
		</>
	)
}
