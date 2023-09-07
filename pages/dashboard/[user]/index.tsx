import DashboardLayout from "@/containers/dashboardLayout"
import UserHome from "@/containers/user_home"
import { DashboardProvider } from "@/contexts/dashboard"
import Error from "next/error"
import { useRouter } from "next/router"

export default function User() {
	const router = useRouter()
	const { user } = router.query

	if (typeof user != "string") {
		return <Error statusCode={404} />
	}

	return (
		<DashboardLayout>
			<DashboardProvider owner={user}>
				<UserHome />
			</DashboardProvider>
		</DashboardLayout>
	)
}
