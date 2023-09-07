import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import { truncateStr } from "@/utils/truncateStr"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import Blockies from "react-blockies"


export default function MobileUserBox() {
  const { isConnected, connect, account, signer, isAuth, balance, uNameVal }:conn = useContext(ConnectionContext)!
  const router = useRouter()

  return (
    <div className="mub-container fl-tl fl-c">
      <div className="mub-acc-grp fl-tl">
        <Blockies seed={account} scale={4} size={8} 
          className="mub-jazzicon" color="#C4A2E7" bgColor="#361E77" spotColor="#fff"
        />
        <div className="mub-addr-grp fl-tl fl-c">
          <p>{"WALLET"}</p>
          <p>{truncateStr(account, 10)}</p>
        </div>
      </div>

      <div className="mub-details-cont">
        <img src="/assets/eth_logo.png" alt="curr-ico" className="mob-curr-ico"/>
        <div className="mub-attribute-grp">
          <p className="mub-attribute">{"sETH"}</p>
          <p className="mub-attr-value">{Number(balance).toFixed(5)}</p>
        </div>
      </div>

      {isAuth && <button className="mub-cta" onClick={()=>{router.push("/create-campaign")}}>{"Start a campaign"}</button>}

      {isAuth && <div className="mub-wallet-options fl-cl">
        <Link href={`/profile/${uNameVal}/dashboard`}>
          <div className="mub-wallet-option fl-cl">
            <p>{"Dashboard"}</p>
          </div>
        </Link>
        <Link href={`/settings/${account}`}>
          <div className="mub-wallet-option fl-cl">
            <p>{"Settings"}</p>
          </div>
        </Link>
      </div>}
    </div>
  )
}
