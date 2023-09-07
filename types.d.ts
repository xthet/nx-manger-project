import { BigNumber, ethers } from "ethers"

export interface conn {
	hasMetamask: boolean
	isConnected: boolean
	chainId: string
	signer: JsonRpcSigner | (() => JsonRpcSigner) | any
	account: string
	connect: () => void
	isAuth: boolean
	balance: string
	uNameVal: string
	usrData: udata | null
	defSigner: ethers.Wallet | null
}

export interface cmp {
	creator: string
	title: string
	description: string
	category: string
	tags: string
	goalAmount: BigNumber
	duration: BigNumber
	currentBalance: BigNumber
	state: number
	imageURI: string
	campaignURI: string
	deadline: BigNumber
}

export interface rwd {
	price: BigNumber
	title: string
	description: string
	pic: string
	perks: string[]
	delDate: BigNumber
	quantity: BigNumber
	infinite: boolean
	shipsTo: string[]
	donators: string[]
	surveyLink: string
}

export interface faq {
	question: string
	answer: string
}

export interface fcmp {
	campaign: string
	creator: string
	website: string
	twitter: string
	email: string
	title: string
	tagline: string
	category: string
	tags: Array<string>
	bio: string
	location: string
	duration: BigNumber
	goalAmount: BigNumber
	imageURI: string
	visualURI: string
	faqs: faq[]
	risks: string
	rewards: bool
	creators: Array<string>
	story: string
}

export interface auth {
	username: string
	email: string
	twitter: string
	contactAddress: string
}

export interface usr {
	username: string
	email: string
	twitter: string
	contactAddress: string
	sig: string
}

export interface udata {
	id: string
	address: string
	email: string
	backedCount: string
	backed: Array<string>
	username: string
	created: Array<string>
	publishedCount: string
	createdAt: BigNumber
	shipAddr: string
	pfp: string
}

export interface basicCmpObj {
	campaign: string
	creator: string
	title: string
	tagline: string
	category: string
	tags: Array<string>
	imageURI: string
	visualURI: string
	goalAmount: BigNumber
	duration: BigNumber
}

export interface contentCmpObj {
	faqs: faq[]
	story: string
	risks: string
}

export interface counOpt {
	value: string
	label: string
}

export interface rwdFormObj {
	rPrice: string
	rName: string
	rDesc: string
	rPic: string
	rType: string
	rDelD: string
	rQty: string
	infinite: boolean
	items: string[]
	shipsTo: string[]
}

export interface teamCmpObj {
	creators: string[]
	email: string
	website: string
	bio: string
	location: string
	twitter: string
}

export interface CmpObject {
	campaignAddress: string
	creator: string
}

export interface noti {
	id: string
	type: string
	title: string
	message: string
}

export interface enquiry {
	type: "single" | "multi"
	question: string
	options?: string[]
}

export interface survey {
	reward_address: string
	reward_creator: string
	intro: string
	credentials: boolean
	enquiries: enquiry[]
}

export interface creds {
	name: string
	country: string
	str_address: string
	city: string
	state: string
	postal_code: string
}

export interface response {
	question: string
	answer: string
}

export interface survey_response {
	responder_name: string
	reward_in_view: string
	credentials: creds | null
	responses: response[]
}

export interface wallet {
	name: "Metamask" | "Rabby" | "Wallet Connect" | "Gnosis Safe" | "Coinbase"
	icon: string
}
