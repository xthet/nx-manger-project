import { useQUData } from "@/hooks/useQUData"
import s from "./response_row.module.sass"

export default function ResponseRow({
	address,
	onClick,
}: {
	address: string
	onClick: Function
}) {
	const { uNameVal } = useQUData(address)
	return (
		<div className={s.resp_entry}>
			<span>{uNameVal}</span>
			<button
				onClick={() => {
					onClick()
				}}
			>
				View response
			</button>
		</div>
	)
}
