import { useEffect, useLayoutEffect, useState } from "react"
import { useAccount } from "wagmi"

export const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect

export function useIsConnected() {
	const [isConnected, setIsConnected] = useState(false)
	const { isConnected: _isConnected } = useAccount()
	useIsomorphicLayoutEffect(() => {
		setIsConnected(_isConnected)
	}, [_isConnected])

	return { isConnected }
}
