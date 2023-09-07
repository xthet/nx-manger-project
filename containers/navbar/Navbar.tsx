import { Logo, Sidebar, UserBox } from "@/components/exportComps"
import { SEARCH_CAMPAIGNS } from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { useQUData } from "@/hooks/useQUData"
import { useScroll } from "@/hooks/useScroll"
import { conn } from "@/types"
import { cutStr } from "@/utils/cutStr"
import { truncateStr } from "@/utils/truncateStr"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import {
	faAngleDown,
	faAngleUp,
	faBarsStaggered,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Blockies from "react-blockies"
import { useMediaQuery } from "react-responsive"

function Menu() {
	return (
		<>
			<Link href="/campaigns">{"Campaigns"}</Link>
			<Link href="/#how-it-works">{"How it works"}</Link>
			<Link href="/">{"About us"}</Link>
			{/* <Link href="/#blog">{"Blog"}</Link> */}
		</>
	)
}

export default function Navbar() {
	const { isConnected, connect, account, uNameVal }: conn =
		useContext(ConnectionContext)!
	const [SiInvis, setSiInvis] = useState(true)
	const [UBInvis, setUBInvis] = useState(true)
	const [UBOff, setUBOff] = useState(true)
	const { scrollY, scrollX, scrollDirection } = useScroll()
	const router = useRouter()
	const mobile = useMediaQuery({ query: "(max-width: 600px)" })
	// const [isBigScreen, setIsBigScreen] = useState(true)
	function siVisible(bool: boolean) {
		setSiInvis(bool)
	}

	// useEffect(()=>{
	//   async function getCampaign(){
	//     let srch = "rune fencer illya"
	//     console.log(srch.split(" ").join(" | "))
	//     const client = new ApolloClient({
	//       uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
	//       cache: new InMemoryCache(),
	//     })

	//     const cmpData = await client
	//       .query({
	//         query: SEARCH_CAMPAIGNS,
	//         variables: { term: srch.split(" ").join("|") }
	//       })
	//       .then(async (data) => {console.log(data.data.campaignSearch)})
	//       .catch(err => console.log("Error fetching data: ", err))
	//   }

	//   getCampaign().catch(e=>console.log(e))
	// },[])

	return (
		<nav
			className={`nv-navbar sc-padding ${
				scrollDirection == "down"
					? scrollY >= 8 && router.pathname !== "/create-campaign"
						? "nv-active"
						: ""
					: ""
			}  
        ${
					(router.pathname == "/" ||
						router.pathname == "/profile/[profile]" ||
						router.pathname == "/create-campaign" ||
						router.pathname == "/signUp") &&
					"page-unfill"
				}
        ${
					router.pathname.includes("/profile/[profile]/dashboard") &&
					"nv-active"
				}
        ${!UBInvis && "nv-active"}
        ${mobile && "nv-active"}
        `}
		>
			<div className="fl-cc fl-sb nv-menu-wrapper">
				<Logo className="nv-logo fl-cl" />
				<div className="nv-menu fl-cr">
					<div className="nv-menu-links fl-cr">
						<Menu />
						{!isConnected ? (
							<button
								className="nv-connect"
								onClick={() => {
									connect()
								}}
							>
								{"Connect"}
							</button>
						) : (
							<div
								className="nv-conn-info fl-cl"
								onClick={() => {
									setUBInvis((prev) => !prev)
									setUBOff((prev) => !prev)
								}}
							>
								<Blockies
									seed={account}
									scale={3}
									size={8}
									className="nv-jazzicon"
									color="#b78be4"
									bgColor="#361E77"
									spotColor="#fff"
								/>
								<p className="nv-usr-address">
									{uNameVal.length > 7 ? cutStr(uNameVal, 7) : uNameVal}
								</p>
								{UBOff ? (
									<FontAwesomeIcon
										icon={faAngleDown}
										className="nv-drpdown-icon"
									/>
								) : (
									<FontAwesomeIcon
										icon={faAngleUp}
										className="nv-drpdown-icon"
									/>
								)}
							</div>
						)}
					</div>
					{!UBInvis && (
						<UserBox
							iVisible={UBOff}
							offMe={() => {
								setUBInvis(true)
								setUBOff(true)
							}}
						/>
					)}
					{!SiInvis && <Sidebar myVis={siVisible} />}
					<FontAwesomeIcon
						icon={faBarsStaggered}
						className="nv-hamburger"
						onClick={() => {
							setSiInvis((prev) => !prev)
						}}
					/>
				</div>
			</div>
		</nav>
	)
}
