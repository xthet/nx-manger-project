import {
	GET_CAMPAIGN_DETAILS,
	GET_USER_DETAILS,
} from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { conn, udata } from "@/types"
import { truncateStr } from "@/utils/truncateStr"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useContext, useEffect, useState } from "react"

export function useQCData(cAddress: string, creator: string) {
	const { isConnected, signer }: conn = useContext(ConnectionContext)!
	const [creatorVal, setCreatorVal] = useState("")
	const [dLoading, setDloading] = useState(true)
	const [cDetails, setCDetails] = useState<any>()
	const [userDets, setUserDets] = useState<udata>()
	useEffect(() => {
		let isIn = true
		async function getUserDetails() {
			const client = new ApolloClient({
				uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
				cache: new InMemoryCache(),
			})

			const userData = await client
				.query({
					query: GET_USER_DETAILS,
					variables: { userAddress: creator.toLowerCase() },
				})
				.then(async (data) => {
					return data.data.userAdded
				})
				.catch((err) => console.log("Error fetching data: ", err))
			if (userData == null || userData.username == null) {
				setCreatorVal(
					truncateStr(
						creator ? creator : "0x00000000000000000000000000000000000000000",
						10
					)
				)
			} else {
				isIn && setCreatorVal(userData.username)
			}
			userData && isIn && setUserDets(userData)
		}

		isIn && getUserDetails().catch((e) => console.log(e))
		return () => {
			isIn = false
		}
	}, [isConnected, creator, creatorVal])

	useEffect(() => {
		let isIn = true
		async function getCmpData() {
			const client = new ApolloClient({
				uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
				cache: new InMemoryCache(),
			})

			const cDets = await client
				.query({
					query: GET_CAMPAIGN_DETAILS,
					variables: {
						campaignAddress: cAddress
							? cAddress.toLowerCase()
							: "0x00000000000000000000000000000000000000000",
					},
				})
				.then(async (data) => data.data.campaignAdded)
				.catch((err) => console.log("Error fetching data: ", err))

			isIn && cDets && setCDetails(cDets)
			isIn && cDets && setDloading(false)
		}

		isIn && getCmpData().catch((e) => console.log(e))
		return () => {
			isIn = false
		}
	}, [isConnected, cAddress])

	return {
		creatorVal,
		cDetails,
		userDets,
		dLoading,
	}
}
