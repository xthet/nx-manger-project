import { FIND_USER } from "@/constants/subgraphQueries"
import { ProfileDetails, ProfileHeader } from "@/containers/exportConts"
import { ProfileProvider } from "@/contexts/currentProfile"
import useFindUser from "@/hooks/useFindUser"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import Error from "next/error"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ReactLoading from "react-loading"


export default function Profile() {
  const router = useRouter()
  const { profile } = router.query
  // const { address } = useFindUser("nootbox")

  const [address, setAddress] = useState("0x0000000000000000000000000000000000000000000000000")

  useEffect(()=>{
    async function findUser(){
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
        cache: new InMemoryCache(),
      })
      
      const userData = await client
        .query({
          query: FIND_USER,
          variables: { name: profile }
        })
        .then(async (data) => {return data.data.userAddeds[0]})
        .catch(err => console.log("Error fetching data: ", err))
      userData && userData.id.length && setAddress(userData.address)
    }
  
    profile && (typeof(profile) == "string") && profile.length >= 5 && findUser().catch(e=>console.log(e))
  },[profile])

  return (
    <>
      <Head>
        <title>{"Manger | Profile"}</title>
        <meta name="description" content="Manger Project - Fundraising on the blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>
      {
        !profile 
          ? <ReactLoading type="bubbles" color="#827B93"/> 
          : typeof(profile) == "string" && profile.length >= 5
            ? <>
              <ProfileProvider address={address}>
                <ProfileHeader/>
                <ProfileDetails/>
              </ProfileProvider>
            </>
            : <Error statusCode={404}/>
      }


    </>
  )
}
