import { conn, udata } from "@/types"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { ConnectionContext } from "./connection"
import { validate } from "graphql"
import { useMediaQuery } from "react-responsive"
import { useQUData } from "@/hooks/useQUData"

interface props {
  children: ReactNode
  owner: string
}

interface dshb {
  activeTab: string
  setActiveTab: Function
  uData: udata
}

const DashboardContext = createContext<dshb | null>(null) 

function DashboardProvider({ children, owner }:props){
  // check conn auth screen size own page
  const { isConnected, signer, account, uNameVal, isAuth }:conn = useContext(ConnectionContext)!
  const { uData, uLoading } = useQUData(account)

  const [activeTab, setActiveTab] = useState("CREATED")
  const desktop = useMediaQuery({ query: "(min-width: 1000px)" })
  const [validated, setValidated] = useState(false)
  const [isBigScreen, setIsBigScreen] = useState(false)

  function validate(){
    if(isConnected && (owner == uNameVal) && isBigScreen && isAuth){
      setValidated(true)
    }else{setValidated(false)}
  }

  useEffect(()=>{
    desktop ? setIsBigScreen(true) : setIsBigScreen(false)
  },[desktop])

  useEffect(()=>{
    owner && validate()
  },[owner, isBigScreen])

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab, uData: uData! }}>
      {validated && children}
      {!isBigScreen && <p className="pg-notice" style={{ "marginTop": "20vh", "marginLeft": "20vw", "fontSize":"3vw", "fontWeight":"700" }}>{"Sorry, Dashboard is not available on mobile"}</p>}
    </DashboardContext.Provider>
  )
}

export { DashboardContext, DashboardProvider }