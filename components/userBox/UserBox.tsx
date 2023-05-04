import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import { truncateStr } from "@/utils/truncateStr"
import { faChartLine, faGear, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter } from "next/router"
import { AnimationEvent, useContext } from "react"
import Blockies from "react-blockies"


interface props{
  iVisible: boolean
  offMe: Function
}

export default function UserBox({ iVisible, offMe }:props) {
  const { account, balance, isAuth }:conn = useContext(ConnectionContext)!
  const router = useRouter()

  function handleAnimationFinished(e:AnimationEvent){
    if(e.animationName.includes("ubslideout")){
      offMe()
    }
  }

  return (
    <div className={`ub-container fl-cl fl-c ${!iVisible ? "ub-slide-in" : "ub-slide-out"}`} onAnimationEnd={(e)=>{handleAnimationFinished(e)}}>
      <div className="ub-wallet-info-cont fl-tl fl-c">
        <div className="ub-wallet-info fl-cl">
          <p>{"Connected with Metamask"}</p>
          <img src="/assets/metamask.svg" alt="wallet-ico" className="ub-wallet-ico"/>
        </div>
        <div className="ub-acc-grp fl-tl">
          <Blockies seed={account} scale={5} size={8} 
            className="ub-jazzicon" color="#C4A2E7" bgColor="#361E77" spotColor="#fff"
          />
          <div className="ub-addr-grp fl-tl fl-c">
            <p>{"WALLET"}</p>
            <p>{truncateStr(account, 14)}</p>
          </div>
        </div>
      </div>

      <div className="ub-sep"></div>

      {isAuth && <Link href="/create-campaign" style={{ "width":"100%" }} onClick={()=>{offMe()}}>
        <button className="ub-cta">
          {"Start a campaign"}
        </button>
      </Link>}

      <div className="ub-sep"></div>

      <div className="ub-rel-asset-cont">
        <div className="ub-rel-asset fl-cl">
          <img src="/assets/eth_logo.png" alt="curr-ico" className="ub-curr-ico"/>
          <div className="ub-curr-bal-grp fl-tl fl-c">
            <p>{"sETH"}</p>
            <p>{balance}</p>
          </div>
        </div>
      </div>

      <div className="ub-wallet-options fl-cl">
        <div className="ub-wallet-option fl-cl" onClick={()=>{offMe()}}>
          <FontAwesomeIcon icon={faUser} className="ub-w-option-icon"/>
          {isAuth 
            ? <Link href={`/profile/${account}`}><p>{"Profile"}</p></Link> 
            : <Link href="/signUp"><p>{"Sign up"}</p></Link>
          }
        </div>
        {isAuth && <Link href={`/settings/${account}`} onClick={()=>{offMe()}}>
          <div className="ub-wallet-option fl-cl">
            <FontAwesomeIcon icon={faGear} className="ub-w-option-icon"/>
            <p>{"Settings"}</p>
          </div>
        </Link>}
      </div>
    </div>
  )
}
