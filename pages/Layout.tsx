import { Footer, Navbar } from "@/containers/exportConts"
import Head from "next/head"
import { useRouter } from "next/router"
import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
	const router = useRouter()

	return (
		<>
			<Head>
				<title>Manger | Fundraising on the blockchain</title>
				<meta
					name="description"
					content="Manger Project - Fundraising on the blockchain"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/assets/manger_favicon.svg" />
			</Head>
			<Navbar />
			<div className="p-full">{children}</div>
			{!router.pathname.includes("/dashboard/[user]") && <Footer />}
			{router.pathname.includes(
				"/dashboard/[user]/all_user_created_page/[user_single_cmp_created]"
			) && <Footer />}
			{router.pathname.includes(
				"/dashboard/[user]/all_user_backed_page/[user_single_cmp_backed]"
			) && <Footer />}
		</>
	)
}
