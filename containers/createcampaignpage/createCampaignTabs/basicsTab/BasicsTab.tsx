import { CatTable, TimelineBox } from "@/components/exportComps"
import CrowdFunder from "@/constants/abis/CrowdFunder.json"
import { CampaignCreatorContext } from "@/contexts/campaignCreator"
import { ConnectionContext } from "@/contexts/connection"
import { NotificationContext } from "@/contexts/notification"
import { basicCmpObj, conn } from "@/types"
import { truncateStr } from "@/utils/truncateStr"
import fleek from "@fleekhq/fleek-storage-js"
import {
	faAngleDown,
	faImages,
	faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BigNumber, ethers } from "ethers"
import onetime from "onetime"
import { useContext, useEffect, useRef, useState } from "react"
import ReactLoading from "react-loading"
import { v4 } from "uuid"

export default function BasicsTab() {
	const {
		activeTab,
		setActiveTab,
		setNewCampaignAddr,
		grandCmp,
		updateGrandCmp,
		newCampaignAddr,
	} = useContext(CampaignCreatorContext)!
	const { isConnected, connect, account, signer, isAuth }: conn =
		useContext(ConnectionContext)!
	const { dispatch } = useContext(NotificationContext)!
	const [showImgNoti, setShowImgNoti] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	const [scbtn, setScbtn] = useState(false)
	// const [saveWarn, setSaveWarn] = useState(false)
	// useWarnIfUnsavedChanges(!saveWarn)
	const [imgState, setImgState] = useState("unset")
	const [cmpTitle, setCmpTitle] = useState("")
	const [cmpTagLine, setCmpTagLine] = useState("")
	const [showCatTable, setShowCatTable] = useState(false)
	const [currCat, setCurrCat] = useState("")
	const [currTag, setCurrTag] = useState("")
	const [tagArr, setTagArr] = useState<string[]>([])
	const [tagNotice, setTagNotice] = useState(false)
	const [imgURLToBe, setImgURLToBe] = useState("")
	const [goalAmount, setGoalAmount] = useState("")
	const [dur, setDur] = useState("1")
	const [durNotice, setDurNotice] = useState(false)

	const [showTBX, setShowTBX] = useState(false)
	const tlArr = [
		"Entering campaign info",
		"Creating smart contract",
		"Awaiting confirmation",
		"Smart contract created",
	]
	const [tlIndex, setTlIndex] = useState(0)
	const [tlClosable, setTlClosable] = useState(false)

	const tagInput = useRef<HTMLInputElement>(null)

	function checkKey(e: any) {
		if (e.key == "Enter") {
			e.preventDefault()
			tagInput.current!.value = ""
			if (tagArr.length <= 3) {
				setTagArr((prev) => [...prev, currTag])
			}
		}
	}

	async function uploadImg(e: any) {
		const date = new Date()
		const timestamp = date.getTime()
		const imgData = {
			apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY!,
			apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SEC!,
			key: `manger/cmpImgUploads/${truncateStr(
				account,
				10
			)}/MNG_${cmpTitle}_${timestamp}`,
			data: e.target.files[0],
		}
		try {
			const tme = setTimeout(() => {
				setShowImgNoti(true)
			}, 10000)
			const response = await fleek.upload(imgData)
			clearTimeout(tme)
			setImgURLToBe(`ipfs://${response.hashV0}`)
			setImgState("finished")
		} catch (error) {
			console.log(error)
		}
	}

	const handleBasicsSubmit = onetime(async () => {
		setScbtn(true)
		setShowTBX(true)
		setTimeout(() => {
			setScbtn(false)
		}, 15000)
		let campaignAddress: string
		if (currCat && tagArr.length > 0 && imgURLToBe) {
			// entering campaign info
			const crowdfunder = new ethers.Contract(
				CrowdFunder.address,
				CrowdFunder.abi,
				signer
			)
			try {
				// creating campaign smart contract
				setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 1))
				const creationTx = await crowdfunder.addCampaign({
					_title: cmpTitle,
					_description: cmpTagLine,
					_category: currCat,
					_tags: tagArr.slice(0, 3).join("/"),
					_goalAmount: ethers.utils.parseEther(goalAmount),
					_duration: BigNumber.from(~~dur * 86400),
					_imageURI: imgURLToBe,
				})
				// awaiting confirmation
				setTlIndex((prev) => (prev > tlArr.length ? prev : prev + 1))
				const creationTxR = await creationTx.wait(1)
				campaignAddress = creationTxR.events![0].args!._campaignAddress
				console.log(campaignAddress)

				const basicsObj: basicCmpObj = {
					campaign: campaignAddress,
					creator: account,
					title: cmpTitle,
					tagline: cmpTagLine,
					category: currCat,
					tags: tagArr.slice(0, 3),
					imageURI: imgURLToBe,
					visualURI: imgURLToBe,
					goalAmount: ethers.utils.parseEther(goalAmount),
					duration: BigNumber.from(parseInt(dur) * 86400),
				}
				updateGrandCmp(basicsObj)
				localStorage.setItem("basicsObj", JSON.stringify(basicsObj))

				setNewCampaignAddr(campaignAddress)
				// smart contract created
				setTlIndex((prev) => (prev > tlArr.length ? prev : prev + 2))
				// setSubmitted(true)
				setTimeout(() => {
					setActiveTab("Rewards")
				}, 1000)
			} catch (error) {
				dispatch({
					type: "ADD_NOTI",
					payload: {
						id: v4(),
						type: "FAILURE",
						title: "Error",
						message:
							"Campaign smart contract creation failed \nMake sure you entered all the required info",
					},
				})
				console.log(error)
				setShowTBX(false)
			}
		} else {
			dispatch({
				type: "ADD_NOTI",
				payload: {
					id: v4(),
					type: "FAILURE",
					title: "Error",
					message:
						"Campaign smart contract creation failed \nMake sure you entered all the required info",
				},
			})
			console.log("not all parameters fulfilled")
			setShowTBX(false)
		}
	})

	useEffect(() => {
		if (tagArr.length <= 3) {
			setTagNotice(false)
		} else {
			setTagNotice(true)
			setTimeout(() => setTagNotice(false), 3000)
		}
	}, [tagArr])

	useEffect(() => {
		const basicRec = localStorage.getItem("basicsObj")
		if (basicRec) {
			const recObj: basicCmpObj = JSON.parse(basicRec)
			setCmpTitle(recObj.title)
			setCmpTagLine(recObj.tagline)
			setCurrCat(recObj.category)
			setDur(
				(
					parseInt(ethers.utils.formatUnits(recObj.duration, 0)) / 86400
				).toString()
			)
			setGoalAmount(ethers.utils.formatEther(recObj.goalAmount))
			setTagArr(recObj.tags)
			setImgURLToBe(recObj.imageURI)
			setImgState("finished")
			updateGrandCmp(recObj)
		}
	}, [])

	useEffect(() => {
		imgState == "finished" && setShowImgNoti(false)
	}, [imgState])

	useEffect(() => {
		localStorage.setItem("grandCmp", JSON.stringify(grandCmp))
	}, [grandCmp])

	return (
		<div className="bt-tab fl-tl fl-c" id="basics">
			<div className="bt-heading fl-tl fl-c">
				<h2 className="bt-title">{"Basics"}</h2>
				<p className="bt-subtitle">
					{"Make a good first impression: introduce your campaign " +
						"objectives and entice people to learn more. " +
						"This basic information will represent your campaign " +
						"on your campaign page, on your campaign card, and in searches. " +
						"Once published, you will only be able to change your campaign duration"}
				</p>
				<div className="bt-card-sep"></div>
			</div>

			<form
				className="bt-form-container fl-cl fl-c"
				onSubmit={(e) => {
					e.preventDefault()
					!durNotice && handleBasicsSubmit()
				}}
			>
				{/* campaign title */}
				<div className="bt-card fl-tl fl-c ">
					<div className="bt-card-heading">
						<h2 className="bt-card-title">{"Campaign Title"}</h2>
						<div className="bt-card-sep"></div>
					</div>
					<p className="bt-card-subtitle">
						{"What is the title of your campaign?"}
					</p>
					<div className="bt-card-input fl-bl fl-c">
						<input
							type="text"
							className="bt-card-txt-input"
							maxLength={50}
							onChange={(e) => {
								setCmpTitle(e.target.value)
							}}
							value={cmpTitle}
							required
						/>
						<p className="bt-card-char-count">{50 - cmpTitle.length}</p>
					</div>
				</div>

				{/* campaign tagline */}
				<div className="bt-card fl-tl fl-c ">
					<div className="bt-card-heading">
						<h2 className="bt-card-title">{"Campaign Tagline"}</h2>
						<div className="bt-card-sep"></div>
					</div>
					<p className="bt-card-subtitle">
						{
							"Provide a short description that describes your campaign to your audience."
						}
					</p>
					<div className="bt-card-input fl-bl fl-c">
						<textarea
							name="bt-tagline"
							id="bt-tagline"
							cols={91}
							rows={2}
							className="bt-card-txt-ta"
							maxLength={100}
							onChange={(e) => {
								setCmpTagLine(e.target.value)
							}}
							value={cmpTagLine}
							required
						></textarea>
						<p className="bt-card-char-count">{100 - cmpTagLine.length}</p>
					</div>
				</div>

				{/* campaign image */}
				<div className="bt-card fl-tl fl-c" id="bt-ipfs-upld">
					<div className="bt-card-heading">
						<h2 className="bt-card-title">{"Campaign Card Image"}</h2>
						<div className="bt-card-sep"></div>
					</div>
					<p className="bt-card-subtitle">
						{"Upload a square image that represents your campaign. " +
							"640 x 640px is the recommended and minimun resolution."}
					</p>
					<div className="bt-card-img-input fl-cl fl-c">
						<input
							type="file"
							id="bt-card-img"
							hidden
							onChange={(e) => {
								uploadImg(e)
								setImgState("loading")
							}}
							required
						/>
						<label htmlFor="bt-card-img" className="bt-img-label">
							<div className="bt-img-container fl-cc">
								{imgState == "loading" ? (
									<ReactLoading type="bubbles" color="#827B93" />
								) : imgState == "finished" ? (
									imgURLToBe && (
										<img
											src={imgURLToBe.replace(
												"ipfs://",
												"https://ipfs.io/ipfs/"
											)}
											alt="--"
										/>
									)
								) : (
									<FontAwesomeIcon
										icon={faImages}
										className="bt-card-img-icon"
									/>
								)}
							</div>
						</label>
					</div>
					{showImgNoti && (
						<small className="inpt-small-noti">
							{
								"The network is congested right now, Image upload may take a while"
							}
						</small>
					)}
				</div>

				{/* campaign category */}
				<div className="bt-card fl-tl fl-c" id="bt-cats">
					<div className="bt-card-heading">
						<h2 className="bt-card-title">{"Category"}</h2>
						<div className="bt-card-sep"></div>
					</div>
					<p className="bt-card-subtitle">
						{
							"To help backers find your campaign, select a category that best represents your project."
						}
					</p>
					<div className="bt-card-select fl-cl fl-sb">
						<div className="bt-card-categories fl-cl">
							<span className="bt-card-category fl-cc">
								<p>{currCat}</p>
							</span>
							<CatTable
								showTable={showCatTable}
								setCurrCat={setCurrCat}
								setShowTable={setShowCatTable}
							/>
						</div>
						<FontAwesomeIcon
							icon={faAngleDown}
							className="bt-card-select-icon"
							onClick={() => {
								setShowCatTable((prev) => !prev)
							}}
						/>
					</div>
				</div>

				{/* campaign tags */}
				<div className="bt-card fl-tl fl-c ">
					<div className="bt-card-heading">
						<h2 className="bt-card-title">{"Tags"}</h2>
						<div className="bt-card-sep"></div>
					</div>
					<p className="bt-card-subtitle">
						{"Enter up to three keywords that best describe your campaign. " +
							"These tags will help with organization and discoverability."}
					</p>
					<div className="bt-card-select fl-cl hide">
						<div className="bt-card-tags fl-cl">
							{tagArr.slice(0, 3).map((tag, index) => {
								return (
									<span className="bt-card-tag fl-cc" key={index}>
										<p>{tag}</p>
										<FontAwesomeIcon
											icon={faXmark}
											className="bt-xmark-icon"
											onClick={() => {
												tagArr.splice(index, 1)
												setTagArr((prev) => [...tagArr])
											}}
										/>
									</span>
								)
							})}
						</div>
						<input
							ref={tagInput}
							type="text"
							className="bt-tag-input"
							maxLength={20}
							placeholder="Enter a few tags for your c..."
							onChange={(e) => {
								setCurrTag(e.target.value)
							}}
							onKeyDown={(e) => {
								checkKey(e)
							}}
						/>
					</div>
					<p
						className="bt-card-char-count"
						style={
							tagNotice
								? { display: "block", color: "red" }
								: { display: "none" }
						}
					>
						{"You can only enter up to three keywords"}
					</p>
				</div>

				{/* campaign goal */}
				<div className="bt-card fl-tl fl-c ">
					<div className="bt-card-heading">
						<h2 className="bt-card-title">{"Campaign Goal"}</h2>
						<div className="bt-card-sep"></div>
					</div>
					<p className="bt-card-subtitle">
						{"How much do you aim to raise from this campaign?"}
					</p>
					<div className="bt-card-fund fl-cl">
						{"ETH"}
						<input
							type="number"
							className="bt-card-fund-input"
							onChange={(e) => {
								setGoalAmount(e.target.value)
							}}
							value={goalAmount}
							required
						/>
					</div>
				</div>
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
				{/* campaign duration */}
				<div className="bt-card fl-tl fl-c ">
					<div className="bt-card-heading">
						<h2 className="bt-card-title">{"Campaign Duration"}</h2>
						<div className="bt-card-sep"></div>
					</div>
					<p className="bt-card-subtitle">
						{"How many days will you be running your campaign for? You can run a campaign " +
							"for any number of days, with a 60-day duration maximum. " +
							"Keep in mind that you will be able to extend as many times as you want " +
							"up until the 60th day duration maximum!"}
					</p>
					<div className="bt-card-input fl-tl fl-c">
						<input
							type="number"
							className="bt-card-num-input"
							onChange={(e) => {
								parseInt(e.target.value) > 60
									? setDurNotice(true)
									: setDurNotice(false)
								setDur(e.target.value)
							}}
							value={dur}
							min={1}
							max={60}
							required
						/>
					</div>
					<p
						className="bt-card-char-count"
						style={
							durNotice
								? { display: "block", color: "red" }
								: { display: "none" }
						}
					>
						{"You may only set up to 60 days"}
					</p>
				</div>

				<div className="bt-submit fl-cr">
					<button type="submit" className="bt-submit-btn">
						{"Save & Continue"}
					</button>
				</div>
			</form>
		</div>
	)
}
