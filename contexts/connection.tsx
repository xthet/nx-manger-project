import { GET_USER_DETAILS } from "@/constants/subgraphQueries"
import { conn, udata } from "@/types"
import { cutStr } from "@/utils/cutStr"
import { truncateStr } from "@/utils/truncateStr"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { MetaMaskInpageProvider } from "@metamask/providers"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import { ReactNode, createContext, useCallback, useEffect, useState } from "react"
import { useCookies } from "react-cookie"

interface props{
  children: ReactNode
}

declare global{
  interface Window {
    ethereum?: MetaMaskInpageProvider | any
  }
}

const ConnectionContext = createContext<conn | null>(null)

function ConnectionProvider ({ children }:props) {
  const router = useRouter()
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [chainId, setChainId] = useState("1")
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | (() => ethers.providers.JsonRpcSigner) | null | any>(null)
  const [defSigner, setDefSigner] = useState<ethers.Wallet | null>(null)
  const [account, setAccount] = useState("")
  const [balance, setBalance] = useState("00")
  const [uNameVal, setUNameVal] = useState("")
  const [usrData, setUsrData] = useState<udata|null>(null)
  const [cookies, setCookie, removeCookie] = useCookies(["sess_sig"])
  const [seSSig, setSeSSig] = useState("")

  async function connect()
  {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setAccount(accounts[0])
        setIsConnected(true)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        setSigner(signer)
        const { chainId } = await provider.getNetwork()
        setChainId(chainId.toString())
      } catch (e) {
        console.log(e)
      }
    } else {
      setIsConnected(false)
    }
  }

  async function auth(){
    if(account.length > 0 && seSSig){    
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
        cache: new InMemoryCache({
          typePolicies:{
            Query:{
              fields: {
                userAdded:{
                  merge(existing, incoming){return incoming}
                }
              }
            }
          }
        }),
      })
        
      const userData:udata = await client
        .query({
          query: GET_USER_DETAILS,
          variables: { userAddress: account.toLowerCase() }
        })
        .then(async (data) => {return data.data.userAdded})
        .catch(err => console.log("Error fetching data: ", err))
      setUNameVal((!userData || !userData.username) ? account : userData.username)
      setUsrData(userData)

      if(userData && userData.username && userData.email && userData.shipAddr && seSSig){
        setIsAuth(true)
      }else{setIsAuth(false)}
    }else{return}
  }

  useEffect(()=>{
    isConnected && account && auth().catch(e=>console.log(e))
  },[isConnected, account, seSSig])

  const findSig = useCallback(async () =>{ const sSig = cookies.sess_sig
    if(sSig){
      setSeSSig(sSig)
    }else if(signer){
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
  },[account])

  useEffect(()=>{
    isConnected && findSig().catch(e=>console.log(e))
  },[findSig])

  const updateUI = async()=>
  {
    if(typeof window.ethereum !== "undefined")
    {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if(accounts.length)
        {
          setIsConnected(true)
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const balance = await provider.getBalance(accounts[0])
          const signer = await provider.getSigner()
          setSigner(signer)
          const { chainId } = await provider.getNetwork()
          if(chainId.toString() !== "11155111")
          {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xAA36A7" }],
            })
            console.log("You have switched to the right network")
          }
          setAccount(accounts[0])
          setBalance(ethers.utils.formatEther(balance))
          setChainId(chainId.toString())
        }
        else{setIsConnected(false)}

      } catch (e) {
        console.log(e)
      }
    }
  }

  async function initDefWall(){
    const provider = await ethers.providers.getDefaultProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!)
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_FORMIC_PRIVATE_KEY!, provider)
    setDefSigner(wallet)
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true)
      updateUI()
      window.ethereum.on("chainChanged", async () => {
        await updateUI()
        isConnected && account && await auth()
        router.reload()
      })
      window.ethereum.on("accountsChanged", async () => {
        await updateUI()
        isConnected && account && await auth()
      })
      initDefWall().catch(e=>console.log(e))
    }else{if(confirm("You need a Metamask wallet to use this site,\nWould you like to install Metamask")){
      router.push("https://metamask.io/")
    }else{alert("Please install Metamask ;)")}}
  }, [account, chainId])

  const payload:conn = { hasMetamask, isConnected, chainId, signer, account, connect, isAuth, balance, uNameVal, usrData, defSigner:defSigner! }

  return (
    <ConnectionContext.Provider value={payload}>
      {children}
    </ConnectionContext.Provider>
  )
}

export { ConnectionContext, ConnectionProvider }

