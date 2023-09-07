import Head from "next/head"
import { Blog, Campaigns, Header, HowItWorks } from "@/containers/exportConts"
import FeaturedCreators from "@/containers/homepage/featured_creators"

export default function Home() {
	return (
		<>
			<Head>
				<title>Manger</title>
				<meta
					name="description"
					content="Manger Project - Fundraising on the blockchain"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/assets/manger_favicon.svg" />
			</Head>
			<Header />
			<Campaigns />
			<HowItWorks />
			{/* <Blog /> */}
			<FeaturedCreators />
		</>
	)
}
