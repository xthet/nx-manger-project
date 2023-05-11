import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { faAngleLeft, faAngleRight, faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

export default function CrtdCampaigns() {
  return (
    <>
      <div className="db-table">
        <div className="db-table-type">
          <h3>{"Campaigns Created"}</h3>
        </div>

        <div className="db-tbl-hdr">
          <span className="db-tbl-hdr-ele">{"Name"}</span>
          <span className="db-tbl-hdr-ele">{"Status"}</span>
          <span className="db-tbl-hdr-ele --eta">{"ETA (days)"}</span>
          <span className="db-tbl-hdr-ele">{"Balance"}</span>
        </div>

        <div className="db-tbl-rw">
          <span className="db-tbl-rw-ele">
            <img src="/e43.png" alt="--" className="db-tbl-rw-img"/>
            <span>{"Rune Fencer Illyia - A Cute Metroidvania"}</span>
          </span>
          <span className="db-tbl-rw-ele --status">{"Fundraising"}</span>
          <span className="db-tbl-rw-ele  --eta">{"15"}</span>
          <span className="db-tbl-rw-ele">
            <FontAwesomeIcon icon={faEthereum} className="db-tbl-act-icon"/>
            <span>{"3.58"}</span>
          </span>
          <span className="db-tbl-rw-ele --options">
            <FontAwesomeIcon icon={faPencil} className="db-tbl-act-icon"/>
            {/* <FontAwesomeIcon icon={faTrash} className="db-tbl-act-icon"/> */}
            <span className="db-tbl-details">{"Details"}</span>
          </span>
        </div>

        <div className="db-tbl-rw">
          <span className="db-tbl-rw-ele">
            <img src="/e43.png" alt="--" className="db-tbl-rw-img"/>
            <span>{"Dark Metroidvania"}</span>
          </span>
          <span className="db-tbl-rw-ele --status">{"Fundraising"}</span>
          <span className="db-tbl-rw-ele --eta">{"53"}</span>
          <span className="db-tbl-rw-ele">
            <FontAwesomeIcon icon={faEthereum} className="db-tbl-act-icon"/>
            <span>{"3.58"}</span>
          </span>
          <span className="db-tbl-rw-ele --options">
            <FontAwesomeIcon icon={faPencil} className="db-tbl-act-icon"/>
            {/* <FontAwesomeIcon icon={faTrash} className="db-tbl-act-icon"/> */}
            <span className="db-tbl-details">{"Details"}</span>
          </span>
        </div>

        <div className="db-tbl-rw">
          <span className="db-tbl-rw-ele">
            <img src="/e43.png" alt="--" className="db-tbl-rw-img"/>
            <span>{"Dark Metroidvania"}</span>
          </span>
          <span className="db-tbl-rw-ele --status">{"Fundraising"}</span>
          <span className="db-tbl-rw-ele  --eta">{"5"}</span>
          <span className="db-tbl-rw-ele">
            <FontAwesomeIcon icon={faEthereum} className="db-tbl-act-icon"/>
            <span>{"3.58"}</span>
          </span>
          <span className="db-tbl-rw-ele --options">
            <FontAwesomeIcon icon={faPencil} className="db-tbl-act-icon"/>
            {/* <FontAwesomeIcon icon={faTrash} className="db-tbl-act-icon"/> */}
            <span className="db-tbl-details">{"Details"}</span>
          </span>
        </div>
      </div>

      <div className="db-tbl-pgnt">
        {/* <button className="db-tbl-sm-btn">{"See more"}</button> */}
        <FontAwesomeIcon icon={faAngleLeft} className="db-tbl-pgnt-icon"/>
        <div className="db-tbl-pgs-cont">
          <span>{"1"}</span>
          <span className="--pgatv">{"2"}</span>
        </div>
        <FontAwesomeIcon icon={faAngleRight} className="db-tbl-pgnt-icon"/>
      </div>
    </>
  )
}
