import { Footer, Navbar } from "@/containers/exportConts"
import { ReactNode } from "react"

export default function Layout({ children }:{children:ReactNode}) {
  return (
    <>
      <Navbar/>
      <div className="p-full">
        {children}
      </div>
      <Footer/>
    </>
  )
}
