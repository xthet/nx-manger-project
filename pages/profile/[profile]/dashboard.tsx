import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { faChartSimple, faCircleInfo, faPencil, faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Head from "next/head"
import { useRouter } from "next/router"

export default function Dashboard() {
  const router = useRouter()
  const { profile } = router.query

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
            <span>{"Account Settings"}</span>
            <span>{"Campaigns"}</span>
          </div>
          <div className="db-user">
            <img src="/re3.jpg" alt="--" className="db-pfp"/>
            <span>{"nootbox"}</span>
          </div>
        </aside>
        <main className="db-main">
          <div className="db-main-header">
            <div className="db-crt-dnt">
              <span>{"Created"}</span>
              <span>{"Donated"}</span>
            </div>
            <button className="db-hdr-cta">
              <FontAwesomeIcon icon={faChartSimple} className="db-hdr-cta-icon"/>
              {"Start a campaign"}
            </button>
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
              <span className="db-tbl-hdr-ele">{"ETA (days)"}</span>
              <span className="db-tbl-hdr-ele">{"Balance"}</span>
            </div>

            <div className="db-tbl-rw">
              <span className="db-tbl-rw-ele">
                <img src="/e43.png" alt="--" className="db-tbl-rw-img"/>
                <span>{"Dark Metroidvania"}</span>
              </span>
              <span className="db-tbl-rw-ele --status">{"Fundraising"}</span>
              <span className="db-tbl-rw-ele">{"5"}</span>
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
              <span className="db-tbl-rw-ele --eta">{"5"}</span>
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
              <span className="db-tbl-rw-ele">{"5"}</span>
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
        </main>
      </div>
    </>
  )
}
