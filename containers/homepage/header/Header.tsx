import { ConnectionContext } from "@/contexts/connection"
import { conn } from "@/types"
import { truncateStr } from "@/utils/truncateStr"
import {
	faAddressCard,
	faChartLine,
	faUser,
	faWallet,
	faChartSimple,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/router"
import { useContext } from "react"

export default function Header() {
	const { isConnected, account, connect, isAuth, uNameVal }: conn =
		useContext(ConnectionContext)!
	const router = useRouter()

	function checkAction() {
		if (isConnected) {
			if (isAuth) {
				router.push("/create-campaign")
			} else {
				router.push("/signUp")
			}
		} else {
			connect()
		}
	}

	return (
		<header className="hd-header sc-padding fl-bc">
			<div className="hd-hero fl-cc fl-sb">
				<div className="hd-hero-title fl-tr fl-c">
					<h1>{"Fundraising on the blockchain."}</h1>
					<p>
						{
							"Manger is a reward-based crypto crowdfunding platform connecting interested backers with remarkable creators in web3 space."
						}
					</p>
					<button
						className="hd-connect fl-cc"
						onClick={() => {
							checkAction()
						}}
					>
						{!isConnected && (
							<FontAwesomeIcon icon={faWallet} className="hd-wallet-icon" />
						)}
						{isAuth && isConnected && (
							<FontAwesomeIcon
								icon={faChartSimple}
								className="hd-wallet-icon"
							/>
						)}
						{isConnected && !isAuth && (
							<FontAwesomeIcon icon={faUser} className="hd-wallet-icon" />
						)}

						{isConnected
							? isAuth
								? "Start a campaign"
								: "Sign Up"
							: "Connect your wallet"}
					</button>
				</div>

				<img src="/assets/manger_header_img.png" alt="hd-img" />
			</div>
		</header>
	)
}
