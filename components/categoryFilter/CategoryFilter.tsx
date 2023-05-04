import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

interface props{
  name: string
  catFc: Function
}

interface cfprops{
  changeCat: Function
}

let catArray:Array<string> = 
[
  "All Categories",
  "De-Fi",
  "NFTs & Collectibles",
  "Web 3.0",
  "Metaverse",
  "P2E",
  "DAO",
  "Games",
  "Design & Tech",
  "Movie",
  "Comics & Illustration",
  "Startup"
]

export function Category({ name, catFc }:props){
  const router = useRouter()
  const [active, setActive] = useState(false)
  const [path, setPath] = useState("")

  useEffect(()=>{
    const query = router.asPath.replace("%20", " ")
    if(query.includes(name)){
      setActive(true)
      setPath(query)
    }else{setActive(false)}
  },[name, router.asPath])

  return (
    <div className={`cf-category ${active && "active"}`} onClick={()=>{router.push(`/campaigns/${name}`); catFc(name)}}>
      {`${name}`}
    </div>
  )
}

export default function CategoryFilter({ changeCat }:cfprops) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollLeft(){
    scrollRef.current!.scrollBy(-50, 0)
  }
  function scrollRight(){
    scrollRef.current!.scrollBy(50, 0)
  }

  return (
    <div className="cf-wrapper fl-cc">
      <div className="cf-other-cat-wrapper fl-cc">
        <FontAwesomeIcon icon={faAnglesLeft} className="cf-arrow-btn" onClick={scrollLeft}/>
        <div className="cf-other-cat fl-cl" ref={scrollRef}>
          {
            catArray.map((cat, index)=>{
              return (
                <Category name={cat} key={index} catFc={(name:string)=>{changeCat && changeCat(name)}}/>
              )
            })
          }
        </div>
        <FontAwesomeIcon icon={faAnglesRight} className="cf-arrow-btn" onClick={scrollRight}/>
      </div>
    </div>
  )
}
