import { CampaignGrid, CategoryFilter } from "@/components/exportComps"
import { useCampaigns } from "@/hooks/useCampaigns"
import { Blog, FeaturedCampaign } from "../exportConts"
import ReactLoading from "react-loading"
import Error from "next/error"
import { useState } from "react"

interface props {
	cat: string
	offVal: number
}

export default function CampaignsPage({ cat, offVal }: props) {
	const [nCategory, setNCategory] = useState(cat)
	const {
		isConnected,
		loading,
		campaigns,
		callSomeCampaigns,
		callAllCampaigns,
	} = useCampaigns(nCategory, offVal)
	const [offset, setOffset] = useState(0)

	async function handleSeemore() {
		setOffset((prev) => prev + 6)

		if (cat == "All Categories") {
			await callAllCampaigns(offset)
		} else {
			await callSomeCampaigns(cat, offset)
		}
	}

	return (
		<section className="ccp-section sc-padding fl-cl fl-c">
			<CategoryFilter
				changeCat={(ncat: string) => {
					setNCategory(ncat)
				}}
			/>
			{/* <div className="ccp-sub-wrapper fl-cl">
        <h4 className="ccp-subtitle">{"Featured"}</h4>
      </div> */}
			{
				<>
					{loading || !campaigns ? (
						<p> </p>
					) : !campaigns.length ? (
						<div className="cp-load-alert fl-cl fl-c">
							<p>{"There are currently no campaigns in this category"}</p>
							<ReactLoading type={"bubbles"} color="#827B93" />
						</div>
					) : (
						<>
							<FeaturedCampaign campaigns={campaigns} />
							<div className="ccp-sub-wrapper fl-cl">
								<h4 className="ccp-subtitle">{`Explore ${campaigns.length} Projects`}</h4>
							</div>
						</>
					)}
					{!isConnected && !campaigns ? (
						<div className="cp-load-alert fl-cl fl-c">
							<p>{"Please connect your wallet to view campaigns"}</p>
							<ReactLoading type={"bubbles"} color="#827B93" />
						</div>
					) : loading || !campaigns ? (
						<ReactLoading type={"bubbles"} color="#827B93" />
					) : !campaigns.length ? (
						<p>{""}</p>
					) : (
						<CampaignGrid mapArray={campaigns} />
					)}
				</>
			}
			{campaigns.length > 6 && (
				<button className="cg-see-more fl-cc" onClick={handleSeemore}>
					{"See more"}
				</button>
			)}
			{/* <Blog /> */}
		</section>
	)
}
