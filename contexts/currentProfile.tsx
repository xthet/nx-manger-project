import { conn } from "@/types"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { ConnectionContext } from "./connection"
import { useRouter } from "next/router"
import useFindUser from "@/hooks/useFindUser"

interface props{
  children:ReactNode
  address:string
}

interface currProfile{
  currProfile:string
  activeTab:string
  isOwnPage:boolean
  setActiveTab:Function
}

const ProfileContext = createContext<currProfile | null>(null)

function ProfileProvider ({ children, address }:props){
  const { isConnected, signer, account }:conn = useContext(ConnectionContext)!
  const [activeTab, setActiveTab] = useState("CREATED")
  const [isOwnPage, setIsOwnPage] = useState(false)

  useEffect(()=>{
    isConnected && (account.toLowerCase() == address.toLowerCase()) && setIsOwnPage(true)
  },[isConnected, address, account])

  return (
    <ProfileContext.Provider value={{ currProfile:address, activeTab, isOwnPage, setActiveTab }}>
      {children}
    </ProfileContext.Provider>
  )
}

export { ProfileContext, ProfileProvider }