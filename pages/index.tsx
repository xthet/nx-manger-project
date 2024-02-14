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
					content="Manger - Fundraising on the blockchain"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta data-rh="true" property="og:type" content="hero" />
				<meta data-rh="true" property="og:site_name" content="Manger" />
				<meta
					data-rh="true"
					property="og:image"
					content="https://manger-project.vercel.app/manger.png"
				/>
				<meta
					data-rh="true"
					property="og:url"
					content="https://manger-project.vercel.app/"
				/>
				<meta
					data-rh="true"
					property="og:title"
					content="Manger - Fundraising on the blockchain"
				/>
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
