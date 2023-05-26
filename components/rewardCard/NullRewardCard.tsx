import { BigNumber, ethers } from "ethers"
import { useContext, useState } from "react"
import { conn } from "@/types"
import { ConnectionContext } from "@/contexts/connection"
import crowdFunderABI from "@/constants/abis/CrowdFunder.json"
import { NotificationContext } from "@/contexts/notification"
import { v4 } from "uuid"

interface props{
  address:string
}

export default function NullRewardCard({ address }:props) {
  const [inp, setInp] = useState("")
  const { isConnected, signer }:conn = useContext(ConnectionContext)!
  const { dispatch } = useContext(NotificationContext)!


  async function handleFund(donation:BigNumber){
    const crowdfunder = new ethers.Contract(crowdFunderABI.address, crowdFunderABI.abi, signer)
    try {
      const donateTx = await crowdfunder.donateToCampaign(address,false,{ value:donation })
      const donateTxR = await donateTx.wait(1)
      dispatch({
        type: "ADD_NOTI",
        payload:{
          id: v4(),
          type: "SUCCESS",
          title: "Donation Successful",
          message: `Your donation of ${ethers.utils.formatEther(donation)} ETH was made successfully`
        }
      })
    } catch (error) {
      dispatch({
        type: "ADD_NOTI",
        payload:{
          id: v4(),
          type: "FAILED",
          title: "Donation Failed",
          message: `Your donation of ${ethers.utils.formatEther(donation)} ETH failed during processing 
          \nNB: You cannot donate to this campaign if you're its creator`
        }
      })
      console.log(error)      
    }
  }

  return (
    <div className="rc-container fl-tl fl-c">
      <div className="rc-id-del fl-tc fl-sb">
        <div className="rc-reward-id fl-cc">{"Pledge without a reward"}</div>
      </div>

      <div className="rc-input-container fl-bl fl-sb">
        <div className="rc-input">
          <p>{"Pledge amount"}</p>
          <div className="rc-fund-container fl-cl">
            <div className="rc-inp fl-cl fl-sb">
              <p className="rc-inp-curr">{"ETH"}</p>
              <input type="number" onChange={(e)=>{setInp(e.target.value)}} value={inp}/>
            </div>
          </div>
        </div>
        {!inp ? <p>{""}</p> : <button className="rc-cta" onClick={()=>{handleFund(ethers.utils.parseEther(inp))}}>{`Donate ${inp} ETH`}</button>}
      </div>
    </div>
  )
}
