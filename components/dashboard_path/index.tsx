import Link from "next/link"
import { useRouter } from "next/router"
import s from "./dashboard_path.module.sass"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretRight } from "@fortawesome/free-solid-svg-icons"
import { useCdata } from "@/hooks/useCdata"
import useRwdCard from "@/hooks/useRwdCard"

export default function DashboardPath() {
	const router = useRouter()
	const pathArray = router.asPath.split("/")
	const modArray = router.asPath.split("/")
	const campaign_address = router.asPath.split("/")[4]
	const r_id = Number(router.asPath.split("/")[5])
	const { rwdDetails, rwdAddress } = useRwdCard(campaign_address, r_id)
	const { campaignDetails } = useCdata(modArray[4])
	modArray[modArray.indexOf("dashboard")] = "Dashboard"
	modArray[modArray.indexOf("all_user_created_page")] = "Campaigns Created"
	modArray[modArray.indexOf("all_user_backed_page")] = "Campaigns Backed"
	modArray[modArray.indexOf("create_survey")] = "Create Survey"
	modArray[2] = "Dashboard"
	modArray[4] = campaignDetails.title
	modArray[5] = rwdDetails.title

	// console.log(pathArray)
	return (
		<div className={s.section}>
			{pathArray.map((page, idx) => {
				return (
					<Link
						href={pathArray.slice(0, idx + 1).join("/")}
						key={idx}
						style={idx < 2 ? { display: "none" } : {}}
						className={s.link}
					>
						{modArray[idx]}
						<FontAwesomeIcon
							icon={faCaretRight}
							className={s.caret}
							style={idx == pathArray.length - 1 ? { display: "none" } : {}}
						/>
					</Link>
				)
			})}
			{/* <Link href={`/${pathArray[1]}/${pathArray[2]}`}>{pathArray[1]}</Link>
			<FontAwesomeIcon icon={faCaretRight} />
			<Link href={`/${pathArray[1]}/${pathArray[2]}/${pathArray[3]}`}>
				{pathArray[3]}
			</Link>
			<FontAwesomeIcon icon={faCaretRight} />
			<Link
				href={`/${pathArray[1]}/${pathArray[2]}/${pathArray[3]}/${pathArray[4]}`}
			>
				{pathArray[4]}
			</Link> */}
		</div>
	)
}
