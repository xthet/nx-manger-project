import { conn, contentCmpObj, faq, fcmp } from "@/types"
import {
	faCaretDown,
	faCaretLeft,
	faCirclePlus,
	faCircleXmark,
	faSquarePen,
	faSquareXmark,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useRef, useState } from "react"
import { truncateStr } from "@/utils/truncateStr"
import { ConnectionContext } from "@/contexts/connection"
import fleek from "@fleekhq/fleek-storage-js"
import { CampaignEditorContext } from "@/contexts/campaignEditor"
import ReactLoading from "react-loading"
import { Editor } from "@tinymce/tinymce-react"

export default function EContentTab() {
	const { isConnected, connect, account, signer, isAuth }: conn =
		useContext(ConnectionContext)!
	const {
		updateGrandCmp,
		setActiveTab,
		grandCmp,
		staticCmp,
		currAddress,
		ptitle,
	} = useContext(CampaignEditorContext)!
	const [faqs, setFaqs] = useState<faq[]>([])
	const [currFaq, setCurrFaq] = useState<any | number>(null)
	const [currFaqQ, setCurrFaqQ] = useState("")
	const [currFaqA, setCurrFaqA] = useState("")
	const [onFaqEdit, setOnFaqEdit] = useState(false)
	const [showFaqInput, setShowFaqInput] = useState(false)
	const [story, setStory] = useState("")
	const [risks, setRisks] = useState("")

	function updateFaqs() {
		if (onFaqEdit) {
			if (currFaq >= 0) {
				faqs[currFaq] = { question: currFaqQ, answer: currFaqA }
				setFaqs((prev) => [...faqs])
			}
		} else {
			setFaqs((prev) => [...prev, { question: currFaqQ, answer: currFaqA }])
		}

		setCurrFaqQ("")
		setCurrFaqA("")
		setShowFaqInput(false)
		setCurrFaq(null)
		setOnFaqEdit(false)
	}

	function editFaq(faq: faq, index: number) {
		setOnFaqEdit(true)
		setShowFaqInput(true)
		setCurrFaqQ(faq.question)
		setCurrFaqA(faq.answer)
		setCurrFaq(index)
	}

	async function uploadImg(blobInfo: any, progress: any) {
		const timestamp = new Date().getTime()
		const imgData = {
			apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY!,
			apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SEC!,
			key: `manger/cmpImgUploads/${truncateStr(account, 10)}/MNG_${timestamp}`,
			// TODO: change 0x30 to cmpTitle
			data: blobInfo.blob(),
		}
		try {
			const response = await fleek.upload(imgData)
			return `https://ipfs.io/ipfs/${response.hashV0}`
		} catch (error) {
			console.log(error)
			return "Image upload failed"
		}
	}

	function handleContentSave() {
		const contentObj: contentCmpObj = {
			faqs,
			risks,
			story,
		}
		updateGrandCmp(contentObj)
	}

	function handleContentSubmit() {
		if (story && risks) {
			handleContentSave()
			setActiveTab("Team")
		}
	}

	// useEffect(()=>{

	// },[staticCmp])

	useEffect(() => {
		function startTab() {
			if (staticCmp.story) {
				setFaqs(staticCmp.faqs)
				setStory(staticCmp.story)
				setRisks(staticCmp.risks)
				// console.log("there")
			} else {
				// console.log(staticCmp.story)
				const findGrandCmp = localStorage.getItem("staticGrandCmp")
				const gcmp: fcmp = JSON.parse(findGrandCmp!)
				console.log(findGrandCmp)
				setFaqs(gcmp.faqs)
				setStory(gcmp.story)
				setRisks(gcmp.risks)
				// console.log("here")
			}
		}
		ptitle && startTab()
	}, [grandCmp, staticCmp])

	return (
		<>
			{!currAddress ? (
				<div className="ct-denial">
					<p>
						{"You need an existing campaign smart contract to create content"}
					</p>
					<ReactLoading type="bubbles" color="#827B93" />
					<button
						className="ct-notice-btn"
						onClick={() => {
							setActiveTab("Basics")
						}}
					>
						<FontAwesomeIcon
							icon={faCaretLeft}
							className="ct-notice-left-icon"
						/>
						{"Back to Basics"}
					</button>
				</div>
			) : (
				<div className="ct-tab" id="content-tab">
					<div className="ct-heading">
						<h2 className="ct-title">{"Content"}</h2>
						<p className="ct-subtitle">
							{"Give a detailed description of your campaign, " +
								"including the risks and rewards donors should be aware of. " +
								"This information should give donors all they need to fund your campaign, " +
								"be sure to include frequently asked questions (FAQ), to help your description"}
						</p>
						<div className="ct-card-sep"></div>
					</div>

					<div className="ct-container">
						<div className="ct-submit">
							<button
								className="ct-submit-btn"
								onClick={() => {
									handleContentSave()
								}}
							>
								{"Save"}
							</button>
						</div>
						{/* campaign story */}
						<div className="ct-card">
							<div className="ct-card-heading">
								<h2 className="ct-card-title">{"Story"}</h2>
								<div className="ct-card-sep"></div>
							</div>
							<p className="ct-card-subtitle">
								{"Tell potential contributors more about your campaign. " +
									"Provide details that will motivate people to contribute. " +
									"A good pitch is compelling, informative, and easy to digest. Learn more."}
							</p>
							<Editor
								apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY!}
								plugins={
									"image link preview table paste wordcount visualblocks searchreplace"
								}
								toolbar={
									"undo redo | formatselect | bold italic backcolor | fontsize blocks | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image preview"
								}
								init={{
									width: "100%",
									height: 700,
									menubar: false,
									images_upload_handler: uploadImg,
									image_caption: true,
								}}
								value={story}
								onEditorChange={(newText) => {
									setStory(newText)
								}}
							/>
						</div>

						{/* campaign risks */}
						<div className="ct-card">
							<div className="ct-card-heading">
								<h2 className="ct-card-title">{"Risks"}</h2>
								<div className="ct-card-sep"></div>
							</div>
							<p className="ct-card-subtitle">
								{
									"Make contributors aware of the risks involved in donating to your campaign."
								}
							</p>
							<Editor
								apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY!}
								plugins={
									"link preview table paste wordcount visualblocks searchreplace"
								}
								toolbar={
									"undo redo | formatselect | bold italic backcolor | fontsize blocks | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link removeformat preview"
								}
								init={{
									width: "100%",
									height: 300,
									menubar: false,
									images_upload_handler: uploadImg,
								}}
								value={risks}
								onEditorChange={(newText) => {
									setRisks(newText)
								}}
							/>
						</div>

						{/* campaign faqs */}
						<div className="ct-card">
							<div className="ct-card-heading">
								<h2 className="ct-card-title">{"FAQ"}</h2>
								<div className="ct-card-sep"></div>
							</div>
							<p className="ct-card-subtitle">
								{"The FAQ section should provide the most common details that backers are looking for when " +
									"evaluating your campaign. We will also provide common answers to " +
									"questions about crowdfunding and how Manger works"}
							</p>
							<div className="ct-faqboxs-container">
								{faqs.length > 0 &&
									faqs.map((faq, index) => {
										return (
											<div key={index} className="ct-faqbox">
												<div className="ct-faq-box-qa">
													<p className="ct-faqbox-q">
														{faq.question}
														{/* <FontAwesomeIcon icon={faCaretDown} className="ct-faqbox-show-icon"/> */}
													</p>
													<p className="ct-faqbox-a">{faq.answer}</p>
												</div>
												<div className="ct-faqbox-options">
													<FontAwesomeIcon
														icon={faSquarePen}
														className="ct-faqbox-edit-icon"
														onClick={() => {
															editFaq(faq, index)
														}}
													/>
													<FontAwesomeIcon
														icon={faSquareXmark}
														className="ct-faqbox-x-icon"
														onClick={() => {
															faqs.splice(index, 1)
															setFaqs((prev) => [...faqs])
														}}
													/>
												</div>
											</div>
										)
									})}
							</div>
							<div className="ct-faq-maker">
								<p
									className="ct-faq-maker-heading"
									style={showFaqInput ? { display: "none" } : {}}
								>
									{"Add a question"}
								</p>
								<div
									className="ct-faq-cta"
									onClick={() => {
										setShowFaqInput(true)
									}}
									style={showFaqInput ? { display: "none" } : {}}
								>
									<FontAwesomeIcon
										icon={faCirclePlus}
										className="ct-faq-add-icon"
									/>
								</div>

								<form
									className="ct-faq-qa"
									style={
										showFaqInput ? { display: "flex" } : { display: "none" }
									}
									onSubmit={(e) => {
										e.preventDefault()
										updateFaqs()
									}}
								>
									<div className="ct-faq-inpt">
										<p>{"Question"}</p>
										<input
											type="text"
											name="faq-q"
											id="faq-q"
											className="ct-faq-q"
											onChange={(e) => {
												setCurrFaqQ(e.target.value)
											}}
											value={currFaqQ}
											required
										/>
									</div>
									<div className="ct-faq-inpt">
										<p>{"Answer"}</p>
										<textarea
											name="faq-a"
											id="faq-a"
											cols={91}
											rows={4}
											className="ct-faq-a"
											onChange={(e) => {
												setCurrFaqA(e.target.value)
											}}
											value={currFaqA}
											required
										></textarea>
									</div>
									<div className="ct-faq-add">
										<button className="ct-faq-add-btn" type="submit">
											{"Add"}
										</button>
										<button
											className="ct-faq-cancel-btn"
											type="button"
											onClick={() => {
												setShowFaqInput(false)
											}}
										>
											{"Cancel"}
										</button>
									</div>
								</form>
							</div>
						</div>

						<div className="ct-submit">
							<button
								className="ct-submit-btn"
								onClick={() => {
									handleContentSubmit()
								}}
							>
								{"Continue"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
