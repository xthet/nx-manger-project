import { NullRewardCard, RewardCard } from "@/components/exportComps"
import { ConnectionContext } from "@/contexts/connection"
import { CampaignContext } from "@/contexts/currentCampaign"
import useRwdTab from "@/hooks/useRwdTab"
import { conn } from "@/types"
import { useContext } from "react"
import ReactLoading from "react-loading"

export default function RewardsTab() {
  const { isConnected, connect }:conn = useContext(ConnectionContext)!
  const { currAddress } = useContext(CampaignContext)!
  const { loading, rwIds } = useRwdTab(currAddress)

  return (
    <div className="cpd-tab rt-container fl-tl fl-c" id="r_rewards">
      <div className="rt-title">
        <h2>{"SELECT YOUR REWARD"}</h2>
        <p>{"Select an option below"}</p>
      </div>
      <div className="rt-rewards-container fl-tl fl-c">
        {
          loading || !rwIds || !rwIds.length || !typeof(rwIds[0] == "number") ? <ReactLoading type="bubbles" color="#C4A2E7"/> : 
            !isConnected ? <div className="rt-conn-cta"><p>{"Connect your wallet to view rewards!!"}</p><button onClick={()=>{connect()}}>{"Connect your wallet"}</button></div> :
            <>
              <NullRewardCard address={currAddress}/>
              {
                rwIds.map((rId:number, index:number)=>{
                  return (
                    <RewardCard address={currAddress} id={rId} key={index} onEdit={false}/>
                  )
                })
              }
            </>
        }
      </div>
    </div>
  )
}
