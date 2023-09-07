import { CampaignEditorContext } from "@/contexts/campaignEditor"
import { ConnectionContext } from "@/contexts/connection"
import { conn, counOpt, teamCmpObj } from "@/types"
import getCountrySelect from "@/utils/getCountrySelect"
import { truncateStr } from "@/utils/truncateStr"
import fleek from "@fleekhq/fleek-storage-js"
import {
	faCaretLeft,
	faCircleCheck,
	faCirclePlus,
	faCircleXmark,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useContext, useEffect, useRef, useState } from "react"
import Select from "react-select"
import ReactLoading from "react-loading"
import { BigNumber, ethers } from "ethers"
import CrowdFunder from "@/constants/abis/CrowdFunder.json"
import Campaign from "@/constants/abis/Campaign.json"
import LinkToken from "@/constants/abis/LinkToken.json"
import TimeboxContracts from "@/constants/KeepersContractAddresses.json"
import { v4 } from "uuid"
import { NotificationContext } from "@/contexts/notification"
import { useQCData } from "@/hooks/useQCData"
import onetime from "onetime"
import { TimelineBox } from "@/components/exportComps"
import Blockies from "react-blockies"
import Link from "next/link"
import { useMediaQuery } from "react-responsive"

function hasKey<O extends object>(obj: O, key: PropertyKey): key is keyof O {
	return key in obj
}

