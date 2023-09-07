import { CatTable, TimelineBox } from "@/components/exportComps"
import { ConnectionContext } from "@/contexts/connection"
import { basicCmpObj, conn } from "@/types"
import {
	faAngleDown,
	faImages,
	faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useRef, useState } from "react"
import fleek from "@fleekhq/fleek-storage-js"
import { truncateStr } from "@/utils/truncateStr"
import { BigNumber, ethers } from "ethers"
import { CampaignEditorContext } from "@/contexts/campaignEditor"
import Campaign from "@/constants/abis/Campaign.json"
import ReactLoading from "react-loading"
import { useWarnIfUnsavedChanges } from "@/hooks/useWarnIfUnsavedChanges"
import { useCdata } from "@/hooks/useCdata"
import onetime from "onetime"

export default function EBasicsTab() {
	const { activeTab, setActiveTab, updateGrandCmp, currAddress } = useContext(
		CampaignEditorContext
	)!
	const { isConnected, connect, account, signer, isAuth }: conn =
		useContext(ConnectionContext)!
	const { loading, campaignDetails, deadlineStatement } = useCdata(currAddress)
	const [submitted, setSubmitted] = useState(false)
	// useWarnIfUnsavedChanges(!submitted)
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
	const [addableDur, setAddableDur] = useState("0")
	const [durNotice, setDurNotice] = useState(false)

	const [showTBX, setShowTBX] = useState(false)
	const tlArr = [
		"Updating campaign info",
		"Awaiting confirmation",
		"Duration updated",
	]
	const [tlIndex, setTlIndex] = useState(0)
	const [tlClosable, setTlClosable] = useState(false)

	const tagInput = useRef<HTMLInputElement>(null)

	async function checkNewDur(days: number) {
		await campaignDetails.duration
		if (campaignDetails && campaignDetails.duration) {
			if (days * 86400 + campaignDetails.duration.toNumber() > 5184000) {
				setDurNotice(true)
			} else {
				setDurNotice(false)
			}
		}
	}

	async function maxAddableDur() {
		if (campaignDetails && campaignDetails.duration) {
			const maxAddable = 5184000 - campaignDetails.duration.toNumber()
			setAddableDur(Math.floor(maxAddable / 86400).toString())
		}
	}

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
			key: `cmpImgUploads/${truncateStr(account, 10)}/${cmpTitle}_${timestamp}`,
			data: e.target.files[0],
		}
		try {
			const response = await fleek.upload(imgData)
			setImgURLToBe(`ipfs://${response.hashV0}`)
			setImgState("finished")
		} catch (error) {
			console.log(error)
		}
	}

	const handleDurUpdate = onetime(async () => {
		if (Number(addableDur) && Number(addableDur) > 0) {
			const morphedDur = Number(addableDur) * 86400
			setShowTBX(true)
			// updatng smma con
			const cmpCntrt = new ethers.Contract(currAddress, Campaign.abi, signer)
			try {
				// awaiting confi
				setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 1))
				const updateDurTx = await cmpCntrt.updateDur(BigNumber.from(morphedDur))
				const updateDurTxR = await updateDurTx.wait(1)
				// dur updated
				setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 2))
			} catch (error) {
				console.log(error)
				setShowTBX(false)
			}
		}
		setActiveTab("Rewards")
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
		if (campaignDetails) {
			setCmpTitle(campaignDetails.title)
			setCmpTagLine(campaignDetails.description)
			setCurrCat(campaignDetails.category)
			setGoalAmount(ethers.utils.formatEther(campaignDetails.goalAmount))
			setTagArr(campaignDetails.tags.split("/"))
			setImgURLToBe(campaignDetails.imageURI)
			setImgState("finished")
		}
	}, [loading])

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
			{loading ? (
				<ReactLoading type="bubbles" color="#827B93" />
			) : (
				<form
					className="bt-form-container fl-cl fl-c"
					onSubmit={(e) => {
						e.preventDefault()
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
								maxLength={80}
								onChange={(e) => {
									setCmpTitle(e.target.value)
								}}
								value={cmpTitle}
								disabled
							/>
							<p className="bt-card-char-count">{80 - cmpTitle.length}</p>
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
								disabled
							></textarea>
							<p className="bt-card-char-count">{100 - cmpTagLine.length}</p>
						</div>
					</div>

					{/* campaign image */}
					<div className="bt-card fl-tl fl-c ">
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
								disabled
							/>
							<label
								htmlFor="bt-card-img"
								className="bt-img-label bt-inpt-disabled"
							>
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
												alt="img-uploaded"
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
						<div className="bt-card-select fl-cl fl-sb disabled">
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
							{/* <FontAwesomeIcon icon={faAngleDown} className="bt-card-select-icon" 
              onClick={()=>{setShowCatTable(prev=>!prev)}}
            /> */}
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
						<div className="bt-card-select fl-cl hide disabled">
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
								disabled
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
								disabled
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
					<div className="bt-card fl-tl fl-c" id="id-updt-dur">
						<div className="bt-card-heading">
							<h2 className="bt-card-title">{"Update Campaign Duration"}</h2>
							<div className="bt-card-sep"></div>
						</div>
						<p className="bt-card-subtitle">
							{"This campaign is bound to expire on "}
							{<i style={{ color: "indigo" }}>{`${deadlineStatement}`}</i>}
							{", input the desired number of days you wish to add to the current deadline. " +
								"NB: you can only extend this campaign up to 60 days total."}
						</p>
						<div className="bt-card-input fl-cl">
							<input
								type="number"
								className="bt-card-num-input"
								onChange={(e) => {
									checkNewDur(parseInt(e.target.value))
									setAddableDur(e.target.value)
								}}
								value={addableDur}
								min={1}
								max={60}
							/>

							<button
								className="bt-dur-max"
								onClick={() => {
									maxAddableDur()
								}}
							>
								{"MAX"}
							</button>
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
						<button
							type="submit"
							className="bt-submit-btn"
							onClick={() => {
								!durNotice && handleDurUpdate()
							}}
						>
							{"Save & Continue"}
						</button>
					</div>
				</form>
			)}
		</div>
	)
}
