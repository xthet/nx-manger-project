import {
	RewardsTab,
	SideNotice,
	SideBio,
	StoryTab,
	RisksTab,
	FaqsTab,
} from "@/components/exportComps"
import { CampaignContext } from "@/contexts/currentCampaign"
import { useContext, useEffect, useRef, useState } from "react"

interface props {
	onFund: boolean
	resetter: Function
}

export default function CampaignDetails({ onFund, resetter }: props) {
	const [activeTab, setActiveTab] = useState("STORY")
	const { currState } = useContext(CampaignContext)!

	const rwdRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		onFund && rwdRef.current!.click()
		activeTab !== "REWARD" && resetter()
	}, [onFund, activeTab])

	return (
		<section className="cpd-section sc-padding fl-tc" id="cmpdetails">
			<main className="cpd-trajectory">
				<div className="cpd-title-bar">
					<div className="cpd-tab-titles fl-cc">
						<div
							className={`cpd-tab-title ${
								activeTab == "STORY" && "cpd-active-tab"
							}`}
							onClick={() => {
								setActiveTab("STORY")
							}}
						>
							{"STORY"}
						</div>
						{/* <div 
              className={`cpd-tab-title ${activeTab == "RISKS" && "cpd-active-tab"}`} 
              onClick={()=>{setActiveTab("RISKS")}}
            >
              {"RISKS"}
            </div> */}
						<div
							className={`cpd-tab-title ${
								activeTab == "FAQ" && "cpd-active-tab"
							}`}
							onClick={() => {
								setActiveTab("FAQ")
							}}
						>
							{"FAQ"}
						</div>
						{currState == 0 && (
							<div
								className={`cpd-tab-title ${
									activeTab == "REWARDS" && "cpd-active-tab"
								}`}
								onClick={() => {
									setActiveTab("REWARDS")
								}}
								ref={rwdRef}
							>
								{"REWARDS"}
							</div>
						)}
					</div>
					<div className="cpd-separator"></div>
				</div>

				<>
					{activeTab == "STORY" && <StoryTab />}
					{activeTab == "RISKS" && <RisksTab />}
					{activeTab == "REWARDS" && currState == 0 && <RewardsTab />}
					{activeTab == "FAQ" && <FaqsTab />}
				</>
			</main>

			<aside className="cpd-info">
				{activeTab == "REWARDS" ? (
					<SideNotice />
				) : (
					<SideBio state={currState} />
				)}
			</aside>
		</section>
	)
}
