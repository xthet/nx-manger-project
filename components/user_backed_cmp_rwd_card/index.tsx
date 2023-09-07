import crowdFunderABI from "@/constants/abis/CrowdFunder.json"
import { ConnectionContext } from "@/contexts/connection"
import { NotificationContext } from "@/contexts/notification"
import { useQUData } from "@/hooks/useQUData"
import useRwdCard from "@/hooks/useRwdCard"
import { conn } from "@/types"
import { BigNumber, ethers } from "ethers"
import onetime from "onetime"
import { useContext, useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useMediaQuery } from "react-responsive"
import { v4 } from "uuid"
import { InfoBox } from "../exportComps"
import Link from "next/link"
import RewardABI from "@/constants/abis/Reward.json"
import SurveyResponseForm from "@/containers/survey_response_form"

interface props {
	address: string
	id: number
	onEdit: boolean
}

export default function UserBackedCmpRwdCard({ address, id, onEdit }: props) {
	const { loading, setLoading, rwdDetails, deliDate, shipping, rwdAddress } =
		useRwdCard(address, id)
	const { isConnected, signer, isAuth, account, uNameVal }: conn =
		useContext(ConnectionContext)!
	const { dispatch } = useContext(NotificationContext)!
	const { uData } = useQUData(account)
	const isBigScreen = useMediaQuery({ query: "(min-width: 600px)" })
	const [donorValidated, setDonorValidated] = useState(false)
	const [respondedTo, setRespondedTo] = useState(false)
	const [showSF, setShowSF] = useState(true)

	async function validateDonor() {
		const reward = new ethers.Contract(rwdAddress, RewardABI.abi, signer)
		const donators = await reward.getDonators()
		if (donators.length > 0) {
			for (var don of donators) {
				if (don.toLowerCase() == account.toLowerCase()) {
					const survey_response = await reward.surveyResponses(don)
					if (survey_response) {
						setRespondedTo(true)
					}
					setDonorValidated(true)
				}
			}
		} else {
			setDonorValidated(false)
		}
	}
	useEffect(() => {
		account && rwdAddress && validateDonor().catch((e) => console.log(e))
	}, [account, rwdAddress, signer])

	return (
		<>
			{/* surveylink && showSF */}
			{rwdDetails.surveyLink && showSF && (
				<SurveyResponseForm
					link={rwdDetails.surveyLink}
					offMe={() => setShowSF(false)}
				/>
			)}
			<div
				className="rc-container fl-tl fl-c"
				style={donorValidated ? {} : { display: "none" }}
			>
				<div className="rc-id-del fl-tc fl-sb">
					<div className="rc-reward-id fl-cc">{`${
						loading ? "0" : ethers.utils.formatEther(rwdDetails.price)
					} ETH`}</div>
					<div className="rc-reward-del fl-bl fl-c">
						<p className="rc-reward-del-label">{"EST. DELIVERY"}</p>
						<p>{loading ? "" : deliDate}</p>
						{rwdDetails.quantity.toString() && !rwdDetails.infinite && (
							<>
								<div className="rc-rwd-qty-sep"></div>
								<p>{`${rwdDetails.quantity.toString()} left`}</p>
								<div className="rc-rwd-qty-sep"></div>
							</>
						)}
					</div>
				</div>

				<div className="rc-dets-cont fl-tl fl-sb">
					<article
						className="rc-details fl-tl fl-c"
						style={
							rwdDetails.pic !== "_NIL" && isBigScreen
								? { width: "60%" }
								: { width: "88%" }
						}
					>
						<h3 className="rc-title">
							{loading ? (
								<Skeleton style={{ width: "15vw" }} />
							) : (
								rwdDetails.title
							)}
						</h3>
						<p className="rc-description">
							{loading ? (
								<Skeleton style={{ width: "60%" }} />
							) : (
								rwdDetails.description
							)}
						</p>
						<div className="rc-perks-container">
							<h5
								style={
									rwdDetails &&
									rwdDetails.perks.length > 0 &&
									rwdDetails.perks[0] == ""
										? { display: "none" }
										: {}
								}
							>
								{"INCLUDES"}
							</h5>
							<ul className="rc-perks fl-tl fl-c">
								{loading || !(rwdDetails.perks.length > 0) ? (
									<Skeleton count={3} style={{ width: "15vw" }} />
								) : (
									rwdDetails.perks.map((perk, index) => {
										return (
											<li
												key={index}
												style={perk == "" ? { display: "none" } : {}}
											>
												{perk}
											</li>
										)
									})
								)}
							</ul>
						</div>
					</article>
					{rwdDetails.pic !== "_NIL" && (
						<div className="rc-img-cont">
							<img
								src={rwdDetails.pic.replace("ipfs://", "https://ipfs.io/ipfs/")}
								alt="--"
								className="rc-img"
							/>
						</div>
					)}
				</div>

				<div className="rc-input-container fl-bl fl-sb">
					{shipping ? (
						<div className="rc-reward-del fl-tl fl-c">
							<p className="rc-reward-del-label">{"SHIPS TO"}</p>
							<div className="fl-tl">
								{Array.isArray(shipping) ? (
									shipping.map((shipLoc: string, index: number) => {
										return <p key={index}>{shipLoc}</p>
									})
								) : (
									<p>{shipping}</p>
								)}
							</div>
						</div>
					) : (
						<p>{""}</p>
					)}

					{rwdDetails.surveyLink && !respondedTo && (
						<button
							className="rc-cta"
							onClick={() => {
								setShowSF(true)
							}}
						>
							Fill survey
						</button>
					)}
				</div>
			</div>
		</>
	)
}
