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
						<img
							src="/assets/wallets/rabby.svg"
							alt="rabby"
							className={s.wllt_img}
						/>
						<span>
							{connectors[3].name}
							{!connectors[3].ready && " (unsupported)"}
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
