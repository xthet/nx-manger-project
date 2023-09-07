import { CampaignContext } from "@/contexts/currentCampaign"
import { useURIData } from "@/hooks/useURIData"
import ReactLoading from "react-loading"
import { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { conn } from "@/types"
import { ConnectionContext } from "@/contexts/connection"

export default function FaqsTab() {
  const { currAddress } = useContext(CampaignContext)!
  const { isConnected, connect, account, signer, isAuth }: conn =
    useContext(ConnectionContext)!
  const { cdata, fcLoading, cRisks, cFaqs } = useURIData(currAddress)
  const [showFAns, setShowFAns] = useState<number>(-1)

  return (
    <section className="cpd-tab st-container fl-tl fl-c" id="s_faq">
      <h3 className="st-title --st-cent">{"Frequently Asked Questions."}</h3>
      {!cdata || fcLoading || !cdata.risks ? (
        <ReactLoading type="bubbles" color="#C4A2E7" />
      ) : (
        <div className="st-faqs">
          {cFaqs.length > 0 ? (
            cFaqs.map((faq, index) => {
              return (
                <div key={index} className="ct-faqbox --cmpfaq">
                  <div className="ct-faq-box-qa">
                    <p className="ct-faqbox-q">
                      {faq.question}
                      {!(showFAns == index) ? (
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          className="ct-faqbox-show-icon"
                          onClick={() => {
                            setShowFAns(index)
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCaretUp}
                          className="ct-faqbox-show-icon"
                          onClick={() => {
                            setShowFAns(-1)
                          }}
                        />
                      )}
                    </p>
                    {showFAns == index && (
                      <p className="ct-faqbox-a">{faq.answer}</p>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <>
              <p>{`Looks like there aren't any frequently asked questions yet. ${
                isAuth ? "Ask the project creator directly." : ""
              }`}</p>
              {isAuth && (
                <Link href={`mailto:${cdata.email}`}>
                  <button className="st-faq-cta">{"Ask a question"}</button>
                </Link>
              )}
            </>
          )}
        </div>
      )}
      <h3 className="st-title --st-cent" style={{ paddingLeft: "0.5rem" }}>
        {"Risks and challenges!"}
      </h3>
      {!cdata || fcLoading || !cdata.risks ? (
        <ReactLoading type="bubbles" color="#C4A2E7" />
      ) : (
        <article className="st-story" dangerouslySetInnerHTML={cRisks} />
      )}
    </section>
  )
}
