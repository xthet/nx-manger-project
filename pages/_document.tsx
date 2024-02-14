import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
	return (
		<Html lang="en">
			<Head>
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
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
