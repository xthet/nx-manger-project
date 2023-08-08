import Head from "next/head"
import { useRouter } from "next/router"

export default function CreatedCampaignAdmin() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{`Manger | Campaign`}</title>
        <meta
          name="description"
          content="Manger Project - Fundraising on the blockchain"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>
      {/* <CreatorActiveCampaign /> */}
      {/* <CreatorCampaignDetails /> */}
    </>
  )
}
