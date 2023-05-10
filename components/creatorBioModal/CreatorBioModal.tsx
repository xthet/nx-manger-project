import { FIND_USERS } from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { useQUData } from "@/hooks/useQUData"
import { conn, fcmp } from "@/types"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"

interface userType {
  username: string
}

export default function CreatorBioModal({ data, offMe }:{data:fcmp, offMe:Function}) {
  const { isConnected, connect, account, signer, isAuth, chainId }:conn = useContext(ConnectionContext)!
  const { uData } = useQUData(data.creator)
  const [sptCreators, setSptCreators] = useState<userType[]>([])

  useEffect(()=>{
    async function findCreators(){
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
        cache: new InMemoryCache(),
      })
      
      const users = await client
        .query({
          query: FIND_USERS,
          variables: { addresses: data.creators }
        })
        .then(data => data.data.userAddeds)
        .catch(err => console.log("Error fetching data: ", err))

      users && (users.length > 0) && setSptCreators(users)
    }
    data && (data.creators.length > 0) && findCreators().catch(e=>console.log(e))
  },[data])

  return (
    <>
      <div className="tbx-reactive" onClick={()=>{offMe()}}></div>
      <div className="cbm-modal">
        <p className="cbm-title">{"About the creator"}</p>
        {uData && <div className="cbm-creator">
          <h2>{"@" + uData!.username}</h2>
          <p>{data.location}</p>
        </div>}
        <p className="--tbx-bio"><p>{data.bio}</p></p>
        <div className="cbm-contacts">
          <span className="cbm-contact --socials">
            {uData && <Link href={`/profile/${uData!.username}`}>
              <img src="/assets/manger_bio_logo.svg" alt="--" className="cbm-social-icon"/>
            </Link>}
            <Link href={data.website}>
              <FontAwesomeIcon icon={faGlobe} className="cbm-social-icon"/>
            </Link>
            <Link href={data.twitter}>
              <FontAwesomeIcon icon={faTwitter} className="cbm-social-icon"/>
            </Link>
          </span>
          {isAuth && <span className="cbm-contact">
            <FontAwesomeIcon icon={faEnvelope} className="cbm-email-icon"/>
            <span>{data.email}</span>
          </span>}

        </div>

        <div className="cbm-other-creators">
          {sptCreators.length > 0 && <p className="cbm-oc-title">{"Supporting Creators:"}</p>}
          <div className="cbm-creators-cont">
            {sptCreators &&
              sptCreators.map((creator, index:number)=>{
                return (
                  <span key={index} className="cbm-spt-creator">
                    {"@" + creator.username}
                  </span>
                  
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}
