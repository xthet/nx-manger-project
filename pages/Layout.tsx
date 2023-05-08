import { Footer, Navbar } from "@/containers/exportConts"
import { useRouter } from "next/router"
import { ReactNode } from "react"

export default function Layout({ children }:{children:ReactNode}) {
  const router = useRouter()

  return (
    <>
      <Navbar/>
      <div className="p-full">
        {children}
      </div>
      {!(router.pathname.includes("/profile/[profile]/dashboard")) && <Footer/>}
    </>
  )
}