export default function ETeamTab() {
	const {
		updateGrandCmp,
		setActiveTab,
		grandCmp,
		currAddress,
		setGrandURI,
		loading,
		ptitle,
		activeTab,
	} = useContext(CampaignEditorContext)!
	const { isConnected, connect, account, signer, isAuth, chainId }: conn =
		useContext(ConnectionContext)!
	const { dispatch } = useContext(NotificationContext)!
	const { cDetails } = useQCData(currAddress, account)
	const [counOptionsArr, setCounOptionsArr] = useState<counOpt[]>([])
	const [selectedOption, setSelectedOption] = useState<any>()
	const [location, setLocation] = useState("")
	const [addArr, setAddArr] = useState<string[]>([])
	const [currAddr, setCurrAddr] = useState("")
	const [cmpWeb, setCmpWeb] = useState("")
	const [cmpEmail, setCmpEmail] = useState("")
	const [cmpTwit, setCmpTwit] = useState("")
	const [cmpBio, setCmpBio] = useState("")
	const [isReady, setIsReady] = useState(false)
	const [creationFin, setCreationFin] = useState(false)
	const [ilinkBal, setILinkBal] = useState("")
	const [ilinkLdng, setIlinkLdng] = useState(false)

	const [showTBX, setShowTBX] = useState(false)
	const tlArr = [
		"Entering campaign info",
		"Sending info to contract",
		"Timeboxing",
		"Campaign Published",
	]
	const [tlIndex, setTlIndex] = useState(0)
	const [tlClosable, setTlClosable] = useState(false)

	const addiRef = useRef<HTMLButtonElement>(null)

	function modArr() {
		const uniqueArr: string[] = [...new Set(addArr)]
		return uniqueArr
	}

	function handleTeamSubmit() {
		if (cmpEmail && location && cmpBio) {
			const teamObj: teamCmpObj = {
				creators: modArr(),
				email: cmpEmail,
				website: cmpWeb,
				bio: cmpBio,
				location,
				twitter: cmpTwit ? cmpTwit : "_NIL",
			}
			updateGrandCmp(teamObj)
			setIsReady(true)
		}
	}

	function handleTeamSave() {
		const teamObj: teamCmpObj = {
			creators: modArr(),
			email: cmpEmail,
			website: cmpWeb,
			bio: cmpBio,
			location,
			twitter: cmpTwit ? cmpTwit : "_NIL",
		}
		updateGrandCmp(teamObj)
	}

	const uploadGrandCmp = onetime(async () => {
		setShowTBX(true)
		const timestamp = new Date().getTime()
		const grandCmpData = {
			apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY!,
			apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SEC!,
			key: `manger/grandCmpUplds/${truncateStr(account, 10)}/MNG_${timestamp}`,
			data: JSON.stringify(grandCmp),
		}
		const cmpContract = new ethers.Contract(currAddress, Campaign.abi, signer)

		try {
			const response = await fleek.upload(grandCmpData)
			setGrandURI(`ipfs://${response.hashV0}`)
			// sending to ct
			setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 1))

			const updateURITx = await cmpContract.updateCampaignURI(
				`ipfs://${response.hashV0}`
			)
			const updateTxR = await updateURITx.wait(1)
			setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 1))

			const crowdfunder = new ethers.Contract(
				CrowdFunder.address,
				CrowdFunder.abi,
				signer
			)

			if (
				hasKey(TimeboxContracts, chainId) &&
				cDetails &&
				!cDetails.isPublished
			) {
				const linkToken = new ethers.Contract(
					TimeboxContracts[chainId].linkToken,
					LinkToken.abi,
					signer
				)
				const fundTx = await linkToken.transfer(
					TimeboxContracts[chainId].upkeepCreator,
					ethers.utils.parseEther("2")
				)
				const fundTxR = await fundTx.wait(1)
				console.log(currAddress)
				const publishTx = await crowdfunder.publishCampaign(
					currAddress,
					TimeboxContracts[chainId].upkeepCreator,
					TimeboxContracts[chainId].linkToken
				)
				const publishTxR = publishTx.wait(1)
				setCreationFin(true)
			}
			setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 2))

			setCreationFin(true)
			localStorage.removeItem("staticGrandCmp")
			dispatch({
				type: "ADD_NOTI",
				payload: {
					id: v4(),
					type: "SUCCESS",
					title: "Campaign Published Successfully",
					message: "Your campaign has been published successfully",
				},
			})
		} catch (error) {
			dispatch({
				type: "ADD_NOTI",
				payload: {
					id: v4(),
					type: "FAILED",
					title: "Campaign Publish Failed",
					message: "Sorry ;) we could not publish this campaign",
				},
			})
			console.log(error)
			setShowTBX(false)
			setTlIndex(0)
		}
	})

	useEffect(() => {
		const counArr = getCountrySelect()
		const newArr = counArr.slice(1, counArr.length)
		setCounOptionsArr(newArr)
	}, [])

	useEffect(() => {
		selectedOption && setLocation(selectedOption.value)
	}, [selectedOption])

	useEffect(() => {
		function findCmp() {
			const findGrandCmp = JSON.parse(localStorage.getItem("staticGrandCmp")!)
			if (!loading && findGrandCmp) {
				setAddArr(findGrandCmp.creators)
				setCmpEmail(findGrandCmp.email)
				setCmpWeb(findGrandCmp.website)
				setCmpBio(findGrandCmp.bio)
				setLocation(findGrandCmp.location)
				setSelectedOption({
					value: findGrandCmp.location,
					label: findGrandCmp.location,
				})
				setCmpTwit(findGrandCmp.twitter == "_NIL" ? "" : findGrandCmp.twitter)
			}
		}
		setTimeout(() => {
			findCmp()
		}, 1000)
	}, [grandCmp, ptitle])

	useEffect(() => {
		// console.log(grandCmp)
		isReady && uploadGrandCmp()
	}, [grandCmp, isReady])

	useEffect(() => {
		if (creationFin) {
			localStorage.removeItem("basicsObj")
			localStorage.removeItem("contentObj")
			localStorage.removeItem("rewardsObj")
			localStorage.removeItem("grandcmp")
			localStorage.removeItem("staticGrandCmp")
			localStorage.removeItem("teamObj")
			localStorage.removeItem("eCurrTab")
		}
	}, [creationFin])

	useEffect(() => {
		async function getLinkBal() {
			if (hasKey(TimeboxContracts, chainId)) {
				setIlinkLdng(true)
				const linkCt = new ethers.Contract(
					TimeboxContracts[chainId].linkToken,
					LinkToken.abi,
					signer
				)
				try {
					const linkBal = await linkCt.balanceOf(account)
					setILinkBal(ethers.utils.formatEther(BigNumber.from(linkBal)))
					setIlinkLdng(false)
				} catch (error) {
					console.log(error)
					setIlinkLdng(false)
				}
			} else {
				setILinkBal("-")
			}
		}

		const inr = setInterval(() => {
			getLinkBal().catch((e) => console.log(e))
		}, 10000)
		return () => {
			clearInterval(inr)
		}
	}, [account, activeTab])

	return (
		<>
			{!currAddress ? (
				<div className="ct-denial">
					<p>
						{"You need an existing campaign smart contract to add team details"}
					</p>
					<ReactLoading type="bubbles" color="#827B93" />
					<button
						className="ct-notice-btn"
						onClick={() => {
							setActiveTab("Basics")
						}}
					>
						<FontAwesomeIcon
							icon={faCaretLeft}
							className="ct-notice-left-icon"
						/>
						{"Back to Basics"}
					</button>
				</div>
			) : (
				<div className="ct-tab" id="team-tab">
					{/* <div className="ct-heading">
              <h2 className="ct-title">{"Team"}</h2>
              <p className="ct-subtitle">
                {"If other people are helping you with your campaign, " +
          "add their wallet addresses below. They will be represented on " +
          "your campaign page as members of your team."}
              </p>
              <div className="ct-card-sep"></div>
            </div> */}

					<div className="ct-container">
						<div className="ct-submit">
							<button
								className="ct-submit-btn"
								onClick={() => {
									handleTeamSave()
								}}
							>
								{"Save"}
							</button>
						</div>
						<div className="ct-card">
							<div className="ct-card-heading">
								<h2 className="ct-card-title">{"Team"}</h2>
								<div className="ct-card-sep"></div>
							</div>
							<p className="ct-card-subtitle">
								{"If other people are helping you with your campaign, " +
									"add their wallet addresses below. They will be represented on " +
									"your campaign page as members of your team."}
							</p>

							<div className="tt-members-inpt-grp">
								<p className="tt-inpt-label">{"Wallet address:"}</p>
								<div className="tt-members-inpt-list-grp">
									<div className="tt-address-inpt-grp">
										<input
											type="text"
											name="wallet"
											className="tt-address-inpt"
											onChange={(e) => {
												setCurrAddr(e.target.value)
											}}
											value={currAddr}
										/>
										<FontAwesomeIcon
											icon={faCirclePlus}
											className="tt-add-member-icon"
											onClick={() => {
												typeof currAddr == "string" &&
													currAddr.includes("0x") &&
													currAddr.length == 42 &&
													setAddArr((prev) => [...prev, currAddr.toLowerCase()])
												setCurrAddr("")
											}}
										/>
									</div>
									<div className="tt-members-list">
										<ul>
											{modArr().map((addr, index) => {
												return (
													<div className="tt-member-grp" key={index}>
														<li className="tt-member">
															{truncateStr(addr, 14)}
														</li>
														<FontAwesomeIcon
															icon={faCircleXmark}
															className="tt-del-member-icon"
															onClick={() => {
																addArr.splice(index, 1)
																setAddArr((prev) => [...addArr])
															}}
														/>
													</div>
												)
											})}
										</ul>
									</div>
								</div>
							</div>
						</div>

						<form
							className="rt-card-form"
							onSubmit={(e) => {
								e.preventDefault()
							}}
						>
							<div className="ct-card-heading">
								<h2 className="ct-card-title">{"Additional Info"}</h2>
								<div className="ct-card-sep"></div>
							</div>

							<div className="rt-form-inpt-grp">
								<p className="rt-form-inpt-label">{"Email:"}</p>
								<div className="rt-form-inpt-sm-grp">
									<small>{"What email should backers use to reach you?"}</small>
									<input
										type="email"
										name="t-email"
										className="rt-form-inpt"
										onChange={(e) => {
											setCmpEmail(e.target.value)
										}}
										value={cmpEmail}
										required
									/>
									<small style={{ color: "orange" }}>{"required"}</small>
								</div>
							</div>

							<div className="rt-form-inpt-grp">
								<p className="rt-form-inpt-label">{"Campaign Website:"}</p>
								<div className="rt-form-inpt-sm-grp">
									<small>{"Does your campaign have a website?"}</small>
									<input
										type="text"
										name="t-web"
										className="rt-form-inpt"
										onChange={(e) => {
											setCmpWeb(e.target.value)
										}}
										value={cmpWeb}
									/>
								</div>
							</div>

							<div className="rt-form-inpt-grp">
								<p className="rt-form-inpt-label">{"Twiiter page:"}</p>
								<div className="rt-form-inpt-sm-grp">
									<small>
										{"Does your campaign have an official twitter page?"}
									</small>
									<input
										type="text"
										name="t-twit"
										className="rt-form-inpt"
										placeholder="https://www.twitter.com/username"
										value={cmpTwit}
										onChange={(e) => {
											setCmpTwit(e.target.value)
										}}
									/>
								</div>
							</div>

							<div className="rt-form-inpt-grp">
								<p className="rt-form-inpt-label">{"Location:"}</p>
								<div className="rt-form-inpt-sm-grp">
									<small>{"Where are you making this campaign from?"}</small>
									<Select
										options={counOptionsArr}
										onChange={setSelectedOption}
										value={selectedOption}
										className="tt-form-select"
										placeholder="Select location"
										hideSelectedOptions={false}
									/>
									<small style={{ color: "orange" }}>{"required"}</small>
								</div>
							</div>

							<div className="rt-form-inpt-grp">
								<p className="rt-form-inpt-label">{"Team bio:"}</p>
								<div className="rt-form-inpt-sm-grp">
									<small>{"Tell us about your campaign team"}</small>
									<textarea
										name="t-bio"
										className="rt-form-inpt"
										cols={91}
										rows={3}
										onChange={(e) => {
											setCmpBio(e.target.value)
										}}
										value={cmpBio}
										required
									/>
									<small style={{ color: "orange" }}>{"required"}</small>
								</div>
							</div>
							<button type="submit" hidden ref={addiRef}></button>
						</form>
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

						{cDetails && !cDetails.published && (
							<div className="ct-card">
								<div className="ct-card-heading">
									<h2 className="ct-card-title">{"Timeboxing"}</h2>
									<div className="ct-card-sep"></div>
								</div>
								<p className="tt-card-subtitle">
									{
										"To publish your campaign, you would need to fund its duration tracker (i.e. Chainlink Keepers) with some Chainlink LINK Token, ensure you have at least 2 LINK in your balance. If you don't, you could "
									}
									{chainId == "1" ? (
										<i className="tt-get-link">{"Swap some ETH for LINK"}</i>
									) : (
										<a
											href="https://faucets.chain.link/"
											target="_blank"
											rel="noopener noreferrer"
											className="tt-get-link"
										>
											{"get some LINK here"}
										</a>
									)}
								</p>
								<div className="tt-link-bal-wrp">
									<p className="tt-link-dets">{"LINK token balance:"}</p>
									<div className="tt-link-bal-cont">
										<div className="tt-link-bal-usr">
											<Blockies
												seed={account}
												scale={3}
												size={8}
												className="ub-jazzicon"
												color="#C4A2E7"
												bgColor="#361E77"
												spotColor="#fff"
											/>
											<p>{truncateStr(account, 14)}</p>
										</div>
										<img
											src="/assets/chainlink-link-logo.svg"
											alt="--"
											className="tt-link-logo"
										/>
										<p className="tt-link-bal">{ilinkBal + " LINK"}</p>
										{ilinkLdng ? (
											<ReactLoading
												type="bubbles"
												color="#827B93"
												width={22}
												height={22}
											/>
										) : Number(ilinkBal) > 2 ? (
											<FontAwesomeIcon
												icon={faCircleCheck}
												className="tt-link-check"
											/>
										) : (
											<Link
												href={
													chainId == "1" ? "#" : "https://faucets.chain.link/"
												}
												target={chainId == "1" ? "_self" : "_blank"}
											>
												<button className="tt-get-link-btn">
													{"GET LINK"}
												</button>
											</Link>
										)}
									</div>
								</div>
							</div>
						)}
						<div className="tt-cta">
							<button
								className="tt-cta-btn"
								onClick={(e) => {
									addiRef.current!.click()
									handleTeamSubmit()
								}}
							>
								{"Publish Campaign"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
