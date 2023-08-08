import { Dshbrd } from "@/containers/exportConts"
import { DashboardProvider } from "@/contexts/dashboard"
import Head from "next/head"
import { useRouter } from "next/router"

export default function Dashboard() {
  const router = useRouter()
  const profile = router.asPath.split("/")[2]

  return (
    <>
      <Head>
        <title>{"Manger | Dashboard"}</title>
        <meta
          name="description"
          content="Manger Project - Fundraising on the blockchain"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>
      <DashboardProvider owner={profile}>
        <Dshbrd />
      </DashboardProvider>
    </>
  )
}
