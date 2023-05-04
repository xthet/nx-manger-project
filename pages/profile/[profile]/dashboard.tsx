import { useRouter } from "next/router"

export default function Dashboard() {
  const router = useRouter()
  const { profile } = router.query

  return (
    <>
      <div>
        
      </div>
    </>
  )
}
