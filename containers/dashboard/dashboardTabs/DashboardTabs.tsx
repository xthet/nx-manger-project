import { DashboardContext } from "@/contexts/dashboard"
import React, { useContext } from "react"
import { DshbBacked, DshbCreated } from "../../exportConts"

export default function DashboardTabs() {
  const { activeTab, setActiveTab } = useContext(DashboardContext)!
  return (
    <>
      {activeTab == "CREATED" && <DshbCreated/>}
      {activeTab == "BACKED" && <DshbBacked/>}
    </>
  )
}
