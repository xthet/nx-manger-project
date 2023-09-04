import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import s from "./featured_creators.module.sass"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import useFeaturedCreators from "@/hooks/useFeaturedCreators"
import { truncateStr } from "@/utils/truncateStr"
import Link from "next/link"

export default function FeaturedCreators() {
	const { creators } = useFeaturedCreators()
	return (
		<section className={s.section}>
			<div className={s.header}>
				<h3>FEATURED CREATORS</h3>
				<p>Meet our pioneers!!</p>
			</div>

			<div className={s.creators_cont}>
				{creators &&
					creators.map((creator, idx) => {
						return (
							<Link
								href={`/profile/${creator.username}`}
								className={s.fc}
								key={idx}
							>
								<img
									src={creator.pfp.replace("ipfs://", "https://ipfs.io/ipfs/")}
									alt="fc"
									className={s.fc_img}
								/>
								<div className={s.fc_dets}>
									<p>{truncateStr(creator.address, 8)}</p>
									<p>{creator.username}</p>
								</div>
							</Link>
						)
					})}
			</div>
		</section>
	)
}
