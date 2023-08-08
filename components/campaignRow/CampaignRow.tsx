import { useCdata } from "@/hooks/useCdata"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"

export default function CampaignRow({ address }: { address: string }) {
  const {
    loading,
    campaignDetails,
    imageURI,
    imgLoad,
    setImgLoad,
    progress,
    daysUntil,
    deadlineStatement,
  } = useCdata(address)

  return (
    <div className="db-tbl-rw">
      <span className="db-tbl-rw-ele">
        <img src={imageURI} alt="--" className="db-tbl-rw-img" />
        <span>{campaignDetails.title}</span>
      </span>
      <span
        className="db-tbl-rw-ele --status"
        style={
          campaignDetails.state == 0
            ? { background: "green" }
            : campaignDetails.state == 1
            ? { background: "amber" }
            : campaignDetails.state == 2
            ? { background: "red" }
            : {}
        }
      >
        {campaignDetails.state == 0
          ? "Fundraising"
          : campaignDetails.state == 1
          ? "Expired"
          : campaignDetails.state == 2
          ? "Canceled"
          : "--"}
      </span>
      <span className="db-tbl-rw-ele  --eta">
        {daysUntil <= 0 ? 0 : daysUntil}
      </span>
      <span className="db-tbl-rw-ele">
        <FontAwesomeIcon icon={faEthereum} className="db-tbl-act-icon" />
        <span>
          {Number(ethers.utils.formatEther(campaignDetails.currentBalance)) >=
          10
            ? Number(
                ethers.utils.formatEther(campaignDetails.currentBalance)
              ).toPrecision(4)
            : Number(
                Number(
                  ethers.utils.formatEther(campaignDetails.currentBalance)
                ).toFixed(3)
              ).toPrecision(2)}
        </span>
      </span>
      <span className="db-tbl-rw-ele --options">
        <FontAwesomeIcon icon={faPencil} className="db-tbl-act-icon" />
        {/* <FontAwesomeIcon icon={faTrash} className="db-tbl-act-icon"/> */}
        <span className="db-tbl-details">{"Details"}</span>
      </span>
    </div>
  )
}
