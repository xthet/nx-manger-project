import { useContext, useEffect, useState } from "react"
import { BigNumber, ethers } from "ethers"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import useRwdCard from "@/hooks/useRwdCard"
import { conn } from "@/types"
import { ConnectionContext } from "@/contexts/connection"
import crowdFunderABI from "@/constants/abis/CrowdFunder.json"
import { NotificationContext } from "@/contexts/notification"
import { v4 } from "uuid"
import onetime from "onetime"
import { InfoBox } from "../exportComps"
import { useQUData } from "@/hooks/useQUData"
import { useMediaQuery } from "react-responsive"

interface props {
	address: string
	id: number
	onEdit: boolean
}

export default function RewardCard({ address, id, onEdit }: props) {
	const { loading, setLoading, rwdDetails, deliDate, shipping, fundable } =
		useRwdCard(address, id)
	const { isConnected, signer, isAuth, account }: conn =
		useContext(ConnectionContext)!
	const { dispatch } = useContext(NotificationContext)!
	const [showSignUp, setShowSignUp] = useState(false)
	const { uData } = useQUData(account)
	const isBigScreen = useMediaQuery({ query: "(min-width: 600px)" })

	const handleFund = onetime(async (donation: BigNumber) => {
		// check if rwd is physical and auth b4 funding
		const crowdfunder = new ethers.Contract(
			crowdFunderABI.address,
			crowdFunderABI.abi,
			signer
		)
		try {
			const donateTx = await crowdfunder.donateToCampaign(address, true, {
				value: donation,
			})
			const donateTxR = await donateTx.wait(1)
			dispatch({
				type: "ADD_NOTI",
				payload: {
					id: v4(),
					type: "SUCCESS",
					title: "Donation Successful",
					message: `Your donation of ${ethers.utils.formatEther(
						donation
					)} ETH was made successfully`,
				},
			})
		} catch (error) {
			dispatch({
				type: "ADD_NOTI",
				payload: {
					id: v4(),
					type: "FAILED",
					title: "Donation Failed",
					message: `Your donation of ${ethers.utils.formatEther(
						donation
					)} ETH failed during processing 
          \nNB: You cannot donate to this campaign if you're its creator`,
				},
			})
			console.log(error)
		}
	})

	async function checkStatus(f: BigNumber) {
		if (isAuth) {
			if (uData && uData.shipAddr.length > 5) {
				handleFund(f)
			} else if (rwdDetails.shipsTo[0] == "_NW") {
				handleFund(f)
			} else {
				setShowSignUp(true)
			}
		} else {
			setShowSignUp(true)
		}
	}

	return (
		<>
			{showSignUp && (
				<InfoBox
					offMe={() => {
						setShowSignUp(false)
					}}
					msg={`This reward contains ${
						rwdDetails.shipsTo[0] == "_NW" ? "digital" : "physical"
					} items, we would need your ${
						rwdDetails.shipsTo[0] == "_NW"
							? "details"
							: isAuth
							? "contact address"
							: "details"
					} to fulfill its delivery.\n\nPlease ${
						isAuth ? "update your profile" : "sign up"
					}.`}
					cta={[
						`${isAuth ? "Update profile" : "Sign up"}`,
						`${isAuth ? "/settings" : "/signUp"}`,
					]}
				/>
			)}
			<div className="rc-container fl-tl fl-c">
				<div className="rc-id-del fl-tc fl-sb">
					<div className="rc-reward-id fl-cc">{`Pledge ${
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
					{/* <div className="rc-input">
          <p>{"Bonus support (optional)"}</p>
          <div className="rc-fund-container fl-cl">
            <div className="rc-inp fl-cl fl-sb">
              <p className="rc-inp-curr">{"ETH"}</p>
              <input type="number" />
            </div>
          </div>
        </div> */}
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
					{!onEdit && fundable && (
						<button
							className="rc-cta"
							onClick={() => {
								checkStatus(rwdDetails.price)
							}}
						>{`Donate ${
							loading ? "" : ethers.utils.formatEther(rwdDetails.price)
						} ETH`}</button>
					)}
				</div>
			</div>
		</>
	)
}
