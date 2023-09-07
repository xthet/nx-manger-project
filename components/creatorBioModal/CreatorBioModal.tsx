import { FIND_USERS } from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { useQUData } from "@/hooks/useQUData"
import { conn, fcmp } from "@/types"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faGlobe, faLocationDot, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import Blockies from "react-blockies"

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
        .then(data => {return data.data.userAddeds})
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
        <FontAwesomeIcon icon={faXmark} className="cbm-cancel" onClick={()=>{offMe()}}/>
        {uData && <div className="cbm-creator">
          {uData && uData.pfp && (uData.pfp != "_NIL") ? <img src={uData.pfp.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="--" className="cbm-pfp"/>
            : <Blockies seed={account.toLowerCase()} scale={8} size={11} 
              className="crh-jazzicon" color="#C4A2E7" bgColor="#361E77" 
              spotColor="#fff"
            />}
          <div className="cbm-creator-dets">
            <Link href={`/profile/${uData.username}`}>
              <h2>{"@" + uData.username}</h2>
            </Link>
            <p><FontAwesomeIcon icon={faLocationDot} className="cbm-creator-location-icon"/> {data.location}</p>
          </div>
        </div>}
        <p className="--tbx-bio"><span>{data.bio}</span></p>
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
                  <Link key={index} href={`/profile/${creator.username}`}>
                    <span className="cbm-spt-creator">
                      {"@" + creator.username}
                    </span>
                  </Link>
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}
