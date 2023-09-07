import { NotificationContext } from "@/contexts/notification"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { AnimationEvent, useContext, useEffect, useState } from "react"

interface props {
  title:string, 
  message:string, 
  type:string,
  id:string
}

export default function Notibox({ title, message, type, id }:props) {
  const { dispatch } = useContext(NotificationContext)!
  const [showNoti, setShowNoti] = useState(true)
  const [visibility, setVisibility] = useState(true)
  const [pause, setPause] = useState(false)
  const [time, setTime] = useState(5000)
  const [startTime, setStartTime] = useState(new Date().getTime())

  function handleAnimationEnd(e:AnimationEvent){
    if(e.animationName.includes("ntpopout")){
      dispatch({
        type: "DEL_NOTI",
        id
      })
    }
  }

  useEffect(()=>{
    let timeout:any
    function timeNoti(){ 
      if(!pause){
        timeout = setTimeout(()=>{setShowNoti(false)},time)
      }
      else{ 
        const currTime = new Date().getTime()
        setTime(prev=>prev - (currTime - startTime))
        clearTimeout(timeout)
      }
    }
    timeNoti()
    return ()=>{clearTimeout(timeout)}
  },[pause])

  return (
    <div className={`nt-item ${showNoti ? "nt-pop-in" : "nt-pop-out"} ${!visibility && "nt-invisible"}`} 
      style={type == "SUCCESS" ? { "background":"#C4A2E7" } : { "background":"rgba(255, 0, 0,0.8)" }}
      onAnimationEnd={(e)=>{handleAnimationEnd(e)}}
    >
      <div className="nt-bdr"
        onMouseEnter={()=>{setPause(true)}} onMouseLeave={()=>{setPause(false)}}
      >
        <div className="nt-cancel">
          <FontAwesomeIcon icon={faXmark} className="nt-x-icon" onClick={()=>{setShowNoti(false)}}/>
        </div>
        {title && <h5 className="nt-title">{title}</h5>}
        {title && message && <div className="nt-sep"></div>}
        {message && <p className="nt-msg">{message}</p>}
      </div>
    </div>
  )
}
