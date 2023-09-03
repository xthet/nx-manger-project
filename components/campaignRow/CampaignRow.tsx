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
import { useContext } from "react"

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
						? { background: "#C8EFE9", color: "#47947D" }
						: campaignDetails.state == 1
						? { background: "amber" }
						: campaignDetails.state == 2
						? { background: "red" }
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
				<FontAwesomeIcon icon={faEthereum} className={s["db-tbl-act-icon"]} />
				<span>
					{Number(ethers.utils.formatEther(campaignDetails.currentBalance)) >=
					10
						? Number(
								ethers.utils.formatEther(campaignDetails.currentBalance)
						  ).toPrecision(4)
						: Number(
								Number(
									ethers.utils.formatEther(campaignDetails.currentBalance)
								).toFixed(3)
						  ).toPrecision(2)}
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
