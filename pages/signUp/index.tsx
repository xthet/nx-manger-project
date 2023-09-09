import { TimelineBox } from "@/components/exportComps"
import Crowdfunder from "@/constants/abis/CrowdFunder.json"
import { CHECK_UVAL } from "@/constants/subgraphQueries"
import { ConnectionContext } from "@/contexts/connection"
import { NotificationContext } from "@/contexts/notification"
import { conn } from "@/types"
import { truncateStr } from "@/utils/truncateStr"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import fleek from "@fleekhq/fleek-storage-js"
import { faImages } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import Head from "next/head"
import { useRouter } from "next/router"
import onetime from "onetime"
import { FormEvent, useContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import ReactLoading from "react-loading"
import { v4 } from "uuid"

export default function SignUp() {
	const { isConnected, connect, account, signer, isAuth }: conn =
		useContext(ConnectionContext)!
	const { dispatch } = useContext(NotificationContext)!
	const [twit, setTwit] = useState("")
	const [usrName, setUsrName] = useState("")
	const [cookies, setCookie, removeCookie] = useCookies(["sess_sig"])
	const router = useRouter()
	const [imgState, setImgState] = useState("unset")
	const [imgURLToBe, setImgURLToBe] = useState("")
	const [showImgNoti, setShowImgNoti] = useState(false)
	const [showInvalidUVal, setShowInvalidUVal] = useState(false)
	const [uValDuplicate, setUValDuplicate] = useState(false)

	const [showTBX, setShowTBX] = useState(false)
	const tlArr = [
		"Entering credentials",
		"Awaiting confirmation",
		"Account Created",
	]
	const [tlIndex, setTlIndex] = useState(0)
	const [tlClosable, setTlClosable] = useState(false)

	async function uploadImg(e: any) {
		const date = new Date()
		const timestamp = date.getTime()
		const imgData = {
			apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY!,
			apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SEC!,
			key: `manger/usrPfps/${truncateStr(account, 10)}/MNG_${timestamp}`,
			data: e.target.files[0],
		}
		try {
			const tme = setTimeout(() => {
				setShowImgNoti(true)
			}, 10000)
			const response = await fleek.upload(imgData)
			clearTimeout(tme)
			setImgURLToBe(`ipfs://${response.hashV0}`)
			setImgState("finished")
		} catch (error) {
			console.log(error)
		}
	}

	async function checkName(e: string) {
		if (e.length > 0) {
			const valid = /^[a-z][a-z0-9_]{4,19}$/.test(e)
			if (!valid) {
				setShowInvalidUVal(true)
			} else {
				setShowInvalidUVal(false)
			}
		}

		const client = new ApolloClient({
			uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
			cache: new InMemoryCache(),
		})

		const userData = await client
			.query({
				query: CHECK_UVAL,
				variables: { term: e },
			})
			.then(async (data) => {
				return data.data.userAddeds
			})
			.catch((err) => console.log("Error fetching data: ", err))

		if (userData.length > 0) {
			setUValDuplicate(true)
		} else {
			setUValDuplicate(false)
		}
	}

	const handleSubmit = onetime(async (e: FormEvent<HTMLFormElement> | any) => {
		setShowTBX(true)
		const data = new FormData(e.target)
		const username = data.get("username")!.toString()
		// let twitter = data.get("twitter")!.toString() ? data.get("twitter")!.toString() : "_NIL"
		let email = data.get("email")!.toString()
		// let conAddress = data.get("conAddress")!.toString() ? data.get("conAddress")!.toString() : "_NIL"
		let conAddress = "_NIL"

		// if(!(twitter == "_NIL") && !twitter.includes("https://twitter.com/")){
		//   twitter = `https://twitter.com/${twitter.replace("@" || "https://twitter.com/" || "www.twitter.com/" || "https://www.twitter.com/" , "")}`
		// }

		if (username && email) {
			const authMsg = `Welcome to Manger!
      \nClick to sign in and accept the Manger Terms of Service.
      \nThis request will not cost any gas fees.
      \nYour authentication status will reset after 24 hours.
      \nTimestamp: ${Date.now()}
      `

			const crowdfunder = new ethers.Contract(
				Crowdfunder.address,
				Crowdfunder.abi,
				signer
			)
			const pfp = imgURLToBe ? imgURLToBe : "_NIL"
			try {
				setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 1))
				const addUserTx = await crowdfunder.addUser(
					account,
					username,
					email,
					conAddress,
					pfp
				)
				await addUserTx.wait(1)

				dispatch({
					type: "ADD_NOTI",
					payload: {
						id: v4(),
						type: "SUCCESS",
						title: "Account Created Successfully",
						message: `Welcome to Manger ${username}`,
					},
				})

				const today = new Date()
				let tomorrow = new Date()
				tomorrow.setDate(today.getDate() + 1)
				const iSig = await signer.signMessage(authMsg)
				setTlIndex((prev) => (prev >= tlArr.length ? prev : prev + 2))
				setCookie("sess_sig", iSig, { expires: tomorrow, path: "/" })

				router.push("/campaigns")
				setTimeout(() => {
					router.reload()
				}, 3000)
			} catch (error) {
				dispatch({
					type: "ADD_NOTI",
					payload: {
						id: v4(),
						type: "FAILURE",
						title: "Account Creation Failed",
						message: "Sorry, we couldn't create your account",
					},
				})
				console.log(error)
				setShowTBX(false)
				setTlIndex(0)
			}
		}
	})

	useEffect(() => {
		let id: any
		if (usrName.length > 0) {
			id = setTimeout(() => {
				checkName(usrName).catch((e) => console.log(e))
			}, 1000)
		} else {
			setUValDuplicate(false)
			setShowInvalidUVal(false)
		}
		return () => {
			clearTimeout(id)
		}
	}, [usrName])

	return (
		<>
			<Head>
				<title>{"Manger | Sign Up"}</title>
				<meta
					name="description"
					content="Manger Project - Fundraising on the blockchain"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/assets/manger_favicon.svg" />
			</Head>
			<section className="su-page">
				<div className="su-bg">
					<img src="/assets/su_pg.png" alt="su_bg" />
					<div className="su-bg-overlay"></div>
					<div className="su-bg-grad"></div>
				</div>
				{showTBX && (
					<TimelineBox
						offMe={() => {
							setShowTBX(false)
						}}
						arr={tlArr}
						arrIndex={tlIndex}
						closable={tlClosable}
					/>
				)}
				{!isConnected ? (
					<div
						className="rt-conn-cta"
						style={{ position: "relative", zIndex: "3" }}
					>
						<p style={{ color: "white" }}>
							{"Connect your wallet to sign up!!"}
						</p>
						<button
							onClick={() => {
								connect()
							}}
						>
							{"Connect your wallet"}
						</button>
					</div>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault()
							!uValDuplicate && !showInvalidUVal && handleSubmit(e)
						}}
						className="su-container"
					>
						<div className="su-usr-address">{truncateStr(account, 14)}</div>
						<h1 className="su-title">{"Create a new account."}</h1>
						<p className="su-info">
							{
								"Already a member?, please switch to the address you used to sign up."
							}
						</p>

						<div className="su-img-grp">
							<p className="su-avt-title">{"Avatar"}</p>
							<div className="su-img-upld">
								<div className="su-img-inpt">
									<input
										type="file"
										id="bt-card-img"
										hidden
										onChange={(e) => {
											uploadImg(e)
											setImgState("loading")
										}}
									/>
									<label htmlFor="bt-card-img" className="su-img-label">
										<div className="su-img-container">
											{imgState == "loading" ? (
												<ReactLoading type="bubbles" color="#827B93" />
											) : imgState == "finished" ? (
												imgURLToBe && (
													<img
														src={imgURLToBe.replace(
															"ipfs://",
															"https://ipfs.io/ipfs/"
														)}
														alt="--"
													/>
												)
											) : (
												<FontAwesomeIcon
													icon={faImages}
													className="su-ipld-img-icon"
												/>
											)}
										</div>
									</label>
								</div>
								{/* {showImgNoti && <small className="inpt-small-noti">{"The network is congested right now, Image upload may take a while"}</small>} */}
							</div>
							<p className="su-avt-spec">{"recommended: 150px x 150px"}</p>
						</div>

						<div className="su-inpt-grp">
							<div className="su-inpt short">
								<div className="su-inpt-lbl">
									<label htmlFor="username">{"Username"}</label>
									{showInvalidUVal ? (
										<small style={{ color: "red" }}>
											{"Invalid Username!!"}
										</small>
									) : uValDuplicate ? (
										<small style={{ color: "red" }}>
											{"Username already exists!!"}
										</small>
									) : (
										<small style={{ color: "yellow" }}>{"required"}</small>
									)}
								</div>
								<input
									type="text"
									name="username"
									placeholder="username"
									required
									className="su-form-input"
									onChange={(e) => {
										setUsrName(e.target.value)
									}}
									value={usrName}
								/>
							</div>
							{/* <div className="su-inpt short">
                <div className="su-inpt-lbl">
                  <label htmlFor="twitter">{"Twitter"}</label>
                  <small style={{ "opacity":"0.7" }}>{twit && `https://twitter.com/${cutStr(twit,14)}`}</small>
                </div>
                <input type="text" name="twitter" placeholder="twitter_handle" className="su-form-input" 
                  onChange={(e)=>{setTwit(e.target.value)}}
                />
              </div> */}
						</div>
						<div className="su-inpt full">
							<div className="su-inpt-lbl">
								<label htmlFor="email">{"Email address"}</label>
								<small style={{ color: "yellow" }}>{"required"}</small>
							</div>
							<input
								type="email"
								name="email"
								placeholder="email address"
								required
								className="su-form-input"
							/>
						</div>
						{/* <div className="su-inpt full">
              <div className="su-inpt-lbl">
                <label htmlFor="hAddress">{"Shipping address"}</label>
                <small style={{ "color":"yellow" }}>{"required"}</small>
              </div>
              <textarea cols={91} rows={2} name="conAddress" placeholder="21, Flo Drive, Bu County, 32337 FL, USA" className="su-form-input" required/>
            </div> */}
						<div className="su-cta">
							<button type="submit">{"Create account"}</button>
						</div>
					</form>
				)}
			</section>
		</>
	)
}
