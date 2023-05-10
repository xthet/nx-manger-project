import { fcmp } from "@/types"

export default function CreatorBioModal({ data, offMe }:{data:fcmp, offMe:Function}) {
  return (
    <>
      <div className="tbx-reactive" onClick={()=>{offMe()}}></div>
      <div className="tbx-modal">
        <p className="--tbx-still --tbx-bio">{data.bio}</p>
        <div className="tbx-cta-cont">
          <button className="tbx-cta" onClick={()=>{offMe()}}>{"Yes"}</button>
          <button className="tbx-cta" onClick={()=>{offMe()}}>{"No"}</button>
        </div>
      </div>
    </>
  )
}
