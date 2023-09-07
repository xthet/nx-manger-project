import { ethers } from "ethers"
import { useContext, useEffect, useState } from "react"
import RewardABI from "@/constants/abis/Reward.json"
import { conn } from "@/types"
import { ConnectionContext } from "@/contexts/connection"

interface responder {
	address: string
	res_link: string
}

export default function useFindSurveyResponders(
	rwd_address: string,
	donators: string[]
) {
	const { isConnected, signer }: conn = useContext(ConnectionContext)!
	const [responders, setResponders] = useState<responder[]>([])

	useEffect(() => {
		async function findResponders() {
			const reward = new ethers.Contract(rwd_address, RewardABI.abi, signer)
			for (var donator of donators) {
				const res_link = await reward.surveyResponses(donator)
				if (res_link) {
					const res: responder = {
						address: donator,
						res_link: res_link.replace("ipfs://", "https://ipfs.io/ipfs/"),
					}
					setResponders((prev) => [...prev, res])
				}
			}
		}
		donators.length > 0 && findResponders().catch((e) => console.log(e))
	}, [rwd_address, donators, signer])

	return {
		responders,
	}
}
