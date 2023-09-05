import { PropsWithChildren } from "react"
import {
	WagmiConfig,
	configureChains,
	createClient,
	mainnet,
	sepolia,
} from "wagmi"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

const { chains, provider, webSocketProvider } = configureChains(
	[mainnet, sepolia],
	[
		jsonRpcProvider({
			rpc: (sepolia) => ({
				http: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!,
			}),
		}),
		// alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
		// publicProvider(),
	]
)

// Set up wagmi config
const client = createClient({
	autoConnect: true,
	connectors: [
		new MetaMaskConnector({ chains }),
		new CoinbaseWalletConnector({
			chains,
			options: {
				appName: "wagmi",
			},
		}),
		new WalletConnectConnector({
			chains,
			options: {
				projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
			},
		}),
		new InjectedConnector({
			chains,
			options: {
				shimDisconnect: true,
			},
		}),
	],
	provider,
	webSocketProvider,
})

const WagmiProvider: React.FC<PropsWithChildren> = ({ children }) => {
	return <WagmiConfig client={client}>{children}</WagmiConfig>
}

export default WagmiProvider
