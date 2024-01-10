import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import s from "./WCM.module.sass"
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { wallet } from "@/types"
import { useConnect } from "wagmi"
import { useEffect } from "react"

export default function WalletChoiceModal({ offMe }: { offMe: Function }) {
	const {
		connect,
		connectors,
		error,
		isLoading,
		pendingConnector,
		isSuccess,
		isError,
	} = useConnect()

	useEffect(() => {
		!isLoading && isSuccess && offMe()
		isError && offMe()
	}, [isSuccess, isError])
	return (
		<>
			<div
				className={s.reactive}
				onClick={() => {
					offMe()
				}}
			/>
			<main className={s.modal}>
				<FontAwesomeIcon
					icon={faXmarkCircle}
					className={s.cancel_icon}
					onClick={() => {
						offMe()
					}}
				/>
				<div className={s.header}>
					<h2>Connect</h2>
					<p>
						{`By connecting a wallet, you agree to Manger's Terms of Service and
						acknowledge that you have read and understood the disclaimers
						therein.`}
					</p>
				</div>
				<div className={s.wallets_cont}>
					{connectors.slice(0, 3).map((connector) => {
						return (
							<div
								className={s.wallet}
								key={connector.id}
								onClick={() => connect({ connector })}
							>
								<img
									src={`/assets/wallets/${connector.id}.svg`}
									alt="mmw"
									className={s.wllt_img}
								/>
								<span>
									{connector.name}
									{/* {!connector.ready && " (unsupported)"} */}
									{isLoading &&
										connector.id === pendingConnector?.id &&
										" (connecting)"}
								</span>
							</div>
						)
					})}
					<div
						className={s.wallet}
						onClick={() => connect({ connector: connectors[3] })}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							className={s.wllt_ico}
						>
							<path d="M20 7V5c0-1.103-.897-2-2-2H5C3.346 3 2 4.346 2 6v12c0 2.201 1.794 3 3 3h15c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zm-2 9h-2v-4h2v4zM5 7a1.001 1.001 0 0 1 0-2h13v2H5z"></path>
						</svg>
						<span>
							{"Other"}
							{/* {!connectors[3].ready && " (unsupported)"} */}
							{isLoading &&
								connectors[3].id === pendingConnector?.id &&
								" (connecting)"}
						</span>
					</div>
				</div>
			</main>
		</>
	)
}
