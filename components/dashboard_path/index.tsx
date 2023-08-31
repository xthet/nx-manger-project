import Link from "next/link"
import { useRouter } from "next/router"
import s from "./dashboard_path.module.sass"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretRight } from "@fortawesome/free-solid-svg-icons"
import { useCdata } from "@/hooks/useCdata"

export default function DashboardPath() {
	const router = useRouter()
	const pathArray = router.asPath.split("/")
	const modArray = router.asPath.split("/")
	const { campaignDetails } = useCdata(modArray[4])
	modArray[modArray.indexOf("dashboard")] = "Dashboard"
	modArray[modArray.indexOf("all_user_created_page")] = "Campaigns Created"
	modArray[modArray.indexOf("all_user_backed_page")] = "Campaigns Backed"
	modArray[2] = "Dashboard"
	modArray[4] = campaignDetails.title

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
						<FontAwesomeIcon icon={faCaretRight} className={s.caret} />
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
