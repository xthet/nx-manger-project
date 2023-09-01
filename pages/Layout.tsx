import { Footer, Navbar } from "@/containers/exportConts"
import { useRouter } from "next/router"
import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
	const router = useRouter()

	return (
		<>
			<Navbar />
			<div className="p-full">{children}</div>
			{!router.pathname.includes("/dashboard/[user]") && <Footer />}
			{router.pathname.includes(
				"/dashboard/[user]/all_user_created_page/[user_single_cmp_created]"
			) && <Footer />}
		</>
	)
}
