import {
	FIND_USER_PUBLISHED_CMPS,
	GET_BACKED_CAMPAIGNS,
	GET_CREATED_CAMPAIGNS,
} from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { CmpObject, conn } from "@/types"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useCallback, useContext, useEffect, useState } from "react"

export default function useProfile(type: string, profile: string) {
	const { isConnected, account }: conn = useContext(ConnectionContext)!
	const [cldng, setCldng] = useState(false)
	const [campaigns, setCampaigns] = useState<CmpObject[]>([])

	const callProfileCreated = async () => {
		const client = new ApolloClient({
			uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
			cache: new InMemoryCache(),
		})

		let cmpForGrid: CmpObject[] = []
		let recicampaigns: string[] = []
		setCldng(true)
		recicampaigns = await client
			.query({
				query: FIND_USER_PUBLISHED_CMPS,
				variables: { usrAddress: profile.toLowerCase() },
			})
			.then((data) => {
				if (data.data.campaignAddeds) {
					return data.data.campaignAddeds
				} else {
					return []
				}
			})
			.catch((error) => console.log(error))

		function mutateCampaigns(val: any, index: number) {
			const x: CmpObject = {
				campaignAddress: val.campaignAddress,
				creator: profile,
			}
			cmpForGrid.push(x)
		}

		recicampaigns.length > 0 && recicampaigns.forEach(mutateCampaigns)
		setCampaigns(cmpForGrid)
		setCldng(false)
	}

	const callProfileBacked = async () => {
		const client = new ApolloClient({
			uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
			cache: new InMemoryCache(),
		})

		let cmpForGrid: CmpObject[] = []
		let recicampaigns: string[] = []
		setCldng(true)
		recicampaigns = await client
			.query({
				query: GET_BACKED_CAMPAIGNS,
				variables: { profile: profile.toLowerCase() },
			})
			.then((data) => {
				if (data.data.userAdded) {
					return data.data.userAdded.backed
				} else {
					return []
				}
			})
			.catch((error) => console.log(error))

		function mutateCampaigns(val: string, index: number) {
			const x: CmpObject = { campaignAddress: val, creator: profile }
			cmpForGrid.push(x)
		}

		recicampaigns.length > 0 && recicampaigns.forEach(mutateCampaigns)
		setCampaigns(cmpForGrid)
		setCldng(false)
	}

	useEffect(() => {
		if (type == "Created") {
			profile && callProfileCreated().catch((e) => console.log(e))
		} else if (type == "Backed") {
			profile && callProfileBacked().catch((e) => console.log(e))
		}
	}, [isConnected, profile, account])

	return {
		campaigns,
		cldng,
	}
}
