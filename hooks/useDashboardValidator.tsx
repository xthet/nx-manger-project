import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import Error from "next/error"
import { useRouter } from "next/router"
import { useContext } from "react"

export default function useDashboardValidator() {
	const router = useRouter()
	const owner = router.asPath.split("/")[2]
	const { uNameVal }: conn = useContext(ConnectionContext)!
	let validated

	if (owner && owner != uNameVal) {
		validated = false
	} else {
		validated = true
	}

	return { validated }
}
