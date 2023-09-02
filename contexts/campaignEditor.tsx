import { useCdata } from "@/hooks/useCdata"
import { basicCmpObj, conn, fcmp } from "@/types"
import { BigNumber } from "ethers"
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"
import { ConnectionContext } from "./connection"

interface cec {
	activeTab: string
	setActiveTab: Function
	updateGrandCmp: Function
	currAddress: string
	grandCmp: fcmp
	grandURI: string
	setGrandURI: Function
	loading: boolean
	isCreator: boolean
	ptitle: string
	staticCmp: fcmp
}
const initFullCmp: fcmp = {
	campaign: "",
	creator: "",
	website: "",
	twitter: "",
	email: "",
	title: "",
	tagline: "",
	category: "",
	tags: [],
	bio: "",
	location: "",
	duration: BigNumber.from("0"),
	goalAmount: BigNumber.from("0"),
	imageURI: "",
	visualURI: "",
	faqs: [],
	risks: "",
	rewards: false,
	creators: [],
	story: "",
}

const CampaignEditorContext = createContext<cec | null>(null)

function CampaignEditorProvider({
	children,
	cmpAddress,
	validator,
}: {
	children: ReactNode
	cmpAddress: string
	validator: Function
}) {
	const { isConnected, signer, account }: conn = useContext(ConnectionContext)!
	const [activeTab, setActiveTab] = useState("Basics")
	const [currAddress, setCurrAddress] = useState(cmpAddress)
	const [grandURI, setGrandURI] = useState("")
	const { loading, campaignDetails } = useCdata(cmpAddress)
	const [grandCmp, setGrandCmp] = useState<fcmp>(initFullCmp)
	const [staticCmp, setStaticCmp] = useState<fcmp>(initFullCmp)
	const [isCreator, setIsCreator] = useState(false)
	const [ptitle, setPtitle] = useState("")

	function updateGrandCmp(obj: Object) {
		setGrandCmp((prev) => ({ ...prev, ...obj }))
		setStaticCmp((prev) => ({ ...prev, ...obj }))
	}

	useEffect(() => {
		setPtitle(campaignDetails.title)

		async function getCmp() {
			if (campaignDetails.campaignURI) {
				const cmp = await fetch(
					campaignDetails.campaignURI.replace(
						"ipfs://",
						"https://ipfs.io/ipfs/"
					)
				)
					.then((res) => res.json())
					.then((data) => data)
					.catch((e) => console.log(e))
				setGrandCmp(cmp)
				localStorage.setItem("staticGrandCmp", JSON.stringify(cmp))
			} else {
				localStorage.setItem("staticGrandCmp", JSON.stringify(initFullCmp))
			}

			// const recEdit = localStorage.getItem("staticGrandCmp")
			// if (!recEdit) {
			// 	localStorage.setItem("staticGrandCmp", JSON.stringify(cmp))
			// } else {
			// 	updateGrandCmp(JSON.parse(recEdit))
			// 	localStorage.setItem("staticGrandCmp", JSON.stringify(cmp))
			// }
		}
		campaignDetails && getCmp().catch((e) => console.log(e))
	}, [loading, campaignDetails])

	useEffect(() => {
		function validateEditor() {
			if (account.toLowerCase() == campaignDetails.creator.toLowerCase()) {
				setIsCreator(true)
				validator()
			}
		}
		campaignDetails && campaignDetails.creator && validateEditor()
	}, [account, cmpAddress, campaignDetails.creator, isConnected])

	useEffect(() => {
		if (grandCmp.title) {
			localStorage.setItem("staticGrandCmp", JSON.stringify(grandCmp))
		}
	}, [grandCmp])

	useEffect(() => {
		const tabRec = localStorage.getItem("eCurrTab")
		if (tabRec) {
			const nTab = JSON.parse(tabRec)
			setActiveTab(nTab.currTab)
		} else {
			setActiveTab("Basics")
		}
	}, [])

	useEffect(() => {
		activeTab !== "Basics" &&
			localStorage.setItem("eCurrTab", JSON.stringify({ currTab: activeTab }))
	}, [activeTab])

	const payload: cec = {
		activeTab,
		setActiveTab,
		updateGrandCmp,
		currAddress,
		grandCmp,
		grandURI,
		setGrandURI,
		loading,
		isCreator,
		ptitle,
		staticCmp,
	}

	return (
		<CampaignEditorContext.Provider value={payload}>
			{children}
		</CampaignEditorContext.Provider>
	)
}

export { CampaignEditorContext, CampaignEditorProvider }
