import { useContext, useEffect, useState } from "react"
import { BigNumber, ethers } from "ethers"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import useRwdCard from "@/hooks/useRwdCard"
import { conn, rwdFormObj } from "@/types"
import { ConnectionContext } from "@/contexts/connection"
import crowdFunderABI from "@/constants/abis/CrowdFunder.json"
import { getDateFromTS } from "@/utils/getDateFromTS"


interface props {
  rwd:rwdFormObj
}


export default function DummyRewardCard({ rwd }:props) {
  return (
    <div className="rc-container fl-tl fl-c">
      <div className="rc-id-del fl-tc fl-sb">
        <div className="rc-reward-id fl-cc">{`Pledge ${rwd.rPrice} ETH`}</div>
        <div className="rc-reward-del fl-bl fl-c">
          <p className="rc-reward-del-label">{"EST. DELIVERY"}</p>
          <p>{getDateFromTS(parseInt(rwd.rDelD))}</p>
          {
            rwd.rQty && rwd.rQty !== "0" &&
            <>
              <div className="rc-rwd-qty-sep"></div>
              <p>{`${rwd.rQty} left`}</p>
              <div className="rc-rwd-qty-sep"></div>
            </>
          }
        </div>
      </div>

      <div className="rc-dets-cont fl-tl fl-sb">
        <article className="rc-details fl-tl fl-c">
          <h3 className="rc-title">{rwd.rName}</h3>
          <p className="rc-description">{rwd.rDesc}</p>
          <div className="rc-perks-container">
            <h5>{"INCLUDES"}</h5>
            <ul className="rc-perks fl-tl fl-c">
              {
                rwd.items &&
                  rwd.items.map((perk, index)=>{
                    return (
                      <li key={index}>{perk}</li>
                    )
                  })
              }
            </ul>
          </div>
        </article>
        {(rwd.rPic !== "_NIL") && <div className="rc-img-cont">
          <img src={rwd.rPic.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="--" className="rc-img"/>
        </div>}
      </div>

      <div className="rc-input-container fl-bl fl-sb">
        { !(rwd.shipsTo[0] == "_NW") &&
          <div className="rc-reward-del fl-tl fl-c">
            <p className="rc-reward-del-label">{"SHIPS TO"}</p>
            <div className="fl-tl">
              {rwd.shipsTo[0] == "_AITW" ? <p>{"Anywhere in the world"}</p> : rwd.shipsTo.map((shipLoc:string, index:number)=>{return <p key={index}>{shipLoc}</p>})}
            </div>
          </div>
        }
        {/* <button className="rc-cta" onClick={()=>{handleFund(rwdDetails.price)}}>{`Donate ${loading ? "" : ethers.utils.formatEther(rwdDetails.price)} ETH`}</button> */}
      </div>
    </div>
  )
}
