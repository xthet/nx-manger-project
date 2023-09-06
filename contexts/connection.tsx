import WalletChoiceModal from "@/components/WCM"
import { GET_USER_DETAILS } from "@/constants/subgraphQueries"
import { useIsConnected } from "@/hooks/useIsConnected"
import { conn, udata } from "@/types"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import {
	ReactNode,
	createContext,
	useCallback,
	useEffect,
	useState,
} from "react"
import { useCookies } from "react-cookie"
import {
	sepolia,
	useAccount,
	useBalance,
	useNetwork,
	useSigner,
	useSwitchNetwork,
} from "wagmi"

const ConnectionContext = createContext<conn | null>(null)

function ConnectionProvider({ children }: { children: ReactNode }) {
	const { address: account, connector: found_wallet } = useAccount()
	const { isConnected } = useIsConnected()
	const { chain } = useNetwork()
	const { switchNetwork } = useSwitchNetwork()
	const [hasMetamask, setHasMetamask] = useState(false)
	const { data: signer } = useSigner()
	const { data: bi_balance } = useBalance({
		address: account ?? "0x0000000000000000000000000000000000000000",
	})
	const router = useRouter()
	const [WCM, setWCM] = useState(false)
	const [defSigner, setDefSigner] = useState<ethers.Wallet | null>(null)
	const [balance, setBalance] = useState("_NIL")
	const [uNameVal, setUNameVal] = useState("")
	const [usrData, setUsrData] = useState<udata | null>(null)
	const [cookies, setCookie, removeCookie] = useCookies(["sess_sig"])
	const [seSSig, setSeSSig] = useState("")
	const [isAuth, setIsAuth] = useState(false)
	const [chainId, setChainId] = useState("1")

	function connect() {
		setWCM(true)
	}

	async function initDefWall() {
		const provider = ethers.providers.getDefaultProvider(
			process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!
		)
		const wallet = new ethers.Wallet(
			process.env.NEXT_PUBLIC_FORMIC_PRIVATE_KEY!,
			provider
		)
		setDefSigner(wallet)
	}

	async function auth() {
		if (account && account.length > 0 && seSSig) {
			const client = new ApolloClient({
				uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
				cache: new InMemoryCache({
					typePolicies: {
						Query: {
							fields: {
								userAdded: {
									merge(existing, incoming) {
										return incoming
									},
								},
							},
						},
					},
				}),
			})

			const userData: udata = await client
				.query({
					query: GET_USER_DETAILS,
					variables: { userAddress: account.toLowerCase() },
				})
				.then(async (data) => {
					return data.data.userAdded
				})
				.catch((err) => console.log("Error fetching data: ", err))
			setUNameVal(userData && userData.username ? userData.username : account)
			setUsrData(userData)

			if (
				userData &&
				userData.username &&
				userData.email &&
				userData.shipAddr &&
				seSSig
			) {
				setIsAuth(true)
			} else {
				setIsAuth(false)
			}
		} else {
			return
		}
	}

	useEffect(() => {
		isConnected && account && auth().catch((e) => console.log(e))
	}, [isConnected, account, seSSig, chain, chainId])

	const findSig = useCallback(async () => {
		const sSig = cookies.sess_sig
		if (sSig) {
			setSeSSig(sSig)
		} else if (signer) {
			const authMsg = `Welcome to Manger!
        \nClick to sign in and accept the Manger Terms of Service.
        \nThis request will not cost any gas fees.
        \nYour authentication status will reset after 24 hours.
        \nTimestamp: ${Date.now()}
      `
			const today = new Date()
			let tomorrow = new Date()
			tomorrow.setDate(today.getDate() + 1)
			const iSig = await signer.signMessage(authMsg)
			setCookie("sess_sig", iSig, { expires: tomorrow, path: "/" })
			setSeSSig(iSig)
		}
	}, [account, isConnected, chainId, switchNetwork, found_wallet])

	useEffect(() => {
		isConnected && !seSSig && findSig().catch((e) => console.log(e))
	}, [findSig])

	useEffect(() => {
		if (chain && chain.name !== "sepolia" && switchNetwork) {
			switchNetwork(sepolia.id)
		}
		if (bi_balance) {
			setBalance(bi_balance.formatted)
		}
		initDefWall().catch((e) => console.log(e))
		if (typeof window !== "undefined" && window.ethereum) {
			setHasMetamask(true)
		} else if (
			confirm(
				"You need a Web3 wallet to use this site,\nWould you like to install Metamask"
			)
		) {
			router.push("https://metamask.io/")
		}
		async function get_chain_id() {
			if (isConnected && account && found_wallet) {
				const chainId = found_wallet.getChainId()
				setChainId(chainId.toString())
			}
		}
		get_chain_id()
	}, [isConnected, account, found_wallet, bi_balance, chain, switchNetwork])

	const payload: conn = {
		hasMetamask,
		isConnected,
		chainId,
		signer,
		account: account ?? "0x0000000000000000000000000000000000000000",
		connect,
		isAuth,
		balance,
		uNameVal,
		usrData,
		defSigner: defSigner!,
	}

	return (
		<ConnectionContext.Provider value={payload}>
			{WCM && (
				<WalletChoiceModal
					offMe={() => {
						setWCM(false)
					}}
				/>
			)}
			{children}
		</ConnectionContext.Provider>
	)
}

export { ConnectionContext, ConnectionProvider }
