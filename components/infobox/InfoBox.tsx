import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ReactLoading from "react-loading"
import { useMediaQuery } from "react-responsive"

interface props {
  offMe: Function
  msg: string
  cta: string[]
}

export default function InfoBox({ offMe, msg, cta }:props) {
  const isBigScreen = useMediaQuery({ query: "(min-width: 700px)" })
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
