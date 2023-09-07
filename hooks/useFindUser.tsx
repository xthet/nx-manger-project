import { FIND_USER } from "@/constants/subgraphQueries"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useEffect, useState } from "react"

export default function useFindUser(uVal: string) {
	const [address, setAddress] = useState(
		"0x0000000000000000000000000000000000000000000000000"
	)

	useEffect(() => {
		async function findUser() {
			const client = new ApolloClient({
				uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
				cache: new InMemoryCache(),
			})

			const userData = await client
				.query({
					query: FIND_USER,
					variables: { name: uVal },
				})
				.then(async (data) => {
					return data.data.userAddeds[0]
				})
				.catch((err) => console.log("Error fetching data: ", err))
			userData && userData.id.length && setAddress(userData.address)
		}

		uVal && findUser().catch((e) => console.log(e))
	}, [uVal])

	return {
		address,
	}
}
