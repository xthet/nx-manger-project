import { Dshbrd } from "@/containers/exportConts"
import { ConnectionContext } from "@/contexts/connection"
import { DashboardProvider } from "@/contexts/dashboard"
import { conn } from "@/types"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useState } from "react"

export default function Dashboard() {
  const { isConnected, account, connect, isAuth, uNameVal }:conn = useContext(ConnectionContext)!
  const router = useRouter()
  const profile = router.asPath.split("/")[2]

  return (
    <>
      <Head>
        <title>{"Manger | Dashboard"}</title>
        <meta name="description" content="Manger Project - Fundraising on the blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>
      <DashboardProvider owner={profile}>
        <Dshbrd/>
      </DashboardProvider>
    </>
  )
}
