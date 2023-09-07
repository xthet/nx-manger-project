import Link from "next/link"
import s from "./Logo.module.sass"

interface logoprops {
	className: string
}

export default function Logo({ className }: logoprops) {
	return (
		<Link href="/" className={s.link}>
			<img src="/assets/manger_logo.svg" alt="logo" className={s.logo} />
			{/* <p>{"MANGER"}</p> */}
		</Link>
	)
}
