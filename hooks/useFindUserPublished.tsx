import { FIND_USER_PUBLISHED_CMPS } from "@/constants/subgraphQueries"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useEffect, useState } from "react"

export default function useFindUserPublished(creator: string) {
	const [createdCampaigns, setCreatedCampaigns] = useState<any[]>([])

	useEffect(() => {
		async function findUserPublished() {
			const client = new ApolloClient({
				uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
				cache: new InMemoryCache(),
			})

			const cmps = await client
				.query({
					query: FIND_USER_PUBLISHED_CMPS,
					variables: { usrAddress: creator.toLowerCase() },
				})
				.then(async (data) => {
					return data.data.campaignAddeds
				})
				.catch((err) => console.log("Error fetching data: ", err))
			cmps && setCreatedCampaigns(cmps)
		}

		creator && findUserPublished().catch((e) => console.log(e))
	}, [creator])

	return {
		createdCampaigns,
	}
}
