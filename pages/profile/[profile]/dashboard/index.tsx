import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { faAngleLeft, faAngleRight, faChartSimple, faCircleInfo, faPencil, faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"

export default function Dashboard() {
  const { isConnected, account, connect, isAuth, uNameVal }:conn = useContext(ConnectionContext)!
  const router = useRouter()
  const profile = router.asPath.split("/")[2]

  return (
    <>
      <Head>
        <title>{"Manger | Dashboard"}</title>
        <meta name="description" content="Manger Project - Fundraising on the blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>
      <div className="db">
        <aside className="db-side">
          <h3 className="db-sec-title">{"Dashboard"}</h3>
          <div className="db-menu">
            <span>{"Drafts"}</span>
            <Link href={`/pages/settings/${account}`}><span>{"Account Settings"}</span></Link>
            <span>{"Campaigns"}</span>
          </div>
          <Link href={`/profile/${uNameVal}`} className="db-user">
            <div className="db-user">
              <img src="/re3.jpg" alt="--" className="db-pfp"/>
              <span>{"nootbox"}</span>
            </div>
          </Link>
        </aside>
        <main className="db-main">
          <div className="db-main-header">
            <div className="db-crt-dnt">
              <span>{"Created"}</span>
              <span>{"Donated"}</span>
            </div>
            <Link href={"/create-campaign"}>
              <button className="db-hdr-cta">
                <FontAwesomeIcon icon={faChartSimple} className="db-hdr-cta-icon"/>
                {"Start a campaign"}
              </button>
            </Link>
          </div>

          <div className="db-stats-grp">
            <div className="db-stats-cont">
              <div className="db-stat">
                <p className="db-stat-act">{"raised"}</p>
                <div className="db-stat-amt-grp">
                  <p className="db-stat-amt">{"29.97"}</p>
                  <p className="db-stat-msr">{"ETH"}</p>
                </div>
              </div>
              <div className="db-stat">
                <p className="db-stat-act">{"from"}</p>
                <div className="db-stat-amt-grp">
                  <p className="db-stat-amt">{"890"}
                    {/* <sup>{"+"}</sup> */}
                  </p>
                  <p className="db-stat-msr">{"backers"}</p>
                </div>
              </div>
              <div className="db-stat">
                <p className="db-stat-act">{"across"}</p>
                <div className="db-stat-amt-grp">
                  <p className="db-stat-amt">{"88"}</p>
                  <p className="db-stat-msr">{"campaigns"}</p>
                </div>
              </div>
            </div>

            <div className="db-stats-info">
              <p>
                <FontAwesomeIcon icon={faCircleInfo} className="db-stats-info-icon"/>
                {`
                Did you know: Manger runs a flexible crowdfunding system i.e. 
                all earnings at the end of a campaign, belong to the campaign creator, 
                even if the campaign goal isn't reached. 
                `}
              </p>
            </div>
          </div>

          <section className="db-recents">
            <h3>{"Recent Donations"}</h3>
            <div className="db-recents-cont">
              <div className="db-recent">
                <div className="db-recent-dets-grp">
                  <img src="/re3.jpg" alt="--" />
                  <div className="db-recent-dets">
                    <span>{"Emma Ryan Jr."}</span>
                    <span>{"Dark Metroidvania"}</span>
                  </div>
                </div>
                <span className="db-recent-amt">{"0.03"}<span>{"ETH"}</span></span>
              </div>
              <div className="db-recent">
                <div className="db-recent-dets-grp">
                  <img src="/re3.jpg" alt="--" />
                  <div className="db-recent-dets">
                    <span>{"Emma Ryan Jr."}</span>
                    <span>{"Dark Metroidvania"}</span>
                  </div>
                </div>
                <span className="db-recent-amt">{"0.03"}<span>{"ETH"}</span></span>
              </div>
              <div className="db-recent">
                <div className="db-recent-dets-grp">
                  <img src="/re3.jpg" alt="--" />
                  <div className="db-recent-dets">
                    <span>{"Emma Ryan Jr."}</span>
                    <span>{"Dark Metroidvania"}</span>
                  </div>
                </div>
                <span className="db-recent-amt">{"0.03"}<span>{"ETH"}</span></span>
              </div>
            </div>
          </section>

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
                <FontAwesomeIcon icon={faTrash} className="db-tbl-act-icon"/>
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
                <FontAwesomeIcon icon={faTrash} className="db-tbl-act-icon"/>
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
                <FontAwesomeIcon icon={faTrash} className="db-tbl-act-icon"/>
                <span className="db-tbl-details">{"Details"}</span>
              </span>
            </div>
          </div>

          <div className="db-tbl-pgnt">
            <FontAwesomeIcon icon={faAngleLeft} className="db-tbl-pgnt-icon"/>
            <div className="db-tbl-pgs-cont">
              <span>{"1"}</span>
              <span className="--pgatv">{"2"}</span>
            </div>
            <FontAwesomeIcon icon={faAngleRight} className="db-tbl-pgnt-icon"/>
          </div>
        </main>
      </div>
    </>
  )
}
