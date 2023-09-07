import { useContext, useState } from "react"
import s from "./payout_box.module.sass"
import { CampaignContext } from "@/contexts/currentCampaign"
import { useRouter } from "next/router"
import { useCdata } from "@/hooks/useCdata"
import { useURIData } from "@/hooks/useURIData"
import { useQCData } from "@/hooks/useQCData"
import { cutStr } from "@/utils/cutStr"
import { ethers } from "ethers"
import CampaignABI from "@/constants/abis/Campaign.json"
import { ConnectionContext } from "@/contexts/connection"
import { NotificationContext } from "@/contexts/notification"
import { v4 } from "uuid"

export default function PayoutBox() {
	const { account, isAuth, uNameVal, signer } = useContext(ConnectionContext)!
	const { currAddress, currState } = useContext(CampaignContext)!
	const router = useRouter()
	const { dispatch } = useContext(NotificationContext)!

	const {
		loading,
		campaignDetails,
		imageURI,
		imgLoad,
		setImgLoad,
		progress,
		daysUntil,
		deadlineStatement,
	} = useCdata(currAddress)
	const { cdata, visLoaded, setVisLoaded } = useURIData(currAddress)
	const { creatorVal, cDetails, dLoading, userDets } = useQCData(
		currAddress,
		campaignDetails.creator
	)
	const [ATC, setATC] = useState(false)

	async function payout() {
		const contract = new ethers.Contract(currAddress, CampaignABI.abi, signer)
		try {
			const pytTx = await contract.payout()
			await pytTx.wait(1)
			dispatch({
				type: "ADD_NOTI",
				payload: {
					id: v4(),
					type: "SUCCESS",
					title: "Withdrawal Successful",
					message: "Thanks for choosing Manger!!",
				},
			})
		} catch (error) {
			console.log(error)
			dispatch({
				type: "ADD_NOTI",
				payload: {
					id: v4(),
					type: "FAILURE",
					title: "Withdrawal Failed",
					message: "An error occurred during processing..",
				},
			})
		}
	}

	return (
		<section className={s.pyt_cont}>
			<h3>Payout Summary</h3>
			<div
				className={s.pyt_dets}
				style={campaignDetails.state !== 1 ? { opacity: "0.8" } : {}}
			>
				<div className={s.cmp_dets}>
					<img
						src={campaignDetails.imageURI.replace(
							"ipfs://",
							"https://ipfs.io/ipfs/"
						)}
						alt="--"
						className={s.cmp_img}
					/>
					<div className={s.earnings_dets}>
						<p>{cutStr(campaignDetails.title, 28)}</p>
						<div className={s.earnings}>
							<span>Earnings:</span>
							<span>
								{ethers.utils.formatEther(campaignDetails.currentBalance)}{" "}
								<span className={s.curr}>ETH</span>
							</span>
						</div>
					</div>
				</div>

				<div className={s.pyt_breakdown}>
					<div className={s.amt_dets}>
						<span className={s.amt_det}>Gross:</span>
						<span>
							{Number(
								ethers.utils.formatEther(campaignDetails.currentBalance)
							).toFixed(6)}{" "}
							<span className={s.curr}>ETH</span>
						</span>
					</div>

					<div className={s.amt_dets}>
						<span className={s.amt_det}>Processing Fee (4%):</span>
						<span>
							{(
								Number(
									ethers.utils.formatEther(campaignDetails.currentBalance)
								) * 0.04
							).toFixed(6)}{" "}
							<span className={s.curr}>ETH</span>
						</span>
					</div>
				</div>

				<div className={s.pyt_final}>
					<p>Payout</p>
					<span>
						{(
							Number(ethers.utils.formatEther(campaignDetails.currentBalance)) -
							Number(ethers.utils.formatEther(campaignDetails.currentBalance)) *
								0.04
						).toFixed(6)}{" "}
						<span className={s.curr}>ETH</span>
					</span>
				</div>

				<div className={s.pyt_notice}>
					{campaignDetails.state == 1
						? `Payments will be made to the address and network used to create this
					campaign.`
						: `Payouts are not available until campaign duration expires`}
				</div>

				<button
					className={s.withdraw_btn}
					disabled={campaignDetails.state !== 1 || !ATC}
					onClick={() => ATC && payout()}
				>
					Withdraw
				</button>

				<div className={s.tc}>
					<input
						type="checkbox"
						disabled={campaignDetails.state !== 1}
						onChange={(e) => {
							setATC(e.target.checked)
						}}
					/>
					<span>{`I agree to Manger's Terms of Service`}</span>
				</div>
			</div>
		</section>
	)
}
