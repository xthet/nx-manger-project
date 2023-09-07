"use client"
import { useState, useEffect } from "react"

export function useScroll() {
  // storing this to get the scroll direction
  const [lastScrollTop, setLastScrollTop] = useState(0)
  // the offset of the document.body
  const [bodyOffset, setBodyOffset] = useState(
    typeof window !== "undefined" ? document.body.getBoundingClientRect() : null
  )
  // the vertical direction
  const [scrollY, setScrollY] = useState(0)
  // the horizontal direction
  const [scrollX, setScrollX] = useState(0)
  // scroll direction would be either up or down
  const [scrollDirection, setScrollDirection] = useState("")

  const listener = () => {
    setBodyOffset(
      typeof window !== "undefined"
        ? document.body.getBoundingClientRect()
        : null
    )
    setScrollY(-bodyOffset!.top)
    setScrollX(bodyOffset!.left)
    setScrollDirection(lastScrollTop > -bodyOffset!.top ? "down" : "up")
    setLastScrollTop(-bodyOffset!.top)
  }

  useEffect(() => {
    window.addEventListener("scroll", listener)
    return () => {
      window.removeEventListener("scroll", listener)
    }
  })

  return {
    scrollY,
    scrollX,
    scrollDirection,
  }
}
