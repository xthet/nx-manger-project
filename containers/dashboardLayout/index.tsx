import { ConnectionContext } from "@/contexts/connection"
import { DashboardContext } from "@/contexts/dashboard"
import { conn } from "@/types"
import { faChartSimple } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { ReactNode, useContext } from "react"
import { DshbBacked, DshbCreated } from "../exportConts"
import { cutStr } from "@/utils/cutStr"
import s from "./dashboard_layout.module.sass"

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const { account, isAuth, uNameVal }: conn = useContext(ConnectionContext)!
	// const { activeTab, setActiveTab } = useContext(DashboardContext)!

	return (
		<div className={s["db"]}>
			<aside className={s["db-side"]}>
				<Link href={`/profile/${uNameVal}/dashboard`}>
					<h3 className={s["db-sec-title"]}>{"Dashboard"}</h3>
				</Link>
				<div className={s["db-menu"]}>
					<span>{"Drafts"}</span>
					<Link href={`/settings/${account}`}>
						<span>{"Account Settings"}</span>
					</Link>
					<Link href={`/profile/${uNameVal}/dashboard/createdPage`}>
						<span>{"Campaigns Created"}</span>
					</Link>
					<Link href={`/profile/${uNameVal}/dashboard/backedPage`}>
						<span>{"Campaigns Backed"}</span>
					</Link>
				</div>
				<Link href={`/profile/${uNameVal}`} className={s["db-user"]}>
					<div className={s["db-user"]}>
						<img src="/re3.jpg" alt="--" className={s["db-pfp"]} />
						<span>{cutStr(uNameVal, 14)}</span>
					</div>
				</Link>
			</aside>
			<main className={s["db-main"]}>
				{children}
				{/* <div className={s["db-main-header"]}>
					<div className={s["db-crt-dnt"]}>
						<div
							className={`${s["db-tab-indic"]} ${
								activeTab == "BACKED" ? s["--next"] : ""
							}`}
						></div>
						<span
							onClick={() => {
								setActiveTab("CREATED")
							}}
						>
							{"Created"}
						</span>
						<span
							onClick={() => {
								setActiveTab("BACKED")
							}}
						>
							{"Backed"}
						</span>
					</div>
					<Link href={"/create-campaign"}>
						<button className={s["db-hdr-cta"]}>
							<FontAwesomeIcon
								icon={faChartSimple}
								className={s["db-hdr-cta-icon"]}
							/>
							{"Start a campaign"}
						</button>
					</Link>
				</div> */}
				{/* {activeTab == "CREATED" && <DshbCreated />}
				{activeTab == "BACKED" && <DshbBacked />} */}
			</main>
		</div>
	)
}
