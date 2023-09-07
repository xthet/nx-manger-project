import { FIND_USER_DRAFT_CMPS } from "@/constants/subgraphQueries"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useEffect, useState } from "react"

export default function useFindUserDrafts(creator: string) {
	const [drafts, setDrafts] = useState<any[]>([])

	useEffect(() => {
		async function findUserDrafts() {
			const client = new ApolloClient({
				uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
				cache: new InMemoryCache(),
			})

			const cmps = await client
				.query({
					query: FIND_USER_DRAFT_CMPS,
					variables: { cmpAddress: creator },
				})
				.then(async (data) => {
					return data.data.campaignAddeds
				})
				.catch((err) => console.log("Error fetching data: ", err))
			cmps && setDrafts(cmps)
		}

		creator && findUserDrafts().catch((e) => console.log(e))
	}, [creator])

	return {
		drafts,
	}
}
