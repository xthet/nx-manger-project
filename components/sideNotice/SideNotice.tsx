export default function SideNotice() {
  return (
    <div className="sn-container fl-tl fl-c">
      <div className="sn-info">
        <div className="sn-info-title">{"Rewards aren't guaranteed."}</div>
        <p>{"Your pledge will support an ambitious creative project that has yet to be developed. There’s a risk that, despite a creator’s best efforts, your reward will not be fulfilled, and we urge you to consider this risk prior to pledging. Manger is not responsible for project claims or reward fulfillment."}</p>
      </div>

      <div className="sn-faq">
        <h4>{"FREQUENTLY ASKED QUESTIONS"}</h4>
        <ul className="sn-faqs fl-tl fl-c">
          <li>{"How do I pledge?"}</li>
          <li>{"Am I refunded if funding fails?"}</li>
          <li>{"If funding succeds how do I get my reward?"}</li>
        </ul>
      </div>
    </div>
  )
}
