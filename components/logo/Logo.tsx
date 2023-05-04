import Link from "next/link"

interface logoprops{
  className: string
}

export default function Logo({ className }: logoprops) {
  return (
    <Link href="/">
      <div className={className}>
        <img src="/assets/manger_logo.svg" alt="logo" />
        <p>{"MANGER"}</p>
      </div>
    </Link>
  )
}
