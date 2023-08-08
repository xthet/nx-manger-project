import crowdFunderABI from "@/constants/abis/CrowdFunder.json"
import campaignABI from "@/constants/abis/Campaign.json"
import { ConnectionContext } from "@/contexts/connection"
import { CampaignContext } from "@/contexts/currentCampaign"
import { NotificationContext } from "@/contexts/notification"
import { useCdata } from "@/hooks/useCdata"
import { useQCData } from "@/hooks/useQCData"
import { useURIData } from "@/hooks/useURIData"
import { conn } from "@/types"
import { truncateStr } from "@/utils/truncateStr"
import { faEthereum, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faShareNodes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import Link from "next/link"
import { useContext, useState } from "react"
import Blockies from "react-blockies"
import { v4 } from "uuid"
import { cutStr } from "@/utils/cutStr"
import { CreatorBioModal, RefundNotice, TimelineBox } from "../exportComps"
import onetime from "onetime"
import { useQUData } from "@/hooks/useQUData"

interface props {
  state: number
}

export default function SideBio({ state }: props) {
  const { currAddress } = useContext(CampaignContext)!
  const { isConnected, signer, account }: conn = useContext(ConnectionContext)!
  const { dispatch } = useContext(NotificationContext)!
  const { campaignDetails } = useCdata(currAddress)
  const { cdata, fcLoading, cStory } = useURIData(currAddress)
  const { creatorVal, userDets } = useQCData(
    currAddress,
    campaignDetails.creator
  )
  const { uNameVal } = useQUData(campaignDetails.creator)
  const [donAmount, setDonAmount] = useState("")
  const [showRNX, setShowRNX] = useState(false)
  const [showBio, setShowBio] = useState(false)

  const [showTBX, setShowTBX] = useState(false)
  const tlArr = [
    "Initiating refund",
    "Awaiting confirmation",
    "Updating details",
    "Refund completed",
  ]
  const [tlIndex, setTlIndex] = useState(0)
  const [tlClosable, setTlClosable] = useState(false)

  const handleRefund = onetime(async () => {
    const crowdfunder = new ethers.Contract(
      crowdFunderABI.address,
      crowdFunderABI.abi,
      signer
    )
    setShowTBX(true)
    try {
      const refundTx = await crowdfunder.refundFromCampaign(currAddress)
      setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 1))
      const refundTxR = await refundTx.wait(1)
      setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 1))

      dispatch({
        type: "ADD_NOTI",
        payload: {
          id: v4(),
          type: "SUCCESS",
          title: "Refund Successful",
          message: "",
        },
      })
      setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 2))
    } catch (error) {
      setShowTBX(false)
      setTlIndex(0)
      dispatch({
        type: "ADD_NOTI",
        payload: {
          id: v4(),
          type: "FAILURE",
          title: "Refund Failed",
          message:
            "An error occured while processing this transaction \nNB: Make sure you're connected to the same address used to fund this campaign",
        },
      })
      console.log(error)
    }
  })

  return (
    <div className="sb-container fl-tl fl-c">
      <div className="sb-bio fl-tl fl-c">
        {showTBX && (
          <TimelineBox
            offMe={() => {
              setShowTBX(false)
            }}
            arr={tlArr}
            arrIndex={tlIndex}
            closable={tlClosable}
          />
        )}
        <h4 className="sb-bio-heading">{"Creator"}</h4>
        {showRNX && (
          <RefundNotice
            offMe={() => {
              setShowRNX(false)
            }}
            refund={() => {
              handleRefund()
            }}
          />
        )}
        <div className="sb-bio-details fl-tl">
          {!(userDets && userDets.pfp && userDets.pfp != "_NIL") ? (
            <Blockies
              seed={
                campaignDetails && campaignDetails.creator
                  ? campaignDetails.creator.toLowerCase()
                  : "0x"
              }
              scale={5}
              size={8}
              className="sb-creator-jazzicon"
              color="#C4A2E7"
              bgColor="#361E77"
              spotColor="#fff"
            />
          ) : (
            <img
              src={userDets.pfp.replace("ipfs://", "https://ipfs.io/ipfs/")}
              alt="--"
              className="sb-creator-pfp"
            />
          )}
          <div className="sb-creator-details fl-tl fl-c">
            <div className="sb-creator-address fl-cl">
              <FontAwesomeIcon icon={faEthereum} className="sb-bio-curr-icon" />
              <p>{truncateStr(campaignDetails.creator, 10)}</p>
            </div>
            <Link href={`/profile/${uNameVal}`}>
              <p className="sb-creator-name">{creatorVal}</p>
            </Link>
          </div>
        </div>

        <div className="sb-creator-socials fl-cl">
          <Link
            href={!userDets || !cdata || !cdata.twitter ? "#" : cdata.twitter}
          >
            <FontAwesomeIcon icon={faTwitter} className="sb-social-icon" />
          </Link>
          <FontAwesomeIcon icon={faShareNodes} className="sb-social-icon" />
        </div>
        {showBio && cdata && (
          <CreatorBioModal
            data={cdata}
            offMe={() => {
              setShowBio(false)
            }}
          />
        )}
        <p
          className="sb-creator-bio"
          onClick={() => {
            setShowBio(true)
          }}
        >
          {cdata ? cutStr(cdata.bio, 145) : ""}
        </p>
      </div>

      {(state == 0 || state == 2) && isConnected && (
        <div className="sb-support fl-tl fl-c">
          <h4 className="sb-support-heading">{"Support"}</h4>
          <div className="sb-support-box fl-tl fl-c">
            <h4 className="sb-support-box-heading">{"Get a refund."}</h4>

            {/* <div className="sb-input fl-cl">
            <p>{"ETH"}</p>
            <input type="number" onChange={(e)=>{setDonAmount(e.target.value)}} value={donAmount}/>
          </div> */}

            <div className="sb-support-info">
              <h4>{"Have you funded this campaign in the past?"}</h4>
              <p>
                {
                  "You can request a refund here before this campaign expires. Make sure you're connected with the address used to fund this campaign."
                }
              </p>
            </div>

            <button
              className="sb-fund-cta"
              onClick={() => {
                setShowRNX(true)
              }}
            >
              {"Refund"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
