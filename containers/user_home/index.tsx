import s from "./user_home.module.sass"
import { ConnectionContext } from "@/contexts/connection"
import { DashboardContext } from "@/contexts/dashboard"
import { conn } from "@/types"
import { faChartSimple } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useContext } from "react"
import { cutStr } from "@/utils/cutStr"
import UserCreatedTab from "./user_created_tab"
import UserBackedTab from "./user_backed_tab"

export default function UserHome() {
	const { account, isAuth, uNameVal }: conn = useContext(ConnectionContext)!
	const { activeTab, setActiveTab } = useContext(DashboardContext)!

	return (
		<>
			<div className={s["db-main-header"]}>
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
			</div>
			{activeTab == "CREATED" && <UserCreatedTab />}
			{activeTab == "BACKED" && <UserBackedTab />}
		</>
	)
}
