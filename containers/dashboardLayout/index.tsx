import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import { cutStr } from "@/utils/cutStr"
import Link from "next/link"
import { ReactNode, useContext } from "react"
import s from "./dashboard_layout.module.sass"

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const { account, uNameVal, usrData }: conn = useContext(ConnectionContext)!

	return (
		<div className={s["db"]}>
			<aside className={s["db-side"]}>
				<Link href={`/dashboard/${uNameVal}/`}>
					<h3 className={s["db-sec-title"]}>{"Dashboard"}</h3>
				</Link>
				<div className={s["db-menu"]}>
					<Link href={`/dashboard/${uNameVal}/all_user_drafts_page`}>
						<span>{"Drafts"}</span>
					</Link>
					<Link href={`/settings/${account}`}>
						<span>{"Account Settings"}</span>
					</Link>
					<Link href={`/dashboard/${uNameVal}/all_user_created_page`}>
						<span>{"Campaigns Created"}</span>
					</Link>
					<Link href={`/dashboard/${uNameVal}/all_user_backed_page`}>
						<span>{"Campaigns Backed"}</span>
					</Link>
				</div>
				<Link href={`/profile/${uNameVal}`} className={s["db-user"]}>
					<div className={s["db-user"]}>
						<img
							src={usrData?.pfp.replace("ipfs://", "https://ipfs.io/ipfs/")}
							alt="--"
							className={s["db-pfp"]}
						/>
						<span>{cutStr(uNameVal, 14)}</span>
					</div>
				</Link>
			</aside>
			<main className={s["db-main"]}>{children}</main>
		</div>
	)
}
