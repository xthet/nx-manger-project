import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import { truncateStr } from "@/utils/truncateStr"
import { faBarsStaggered, faUser, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { AnimationEvent, useContext, useState } from "react"
import { MobileUserBox } from "../exportComps"
import { useRouter } from "next/router"

interface Props {
  myVis: Function
}

export default function Sidebar({ myVis }: Props) {
  const { isConnected, connect, uNameVal, account, isAuth }:conn = useContext(ConnectionContext)!
  const [showMe, setShowMe] = useState(true)
  const router = useRouter()

  function handleClick(){
    setShowMe(false)
  }

  function handleAnimationFinished(e:AnimationEvent){
    if(e.animationName.includes("slideout")){
      myVis(true)
    }
  }

  return (
    <div className={`si-cont ${showMe ? "si-slide-in" : "si-slide-out"}`}>
      <div className={`si-sidebar-reactive ${showMe ? "si-slide-in" : "si-slide-out"}`}
        onClick={()=>{handleClick()}}
        onAnimationEnd={(e)=>{handleAnimationFinished(e)}}
      ></div>
      <div className={`si-sidebar fl-tl ${showMe ? "si-slide-in" : "si-slide-out"}`}>
        <div className="si-nav fl-cc fl-sb">
          <div className="si-logo fl-cl">
            <p>{"MANGER"}</p>
          </div>
          <FontAwesomeIcon icon={faBarsStaggered} className="nv-hamburger" onClick={()=>{handleClick()}}/>
        </div>
        <div className="si-sidebar-menu fl-tl" onClick={()=>{handleClick()}}>
          <div className="si-sidebar-menu-link">
            <Link href="/campaigns">{"Campaigns"}</Link>
          </div>
          <div className="si-sidebar-menu-link">
            <Link href="/#how-it-works">{"How it works"}</Link>
          </div>
          <div className="si-sidebar-menu-link">
            <Link href="./">{"About us"}</Link>
          </div>
          <div className="si-sidebar-menu-link">
            <Link href="./#blog">{"Blog"}</Link>
          </div>
        </div>
        {isConnected && <MobileUserBox/>}
        <div className="si-connect-wrapper">
          <button className="si-connect fl-cc si-con-big" onClick={()=>{!isConnected && connect()}}>
            {!isConnected ? <FontAwesomeIcon icon={faWallet} className="si-wallet-icon"/>
              : <FontAwesomeIcon icon={faUser} className="si-wallet-icon"/>}
            {isConnected ? "Profile" : "Connect"}
          </button>
          <button className="si-connect fl-cc si-con-small" onClick={()=>{(!isConnected ? connect() : isAuth ? router.push(`/profile/${account}`) : router.push("/signUp")); setShowMe(false)}}>
            {!isConnected ? <FontAwesomeIcon icon={faWallet} className="si-wallet-icon"/>
              : <FontAwesomeIcon icon={faUser} className="si-wallet-icon"/>}
            {isConnected ? isAuth ? "Profile" : "Sign Up" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  )
}
