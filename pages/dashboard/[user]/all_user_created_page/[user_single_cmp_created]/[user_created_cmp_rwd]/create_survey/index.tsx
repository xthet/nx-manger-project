import DashboardPath from "@/components/dashboard_path"
import s from "./create_survey.module.sass"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	faPlus,
	faXmark,
	faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons"
import { useContext, useEffect, useState } from "react"
import { conn } from "@/types"
import { ConnectionContext } from "@/contexts/connection"
import Error from "next/error"
import useRwdCard from "@/hooks/useRwdCard"
import useDashboardValidator from "@/hooks/useDashboardValidator"
import { useRouter } from "next/router"
import { ethers } from "ethers"
import RewardABI from "@/constants/abis/Reward.json"
import fleek from "@fleekhq/fleek-storage-js"
import { TimelineBox } from "@/components/exportComps"

export default function CreateSurvey() {
	const { uNameVal, signer }: conn = useContext(ConnectionContext)!
	const router = useRouter()
	const campaign_address = router.asPath.split("/")[4]
	const r_id = Number(router.asPath.split("/")[5])
	const { rwdDetails, rwdAddress } = useRwdCard(campaign_address, r_id)
	const { validated } = useDashboardValidator()
	const [backerSum, setBackerSum] = useState(0)
	const [introText, setIntroText] = useState("")
	const [enquiriesArray, setEnquiriesArray] = useState<any[]>([])
	const [credentials, setCredentials] = useState(true)
	const [stagedOption, setStagedOption] = useState("")
	const [showNotice, setShowNotice] = useState(true)

	const [showTBX, setShowTBX] = useState(false)
	const tlArr = ["Creating survey object", "Uploading", "Survey sent"]
	const [tlIndex, setTlIndex] = useState(0)
	const [tlClosable, setTlClosable] = useState(false)

	function createSingleQuestion() {
		const sq = {
			type: "single",
			question: "",
		}
		setEnquiriesArray((prev) => [...prev, sq])
	}

	function createMultiQuestion() {
		const mq = {
			type: "multi",
			question: "",
			options: [],
		}
		setEnquiriesArray((prev) => [...prev, mq])
	}

	async function uploadJSON(grand_survey_object: any) {
		const date = new Date()
		const timestamp = date.getTime()
		const data = {
			apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY!,
			apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SEC!,
			key: `manger/grand_surveys/${uNameVal}/MNG_${timestamp}`,
			data: JSON.stringify(grand_survey_object),
		}
		try {
			const response = await fleek.upload(data)
			return response.hashV0
		} catch (error) {
			console.log(error)
		}
	}

	async function releaseSurvey() {
		setShowTBX(true)
		const reward = new ethers.Contract(rwdAddress, RewardABI.abi, signer)
		const grand_survey_object = {
			reward_creator: uNameVal,
			reward_address: rwdAddress,
			intro: introText,
			credentials: credentials,
			enquiries: enquiriesArray,
		}
		setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 1))
		const ipfs_hash = await uploadJSON(grand_survey_object)
		const updateTx = await reward.updateSurveyLink(`ipfs://${ipfs_hash}`)
		await updateTx.wait(1)
		setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 2))
	}

	useEffect(() => {
		async function getRwdData() {
			if (signer && rwdAddress) {
				const reward = new ethers.Contract(rwdAddress, RewardABI.abi, signer)
				const donators = await reward.getDonators()
				setBackerSum(donators.length)
			}
		}
		getRwdData()
		setIntroText(`${uNameVal} needs some info from you to deliver your reward.`)
	}, [rwdAddress, signer, campaign_address, uNameVal])

	if (!validated) {
		return <Error statusCode={404} />
	}
	return (
		<main className={s.create_survey}>
			{showTBX && (
				<TimelineBox
					offMe={() => {
						setShowTBX(false)
					}}
					arr={tlArr}
					arrIndex={tlIndex}
					closable={tlClosable}
				/>
			)}
			<div className={s.dashboard_path}>
				<DashboardPath />
			</div>
			<div className={s.header}>
				<h2>Create Survey</h2>
				<div className={s.details}>
					<span>{ethers.utils.formatEther(rwdDetails.price)} ETH reward</span>
					<span>|</span>
					<span>{`${backerSum} backer(s)`}</span>
					<span>|</span>
					<span>{rwdDetails.title}</span>
				</div>
			</div>
			<div className={s.notice} style={!showNotice ? { display: "none" } : {}}>
				<FontAwesomeIcon
					icon={faXmarkCircle}
					className={s.x_icon_abs}
					onClick={() => {
						setShowNotice(false)
					}}
				/>
				<h4>Important reminders</h4>
				<ul>
					<li>
						Surveys can only be sent once per reward. Ask for everything you
						need.
					</li>
					<li>
						Backers are required to answer all questions. Only ask questions
						that everyone must answer.
					</li>
					<li>
						Marketing or demographic-related questions are strictly prohibited.
					</li>
					<li>
						If possible, wait until the reward is ready to ship before asking
						for mailing addresses. People move!
					</li>
				</ul>
			</div>
			<section className={s.survey_creator}>
				<main className={s.edit}>
					<h2>Edit</h2>

					<div className={s.ed_introduction}>
						<p>Introduction to survey</p>
						<textarea
							className={s.ed_text_area}
							cols={30}
							rows={3}
							value={introText}
							onChange={(e) => {
								setIntroText(e.target.value)
							}}
						/>
					</div>

					<div className={s.ed_enquiry}>
						<div className={s.ed_shipping_details}>
							<p>
								Name & address{" "}
								<span style={{ opacity: "0.6" }}>(Shipping details)</span>
							</p>
						</div>
						{credentials ? (
							<FontAwesomeIcon
								icon={faXmark}
								className={s.x_icon}
								onClick={() => setCredentials(false)}
							/>
						) : (
							<FontAwesomeIcon
								icon={faPlus}
								className={s.x_icon}
								onClick={() => setCredentials(true)}
							/>
						)}
					</div>
					{enquiriesArray.map((enquiry, idx) => {
						if (enquiry.type == "single") {
							return (
								<div className={s.ed_enquiry} key={idx}>
									<div className={s.ed_single_question}>
										<input
											type="text"
											value={enquiry.question}
											onChange={(e) => {
												enquiriesArray[idx].question = e.target.value
												setEnquiriesArray((prev) => [...enquiriesArray])
											}}
											required
										/>
									</div>
									<FontAwesomeIcon
										icon={faXmark}
										className={s.x_icon}
										onClick={() => {
											enquiriesArray.splice(idx, 1)
											setEnquiriesArray((prev) => [...enquiriesArray])
										}}
									/>
								</div>
							)
						} else if (enquiry.type == "multi") {
							return (
								<div className={s.ed_enquiry} key={idx}>
									<div className={s.ed_multi_question}>
										<input
											type="text"
											value={enquiry.question}
											onChange={(e) => {
												enquiriesArray[idx].question = e.target.value
												setEnquiriesArray((prev) => [...enquiriesArray])
											}}
											required
										/>
										<div className={s.ed_multi_options}>
											{enquiriesArray[idx].options.map(
												(option: string, o_idx: number) => {
													return (
														<div className={s.ed_option} key={o_idx}>
															<span>{option}</span>
															<FontAwesomeIcon
																icon={faXmark}
																className={s.x_icon}
																onClick={() => {
																	enquiriesArray[idx].options.splice(o_idx, 1)
																	setEnquiriesArray((prev) => [
																		...enquiriesArray,
																	])
																}}
															/>
														</div>
													)
												}
											)}

											<div className={s.ed_add_option}>
												<input
													type="text"
													placeholder="Add an option"
													value={stagedOption}
													onChange={(e) => setStagedOption(e.target.value)}
												/>
												<FontAwesomeIcon
													icon={faPlus}
													className={s.x_icon}
													onClick={() => {
														enquiriesArray[idx].options = [
															...enquiriesArray[idx].options,
															stagedOption,
														]
														setEnquiriesArray((prev) => [...enquiriesArray])
														setStagedOption("")
													}}
												/>
											</div>
										</div>
									</div>
									<FontAwesomeIcon
										icon={faXmark}
										className={s.x_icon}
										onClick={() => {
											enquiriesArray.splice(idx, 1)
											setEnquiriesArray((prev) => [...enquiriesArray])
										}}
									/>
								</div>
							)
						}
					})}

					<div className={s.ed_add_questions}>
						<button
							onClick={() => {
								createSingleQuestion()
							}}
						>
							Add question
						</button>
						<button
							onClick={() => {
								createMultiQuestion()
							}}
						>
							Add multiple choice
						</button>
					</div>
					<div className={s.separator} />
					<div className={s.ed_save_cancel}>
						<button
							onClick={() => {
								releaseSurvey()
							}}
						>
							Send survey
						</button>
						<span
							onClick={() => {
								router.push(
									`/dashboard/${uNameVal}/all_user_created_page/${campaign_address}/`
								)
							}}
						>
							Cancel
						</span>
					</div>
				</main>

				{/* PREVIEW */}
				<aside className={s.preview}>
					<h2>Preview</h2>
					<p className={s.pr_intro}>{introText}</p>
					<div className={s.separator} />

					{credentials && (
						<div className={s.pr_enquiry}>
							<div className={s.pr_shipping_details}>
								<h4>Shipping details</h4>
								<input type="text" className={s.pr_input} placeholder="Name" />
								<input
									type="text"
									className={s.pr_input}
									placeholder="Country"
								/>
								<div className={s.pr_input_small}>
									<input
										type="text"
										className={s.pr_input}
										placeholder="Address"
									/>
									<small>Street Address, P.O. box</small>
								</div>
								<input type="text" className={s.pr_input} placeholder="City" />
								<input type="text" className={s.pr_input} placeholder="State" />
								<input
									type="text"
									className={s.pr_input}
									placeholder="Zip or Postal Code"
								/>
							</div>
							<div className={s.separator} />
						</div>
					)}

					{enquiriesArray.map((enquiry, idx) => {
						if (enquiry.type == "single") {
							return (
								<div className={s.pr_enquiry} key={idx}>
									<div className={s.pr_single_question}>
										<label className={s.pr_question_label}>
											{enquiry.question}
										</label>
										<input
											type="text"
											className={s.pr_input}
											placeholder="required"
											required
										/>
									</div>
									<div className={s.separator} />
								</div>
							)
						} else if (enquiry.type == "multi") {
							return (
								<div className={s.pr_enquiry} key={idx}>
									<div className={s.pr_multi_question}>
										<label className={s.pr_question_label}>
											{enquiry.question}
										</label>
										<div className={s.pr_options}>
											{enquiry.options.map((option: string, o_idx: number) => {
												return (
													<div className={s.pr_option} key={o_idx}>
														<input
															type="radio"
															required
															className={s.pr_option_radio}
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
				</aside>
			</section>
		</main>
	)
}
