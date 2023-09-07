import { ConnectionProvider } from "@/contexts/connection"
import "@/styles/globals.css"
import "@/styles/globals.sass"
import "@/styles/index.css"
import { ApolloClient } from "@apollo/client"
import { InMemoryCache } from "@apollo/client/cache"
import { ApolloProvider } from "@apollo/client/react"
import { NotificationProvider } from "../contexts/notification"
import { CookiesProvider } from "react-cookie"
import type { AppProps } from "next/app"
import Layout from "./Layout"
import WagmiProvider from "@/contexts/wagmiConnect"

const graphClient = new ApolloClient({
	cache: new InMemoryCache(),
	uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
})

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<CookiesProvider>
				<WagmiProvider>
					<ConnectionProvider>
						<NotificationProvider>
							<ApolloProvider client={graphClient}>
								<Layout>
									<Component {...pageProps} />
								</Layout>
							</ApolloProvider>
						</NotificationProvider>
					</ConnectionProvider>
				</WagmiProvider>
			</CookiesProvider>
		</>
	)
}
