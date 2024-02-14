import { Logo } from "@/components/exportComps"
import {
	faFacebook,
	faFacebookF,
	faGithub,
	faTelegram,
	faTwitter,
} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

function Menu() {
	return (
		<>
			<Link href="/campaigns" className="ft-menu-link">
				{"Campaigns"}
			</Link>
			<Link href="./" className="ft-menu-link">
				{"About us"}
			</Link>
			<Link href="/#blog" className="ft-menu-link">
				{"Blog"}
			</Link>
			<Link href="/#how-it-works" className="ft-menu-link">
				{"Help"}
			</Link>
		</>
	)
}

export default function Footer() {
	return (
		<footer className="ft-section sc-padding">
			<div className="ft-container fl-cl fl-c">
				<div className="ft-menu fl-cc fl-sb">
					<Logo className="ft-logo fl-cl" />

					<div className="ft-menu-links fl-tc">
						<Menu />
					</div>

					<div className="ft-social-links fl-cr">
						<div className="ft-social-link">
							<FontAwesomeIcon icon={faFacebookF} className="ft-social-icon" />
						</div>
						<Link
							href={process.env.NEXT_PUBLIC_TWITTER_SOCIAL!}
							className="ft-social-link"
						>
							<FontAwesomeIcon icon={faTwitter} className="ft-social-icon" />
						</Link>
						<Link
							href={process.env.NEXT_PUBLIC_TELEGRAM_SOCIAL!}
							className="ft-social-link"
						>
							<FontAwesomeIcon icon={faTelegram} className="ft-social-icon" />
						</Link>
						<Link
							href={process.env.NEXT_PUBLIC_GITHUB_SOCIAL!}
							className="ft-social-link"
						>
							<FontAwesomeIcon icon={faGithub} className="ft-social-icon" />
						</Link>
					</div>
				</div>

				<div className="ft-divider"></div>

				<div className="ft-copyright fl-cl">
					<p>{"©2023 Manger.All Rights Reserved."}</p>
				</div>
			</div>

			<div className="mb-ft-container fl-tc fl-c fl-sb">
				<div className="mb-footer-details fl-tl fl-sb">
					<div className="mb-footer-bio fl-tl fl-c">
						<Logo className="ft-logo fl-cl" />
					</div>

					<div className="mb-footer-menu fl-tl">
						<div className="mb-ft-menu-wrapper fl-tl fl-sb">
							<div
								className="mb-ft-menu-links fl-tl fl-c"
								style={{ marginTop: "4px" }}
							>
								<Link href="/campaigns" className="ft-menu-link">
									{"Campaigns"}
								</Link>
								<Link href="./" className="ft-menu-link">
									{"About us"}
								</Link>
							</div>

							<div
								className="mb-ft-menu-links fl-tl fl-c"
								style={{ marginTop: "4px" }}
							>
								<Link href="/#blog" className="ft-menu-link">
									{"Blog"}
								</Link>
								<Link href="/#how-it-works" className="ft-menu-link">
									{"Help"}
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="ft-copyright fl-cl fl-c">
					<div
						className="ft-social-links fl-cr"
						style={{
							marginBottom: "7px",
						}}
					>
						<Link
							href={process.env.NEXT_PUBLIC_TWITTER_SOCIAL!}
							className="ft-social-link"
						>
							<FontAwesomeIcon icon={faTwitter} className="ft-social-icon" />
						</Link>
						<Link
							href={process.env.NEXT_PUBLIC_TELEGRAM_SOCIAL!}
							className="ft-social-link"
						>
							<FontAwesomeIcon icon={faTelegram} className="ft-social-icon" />
						</Link>
						<Link
							href={process.env.NEXT_PUBLIC_GITHUB_SOCIAL!}
							className="ft-social-link"
						>
							<FontAwesomeIcon icon={faGithub} className="ft-social-icon" />
						</Link>
						<div className="ft-social-link">
							<FontAwesomeIcon icon={faFacebook} className="ft-social-icon" />
						</div>
					</div>
					<p>{"© 2023 Manger.All Rights Reserved."}</p>
				</div>
			</div>
		</footer>
	)
}
