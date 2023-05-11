import { conn } from "@/types"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { ConnectionContext } from "./connection"
import { validate } from "graphql"
import { useMediaQuery } from "react-responsive"

interface props {
  children: ReactNode
  owner: string
}

interface dshb {
  activeTab: string
  setActiveTab: Function
}

const DashboardContext = createContext<dshb>({ activeTab:"CREATED", setActiveTab: ()=>{} }) 

function DashboardProvider({ children, owner }:props){
  // check conn auth screen size own page
  const { isConnected, signer, account, uNameVal, isAuth }:conn = useContext(ConnectionContext)!
  const [activeTab, setActiveTab] = useState("CREATED")
  const isBigScreen = useMediaQuery({ query: "(min-width: 1000px)" })
  const [validated, setValidated] = useState(false)

  function validate(){
    if(isConnected && (owner == uNameVal) && isBigScreen && isAuth){
      setValidated(true)
    }else{setValidated(false)}
  }

  useEffect(()=>{
    owner && validate()
  },[owner, isBigScreen])

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab }}>
      {validated && children}
      {!isBigScreen && <p className="pg-notice" style={{ "marginTop": "20vh", "marginLeft": "20vw", "fontSize":"3vw", "fontWeight":"700" }}>{"Sorry, Dashboard is not available on mobile"}</p>}
    </DashboardContext.Provider>
  )
}

export { DashboardContext, DashboardProvider }