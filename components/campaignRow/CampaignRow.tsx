import { useCdata } from "@/hooks/useCdata"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import s from "./campaign_row.module.sass"
import { useRouter } from "next/router"
import Link from "next/link"
import { conn } from "@/types"
import { ConnectionContext } from "@/contexts/connection"
import { useContext, useEffect, useState } from "react"

export default function CampaignRow({
	address,
	created,
}: {
	address: string
	created: boolean
}) {
	const { uNameVal }: conn = useContext(ConnectionContext)!
	const { campaignDetails, imageURI, daysUntil } = useCdata(address)
	const router = useRouter()

	return (
		<div className={s["db-tbl-rw"]}>
			<span className={s["db-tbl-rw-ele"]}>
				<img src={imageURI} alt="--" className={s["db-tbl-rw-img"]} />
				<span>{campaignDetails.title}</span>
			</span>
			<span
				className={`${s["db-tbl-rw-ele"]} ${s["--status"]}`}
				style={
					campaignDetails.state == 0
						? {
								background: "#52fc00",
								color: "#1c6156",
								opacity: "0.7",
						  }
						: campaignDetails.state == 1
						? {
								background: "#ffbf00",
								color: "#624900",
								opacity: "0.7",
						  }
						: campaignDetails.state == 2
						? {
								background: "#ff1414",
								color: "#760000",
								opacity: "0.7",
						  }
						: {}
				}
			>
				{campaignDetails.state == 0
					? "Fundraising"
					: campaignDetails.state == 1
					? "Expired"
					: campaignDetails.state == 2
					? "Canceled"
					: "--"}
			</span>
			<span className={`${s["db-tbl-rw-ele"]}  ${s["--eta"]}`}>
				{daysUntil <= 0 ? 0 : daysUntil}
			</span>
			<span className={s["db-tbl-rw-ele"]}>
				{/* <FontAwesomeIcon icon={faEthereum} className={s["db-tbl-act-icon"]} /> */}
				<span>
					{Number(ethers.utils.formatEther(campaignDetails.currentBalance)) >=
					10
						? Number(
								ethers.utils.formatEther(campaignDetails.currentBalance)
						  ).toPrecision(4)
						: Number(
								Number(
									ethers.utils.formatEther(campaignDetails.currentBalance)
								).toFixed(4)
						  ).toPrecision(3)}
				</span>
			</span>

			<span className={`${s["db-tbl-rw-ele"]} ${s["--options"]}`}>
				{created && (
					<Link href={`/edit-campaign/${address}`}>
						<span className={s["db-tbl-details"]}>{"Edit"}</span>
					</Link>
				)}
				<Link
					href={`/dashboard/${uNameVal}/all_user_${
						created ? "created" : "backed"
					}_page/${address}`}
				>
					<span className={s["db-tbl-details"]}>{"Details"}</span>
				</Link>
			</span>
		</div>
	)
}
