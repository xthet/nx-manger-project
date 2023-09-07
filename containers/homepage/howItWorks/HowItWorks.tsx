import {
	faChartLine,
	faChartSimple,
	faGift,
	faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export default function HowItWorks() {
	return (
		<section className="hi-section fl-cl fl-c sc-padding" id="how-it-works">
			<div className="hi-title fl-cl fl-c">
				<h3 className="hi-section-title">{"HOW IT WORKS"}</h3>
				<p className="hi-section-subtitle">{"Turn your ideas into reality"}</p>
			</div>

			<div className="hi-infobox-container fl-bc fl-sa">
				<div className="hi-infobox fl-cl fl-c">
					<FontAwesomeIcon icon={faChartSimple} className="hi-infobox-icon" />
					<div className="hi-infobox-details fl-cl fl-c">
						<h5 className="hi-info-title">{"Start your own campaign"}</h5>
						<p className="hi-info">{`Start your own crowdfunding campaign by describing your idea, setting a goal and duration, 
            and creating enticing rewards for donations made.`}</p>
						<Link href="/create-campaign">
							<button className="hi-info-cta">{"Start your campaign"}</button>
						</Link>
					</div>
				</div>

				<div className="hi-infobox fl-cl fl-c">
					<FontAwesomeIcon
						icon={faHandHoldingDollar}
						className="hi-infobox-icon"
					/>
					<div className="hi-infobox-details fl-cl fl-c">
						<h5 className="hi-info-title">{"Fund a campaign"}</h5>
						<p className="hi-info">{`Have you found a project idea you care about?, 
            click the “fund this project” button to 
            contribute to its success and earn nice rewards in return.`}</p>
						<Link href="/campaigns">
							<button className="hi-info-cta">{"Fund a campaign"}</button>
						</Link>
					</div>
				</div>

				<div className="hi-infobox fl-cl fl-c">
					<FontAwesomeIcon icon={faGift} className="hi-infobox-icon" />
					<div className="hi-infobox-details fl-cl fl-c">
						<h5 className="hi-info-title">{"Receive rewards"}</h5>
						<p className="hi-info">{`Earn various rewards for your funding efforts on successful campaigns. 
            Rewards aren't promised but creators will reach out to backers frequently.`}</p>
						<Link href="/campaigns">
							<button className="hi-info-cta">{"Fund a campaign"}</button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}
