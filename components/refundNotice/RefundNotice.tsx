interface props {
  offMe: Function
  refund: Function
}

export default function RefundNotice({ offMe, refund }:props) {
  return (
    <>
      <div className="tbx-reactive" onClick={()=>{offMe()}}></div>
      <div className="tbx-modal">
        <p className="--tbx-still">{"Are you sure you want a refund?"}</p>
        <div className="tbx-cta-cont">
          <button className="tbx-cta" onClick={()=>{offMe(); refund()}}>{"Yes"}</button>
          <button className="tbx-cta" onClick={()=>{offMe()}}>{"No"}</button>
        </div>
      </div>
    </>
  )
}
