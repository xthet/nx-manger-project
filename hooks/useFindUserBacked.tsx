import { FIND_USER_BACKED_CMPS } from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useContext, useEffect, useState } from "react"

export default function useFindUserBacked() {
	const { usrData }: conn = useContext(ConnectionContext)!

	const [backedCampaigns, setBackedCampaigns] = useState<any[]>([])

	useEffect(() => {
		async function findUserBacked() {
			const client = new ApolloClient({
				uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
				cache: new InMemoryCache(),
			})

			const cmps = await client
				.query({
					query: FIND_USER_BACKED_CMPS,
					variables: { cmpAddresses: usrData?.backed },
				})
				.then(async (data) => {
					return data.data.campaignAddeds
				})
				.catch((err) => console.log("Error fetching data: ", err))
			cmps && setBackedCampaigns(cmps)
		}

		usrData && usrData.backed && findUserBacked().catch((e) => console.log(e))
	}, [usrData])

	return {
		backedCampaigns,
	}
}
