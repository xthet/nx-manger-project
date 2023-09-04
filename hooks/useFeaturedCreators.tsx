import { FIND_USER, GET_FEATURED_USERS } from "@/constants/subgraphQueries"
import { udata, usr } from "@/types"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useEffect, useState } from "react"

export default function useFeaturedCreators() {
	const [creators, setCreators] = useState<udata[]>([])

	useEffect(() => {
		async function getFeaturedUsers() {
			const client = new ApolloClient({
				uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
				cache: new InMemoryCache(),
			})

			const data = await client
				.query({
					query: GET_FEATURED_USERS,
				})
				.then(async (data) => {
					// console.log(data)
					return data.data.userAddeds
				})
				.catch((err) => console.log("Error fetching data: ", err))
			data && data.length > 0 && setCreators(data)
		}

		getFeaturedUsers().catch((e) => console.log(e))
	}, [])

	return {
		creators,
	}
}
