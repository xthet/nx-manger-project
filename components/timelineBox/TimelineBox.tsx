import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import ReactLoading from "react-loading"
import { useMediaQuery } from "react-responsive"

interface props {
  offMe: Function
  arr: string[]
  arrIndex: number
  closable: boolean
}

export default function TimelineBox({ offMe, arr, arrIndex, closable }:props) {
  const isBigScreen = useMediaQuery({ query: "(min-width: 700px)" })

  const stopsWrp = {
    display: "grid",
    width: "100%",
    zIndex: "4",
    gridTemplateColumns: `repeat(${arr.length}, 1fr)`,
    justifyItems: "center",
  }

  const etaWrp = {
    display: "grid",
    gridTemplateColumns: `repeat(${arr.length}, 1fr)`
  }

  useEffect(()=>{
    if(arrIndex >= arr.length){
      setTimeout(()=>{
        offMe()
      },500)
    }
  },[arrIndex])

  return (
    <>
      <div className="tbx-reactive" onClick={()=>{closable && offMe()}}></div>
      <div className="tbx-modal">
        {isBigScreen && <div className="tbx-tl-wrp">
          <div className="tbx-eta-wrp" style={etaWrp}>
            {arr.map((info, index)=>{
              return (
                <div className="tbx-eta" style={arrIndex == 0 ? { "width":"0%" } : arrIndex > index ? { "width":"100%" } : arrIndex == (arr.length - 1) ? { "width":"100%" } : arrIndex == index ? { "width":"50%" } : { "width":"0%" }} key={index}></div>
              )
            })}
          </div>
          <div className="tbx-tl-stops-wrp" style={stopsWrp}>
            {arr.map((info, index)=>{
              return (
                <div className={`tbx-tl-stop ${index == 0 && "--tl-first"} ${index == arr.length - 1 && "--tl-last"}`} key={index}>
                  <div className="tbx-tl-node">
                    {arrIndex < index ? <p>{""}</p> : arrIndex == index
                      ? <ReactLoading type="bubbles" color="#827B93" height={15} width={15}/> 
                      : <FontAwesomeIcon icon={faCircleCheck} className="tbx-tl-check"/>
                    }
                  </div>
                  <p className="tbx-tl-node-info">{info}</p>
                </div>
              )
            })}
          </div>
        </div>}
        <h3 className="tbx-title">{(arrIndex <= arr.length - 1) ? "Processing..." : "Request Complete"}</h3>
        <p className="tbx-subtitle">{((arrIndex <= arr.length - 1) ? arr[arrIndex] : arr[arr.length - 1]) + "..."}</p>
        {closable && <button className="tbx-cta" onClick={()=>{closable && offMe()}}>{"Close"}</button>}
      </div>
    </>
  )
}
