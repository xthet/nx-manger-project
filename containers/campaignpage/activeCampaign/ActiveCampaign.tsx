import { faEthereum, faTwitter } from "@fortawesome/free-brands-svg-icons"
import {
	faCubes,
	faGlobe,
	faShareNodes,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useCdata } from "@/hooks/useCdata"
import { useQCData } from "@/hooks/useQCData"
import { useURIData } from "@/hooks/useURIData"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { CampaignContext } from "@/contexts/currentCampaign"
import { useQUData } from "@/hooks/useQUData"

interface props {
	click: Function
	setPTitle: Function
}

export default function ActiveCampaign({ click, setPTitle }: props) {
	const { currAddress, currState } = useContext(CampaignContext)!
	const router = useRouter()
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

	useEffect(() => {
		campaignDetails && campaignDetails.title && setPTitle(campaignDetails.title)
	}, [loading])

	return (
		<section className="acp-section sc-padding fl-tl">
			<div className="acp-bg">
				<img
					src={imageURI}
					alt="cc-mckp"
					onLoad={() => {
						setImgLoad(true)
					}}
					style={!imgLoad ? { display: "none" } : {}}
				/>
				<div className="acp-bg-grad"></div>
			</div>

			<div className="acp-img fl-cc">
				{!visLoaded && (
					<Skeleton
						style={{ height: "21vw", width: "44vw", borderRadius: "15px" }}
						className="acp-skl"
					/>
				)}
				<img
					src={
						cdata
							? cdata.visualURI.replace("ipfs://", "https://ipfs.io/ipfs/")
							: ""
					}
					alt="cc-mckp"
					onLoad={() => {
						setVisLoaded(true)
					}}
					style={!visLoaded ? { display: "none" } : {}}
				/>
			</div>

			<div className="acp-details fl-tl fl-c">
				<div className="acp-camp-title fl-tl fl-c">
					<h4>
						{loading ? (
							<Skeleton style={{ width: "13vw" }} />
						) : (
							campaignDetails.title
						)}
					</h4>
					<p>
						{loading ? (
							<Skeleton count={2} style={{ width: "10vw" }} />
						) : (
							campaignDetails.description
						)}
					</p>
				</div>

				<div className="acp-status-container fl-tl fl-c">
					<div className="acp-progress-bar">
						<div
							className="acp-progress-level"
							style={{ width: `${progress >= 100 ? 100 : progress}%` }}
						></div>
					</div>

					<div className="acp-status fl-cl fl-sb">
						<div className="acp-amounts fl-tl fl-c">
							<div className="acp-amt-raised fl-cl">
								<FontAwesomeIcon icon={faEthereum} className="acp-curr-icon" />
								<p className="acp-amt-figure">
									{Number(
										ethers.utils.formatEther(campaignDetails.currentBalance)
									) >= 10
										? Number(
												ethers.utils.formatEther(campaignDetails.currentBalance)
										  ).toPrecision(4)
										: Number(
												ethers.utils.formatEther(campaignDetails.currentBalance)
										  ).toFixed(4)}
								</p>
								<p className="acp-amt-curr">{"ETH"}</p>
							</div>
							<div className="acp-goal">
								{`raised out of ${Number(
									ethers.utils.formatEther(campaignDetails.goalAmount)
								).toPrecision(2)} ETH`}
							</div>
						</div>

						<div className="acp-percent fl-bl fl-c">
							<p>{dLoading ? 0 : cDetails.funderCount}</p>
							<p>{"backers"}</p>
						</div>

						<div className="acp-percent fl-bl fl-c">
							<p>{daysUntil <= 0 ? 0 : daysUntil}</p>
							<p>{"days to go"}</p>
						</div>
					</div>
				</div>

				{currState == 0 && (
					<button
						className="acp-fund-cta"
						onClick={() => {
							router.push(`${router.asPath}#cmpdetails`)
							click()
						}}
						disabled={campaignDetails && campaignDetails.state != 0}
					>
						{"Fund this project"}
					</button>
				)}

				<div className="acp-bio fl-cl fl-sb">
					<div className="acp-bio-native fl-cl">
						<div
							className="acp-cat-name fl-cl"
							onClick={() => {
								router.push(
									`/campaigns/${
										campaignDetails ? campaignDetails.category : ""
									}`
								)
							}}
						>
							<FontAwesomeIcon icon={faCubes} className="acp-cat-icon" />
							{campaignDetails.category}
						</div>
						<Link href={`/profile/${userDets ? userDets.username : "#"}`}>
							<div className="acp-creator fl-cl">
								<img src="/assets/manger_bio_logo.svg" alt="bio-logo" />
								<p>{creatorVal}</p>
							</div>
						</Link>
					</div>

					<div className="acp-bio-socials fl-cr">
						{cdata && cdata.twitter && (
							<Link href={`${cdata.twitter}`} className="acp-social-icon">
								<FontAwesomeIcon icon={faTwitter} />
							</Link>
						)}
						{cdata && cdata.website && (
							<Link href={cdata.website} className="acp-social-icon">
								<FontAwesomeIcon icon={faGlobe} />
							</Link>
						)}
						<FontAwesomeIcon icon={faShareNodes} className="acp-social-icon" />
					</div>
				</div>

				<div className="acp-info">
					{currState == 0 ? (
						<p>{`Risk involved: Donations will no longer be refundable when this project expires by ${deadlineStatement}.`}</p>
					) : currState == 1 ? (
						<p className="acp-expired-info">
							<span>{"Campaign Complete!!"}</span>
							<span>{`${cDetails && cDetails.funderCount} backer${
								cDetails && cDetails.funderCount == 1 ? "" : "s"
							} donated to help bring this project to life.`}</span>
						</p>
					) : (
						<p className="acp-expired-info">
							<span>{"Campaign Canceled!!"}</span>
							<span>{"This campaign has been cancelled by its creator"}</span>
						</p>
					)}
				</div>
			</div>
		</section>
	)
}
