import { CampaignsPage } from "@/containers/exportConts"
import Error from "next/error"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Campaigns(){
  const router = useRouter()
  const { category } = router.query

  return (
    <>
      <Head>
        <title>{"Manger | Campaigns"}</title>
        <meta name="description" content="Manger Project - Fundraising on the blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>
      {
        category && typeof(category) == "string" ? <CampaignsPage cat={category} offVal={0}/> : <Error statusCode={404}/>
      }
    </>
  )
}