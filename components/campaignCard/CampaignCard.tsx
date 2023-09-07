import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { faCubes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { cmp, conn } from "@/types"
import { BigNumber, ethers } from "ethers"
import Link from "next/link"
import { useCdata } from "@/hooks/useCdata"
import { useQCData } from "@/hooks/useQCData"
import Blockies from "react-blockies"
import { useRouter } from "next/router"

interface props {
	address: string
	creator: string
}

let cmpObject: cmp = {
	creator: "",
	title: "",
	description: "",
	category: "",
	tags: "",
	goalAmount: BigNumber.from("0"),
	duration: BigNumber.from("0"),
	currentBalance: BigNumber.from("0"),
	state: 0,
	imageURI: "",
	campaignURI: "",
	deadline: BigNumber.from("0"),
}

export default function CampaignCard({ address, creator }: props) {
	const {
		loading,
		campaignDetails,
		imageURI,
		imgLoad,
		setImgLoad,
		progress,
		daysUntil,
		deadlineStatement,
	} = useCdata(address)
	const { creatorVal, cDetails, dLoading, userDets } = useQCData(
		address,
		campaignDetails.creator
	)
	const router = useRouter()

	return (
		<div className="cc-container fl-cl fl-c">
			<div className="cc-img">
				{!imgLoad && (
					<Skeleton
						style={{ height: "100%", borderRadius: "1.39vw 1.39vw 0 0" }}
					/>
				)}
				<img
					src={imageURI}
					alt="cc-mckp"
					onLoad={() => {
						setImgLoad(true)
					}}
					style={!imgLoad ? { display: "none" } : {}}
					onClick={() => {
						router.push(`/campaigns/campaign/${address}`)
					}}
				/>
			</div>

			<div className="cc-details fl-cl fl-c">
				<div className="cc-cta fl-tc fl-sb">
					<div className="cc-cat-name fl-cl">
						<FontAwesomeIcon icon={faCubes} className="cc-cat-icon" />
						<Link
							href={`/campaigns${loading ? "" : "/"}${
								loading ? "" : campaignDetails.category
							}`}
						>
							{loading ? <Skeleton /> : campaignDetails.category}
						</Link>
					</div>
					<Link href={`/campaigns/campaign/${address}`}>
						<button className="fl-cc">{"Learn more..."}</button>
					</Link>
				</div>

				<div className="cc-camp-title fl-tl fl-c">
					<h4>{!loading ? campaignDetails.title : <Skeleton />}</h4>
					<p>
						{!loading ? campaignDetails.description : <Skeleton count={2} />}
					</p>
				</div>

				<div className="cc-status fl-cl fl-sb">
					<div className="cc-amounts fl-tl fl-c">
						<div className="cc-amt-raised fl-cl">
							<FontAwesomeIcon icon={faEthereum} className="cc-curr-icon" />
							<p className="cc-amt-figure">
								{Number(
									ethers.utils.formatEther(campaignDetails.currentBalance)
								) >= 10
									? Number(
											ethers.utils.formatEther(campaignDetails.currentBalance)
									  ).toPrecision(4)
									: Number(
											Number(
												ethers.utils.formatEther(campaignDetails.currentBalance)
											).toFixed(3)
									  )}
							</p>
							<p className="cc-amt-curr">{"ETH"}</p>
						</div>
						<div className="cc-goal">
							{`raised out of ${Number(
								ethers.utils.formatEther(campaignDetails.goalAmount)
							).toFixed(2)} ETH`}
						</div>
					</div>

					<div className="cc-progress-bar">
						<div
							className="cc-progress-level"
							style={{ width: `${progress >= 100 ? 100 : progress}%` }}
						></div>
					</div>

					<div className="cc-percent fl-bl fl-c">
						<p>{`${Math.ceil(progress) || 0}%`}</p>
						<p>{"funded"}</p>
					</div>
				</div>

				<div className="cc-creator-eta fl-cl fl-sb">
					<div className="cc-creator fl-cl">
						{userDets && userDets.pfp && userDets.pfp != "_NIL" ? (
							<img
								src={userDets.pfp.replace("ipfs://", "https://ipfs.io/ipfs/")}
								alt="--"
								className="cc-creator-pfp"
							/>
						) : (
							<Blockies
								seed={campaignDetails.creator.toLowerCase()}
								scale={3}
								size={7}
								className="cc-creator-jazzicon"
								color="#C4A2E7"
								bgColor="#361E77"
								spotColor="#fff"
							/>
						)}
						{userDets && (
							<Link
								href={`/profile/${campaignDetails ? userDets!.username : "#"}`}
							>
								<p>{creatorVal}</p>
							</Link>
						)}
					</div>
					<div className="cc-eta fl-tr">
						<p>{daysUntil <= 0 ? 0 : daysUntil}</p>
						<p>{"days to go"}</p>
					</div>
				</div>
			</div>
		</div>
	)
}
