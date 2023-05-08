import { faChartSimple } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/router"

export default function Dashboard() {
  const router = useRouter()
  const { profile } = router.query

  return (
    <>
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

          <div className="db-stats-cont">
            <div className="db-stat">
              <p className="db-stat-act">{"raised"}</p>
              <div className="db-stat-amt-grp">
                <p className="db-stat-amt">{"27.97"}</p>
                <p className="db-stat-msr">{"ETH"}</p>
              </div>
            </div>

            <div className="db-stat">
              <p className="db-stat-act">{"from"}</p>
              <div className="db-stat-amt-grp">
                <p className="db-stat-amt">{"170"}</p>
                <p className="db-stat-msr">{"backers"}</p>
              </div>
            </div>

            <div className="db-stat">
              <p className="db-stat-act">{"across"}</p>
              <div className="db-stat-amt-grp">
                <p className="db-stat-amt">{"19"}</p>
                <p className="db-stat-msr">{"campaigns"}</p>
              </div>
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

          <div className="db-crtd-table">

          </div>
        </main>
      </div>
    </>
  )
}
