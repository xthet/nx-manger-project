import { useRouter } from "next/router"

interface props {
  offMe: Function
  msg: string
  cta: string[]
}

export default function InfoBox({ offMe, msg, cta }:props) {
  const router = useRouter()
  return (
    <>
      <div className="tbx-reactive" onClick={()=>{offMe()}}></div>
      <div className="tbx-modal">
        {/* <h3 className="tbx-title">{msg}</h3> */}
        <p className="--tbx-still">{msg}</p>
        {cta.length && <button className="tbx-cta" onClick={()=>{router.push(cta[1]); offMe()}}>{cta[0]}</button>}
      </div>
    </>
  )
}
