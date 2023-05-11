import { conn } from "@/types"
import { ReactNode, createContext, useContext, useState } from "react"
import { ConnectionContext } from "./connection"

interface props {
  children: ReactNode
  owner: string
}

interface dshb {
  activeTab: string
  setActiveTab: Function
}

const DashboardContext = createContext<dshb | null>(null) 


function DashboardProvider({ children, owner }:props){
  const { isConnected, signer, account }:conn = useContext(ConnectionContext)!
  const [activeTab, setActiveTab] = useState("CREATED")

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </DashboardContext.Provider>
  )
}

export { DashboardContext, DashboardProvider }