import { FIND_USER_PUBLISHED_CMPS } from "@/constants/subgraphQueries"
import { ApolloClient, InMemoryCache } from "@apollo/client"

export default function useUserCreatedCmps(userAddr: string) {
  async function initTable() {
    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })

    const userPubCmps = await client
      .query({
        query: FIND_USER_PUBLISHED_CMPS,
        variables: { userAddress: userAddr.toLowerCase() },
      })
      .then(async (data) => {
        return data.data.userAdded
      })
      .catch((err) => console.log("Error fetching data: ", err))
  }
  return <div>useUserCreatedCmps</div>
}
