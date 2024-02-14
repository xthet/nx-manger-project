import Head from "next/head"
import { Blog, Campaigns, Header, HowItWorks } from "@/containers/exportConts"
import FeaturedCreators from "@/containers/homepage/featured_creators"

export default function Home() {
	return (
		<>
			<Head>
				<title>Manger — Fundraising on the blockchain</title>
				<meta
					name="description"
					content="Unlock the Power of Community with Manger: The Next-Generation Crowdfunding Web3 Protocol. Manger is revolutionizing the way we fund projects and ideas. Our protocol harnesses the power of the decentralized Web3 ecosystem to bring together a community of like-minded individuals who are passionate about making a difference."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta property="og:site_name" content="Manger" />
				<meta
					property="og:image"
					content="https://manger-project.vercel.app/manger.png"
				/>
				<meta property="og:url" content="https://manger-project.vercel.app/" />
				<meta
					property="og:title"
					content="Manger — Fundraising on the blockchain"
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
