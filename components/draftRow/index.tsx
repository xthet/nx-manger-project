import { useCdata } from "@/hooks/useCdata"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import s from "./draft_row.module.sass"

export default function DraftRow({ address }: { address: string }) {
	const { campaignDetails, imageURI, daysUntil } = useCdata(address)

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
				<FontAwesomeIcon icon={faPencil} className={s["db-tbl-act-icon"]} />
				{/* <FontAwesomeIcon icon={faTrash} className={s["db-tbl-act-icon"]}/> */}
				<span className={s["db-tbl-details"]}>{"Edit"}</span>
			</span>
		</div>
	)
}
