import { ProfileContext } from "@/contexts/currentProfile"
import { useQUData } from "@/hooks/useQUData"
import { getDateFromTS } from "@/utils/getDateFromTS"
import { faEthereum, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faShareNodes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useContext } from "react"
import Blockies from "react-blockies"

export default function ProfileHeader() {
	const { currProfile, activeTab, setActiveTab, isOwnPage } =
		useContext(ProfileContext)!
	const { uData, uLoading, uNameVal } = useQUData(currProfile)

	return (
		<section className="crh-section sc-padding fl-cl fl-c">
			<div className="crh-bio fl-tl">
				<div className="crh-blck-dshbrd-grp fl-cl fl-c">
					{uData && uData.pfp && uData.pfp != "_NIL" ? (
						<img
							src={uData.pfp.replace("ipfs://", "https://ipfs.io/ipfs/")}
							alt="--"
							className="crh-pfp"
						/>
					) : (
						<Blockies
							seed={currProfile.toLowerCase()}
							scale={8}
							size={11}
							className="crh-jazzicon"
							color="#C4A2E7"
							bgColor="#361E77"
							spotColor="#fff"
						/>
					)}
				</div>
				<div className="crh-details fl-tl fl-c">
					<div className="crh-address fl-tl">
						<FontAwesomeIcon icon={faEthereum} className="crh-curr-icon" />
						<p>{uNameVal ? uNameVal : ""}</p>
					</div>
					{/* <p className="crh-username">{uLoading ? "" : uNameVal}</p> */}
					<p className="crh-name">{`Joined ${
						uData ? getDateFromTS(parseInt(uData.createdAt.toString())) : ""
					}`}</p>
					{uData && (
						<p className="crh-contribution">
							{`Created ${uData ? uData.publishedCount : ""} 
              campaign${
								uData ? (uData.created.length == 1 ? "" : "s") : ""
							} • Funded 
              ${uData ? uData.backedCount : ""} campaign${
								uData ? (uData.backed.length == 1 ? "" : "s") : ""
							}`}
						</p>
					)}
					{isOwnPage && (
						<Link href={`/dashboard/${uNameVal}`}>
							<button className="crh-dashboard-btn">{"Dashboard"}</button>
						</Link>
					)}
				</div>
			</div>

			<div className="crh-menu fl-tc">
				<div className="crh-tab-menu fl-cl">
					<h3
						className={`crh-tab-title ${
							activeTab == "CREATED" && "crh-active-tab"
						}`}
						onClick={() => {
							setActiveTab("CREATED")
						}}
					>
						{"CREATED"}
					</h3>
					<h3
						className={`crh-tab-title ${
							activeTab == "BACKED" && "crh-active-tab"
						}`}
						onClick={() => {
							setActiveTab("BACKED")
						}}
					>
						{"BACKED"}
					</h3>
				</div>

				<div className="crh-socials fl-cr">
					{/* <FontAwesomeIcon icon={faGlobe} className="crh-social-icon"/> */}
					{/* <Link href={uData && uData.twitter ? uData.twitter : "#"}>
            <FontAwesomeIcon icon={faTwitter} className="crh-social-icon"/>
          </Link> */}
					<FontAwesomeIcon icon={faShareNodes} className="crh-social-icon" />
				</div>
			</div>
		</section>
	)
}
