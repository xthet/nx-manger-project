const categories:Array<string> = [
  "Metaverse",
  "P2E",
  "De-Fi",
  "Web 3.0",
  "DAO",
  "Web3 Startup",
  "NFT & Collectibles",
  "Cyber Security",
  "Blockchain",
  "Energy & Green Tech",

  "Art",
  "Comics & Illustration",
  "Dance & Theater",
  "Movie",
  "Music",
  "Photography",
  "Podcasts, Blogs & Vlogs",
  "Games",
  "Web Series & TV Shows",
  "Writing & Publishing",

  "Culture",
  "Environment",
  "Human Rights",
  "Other Community Projects"
]

export default function CatTable({ showTable, setCurrCat, setShowTable }:{showTable:boolean, setCurrCat:Function, setShowTable:Function}) {
  return (
    <>
      <div className={`bt-cat-table ${!showTable && "hide-cat-table"}`}>
        <div className="bt-cats-lists">
          <p className="bt-cat-list-title">{"WEB3 & INNOVATION"}</p>
          {
            categories.slice(0,9).map((category, index)=>{
              return (
                <p key={index} onClick={()=>{setCurrCat(category); setShowTable(false)}} className="bt-catinlist">{category}</p>
              )
            })
          }
        </div>
        <div className="bt-cat-table-sep"></div>
        <div className="bt-cats-lists">
          <p className="bt-cat-list-title">{"CREATIVE WORKS"}</p>
          {
            categories.slice(10,19).map((category, index)=>{
              return (
                <p key={index} onClick={()=>{setCurrCat(category); setShowTable(false)}} className="bt-catinlist">{category}</p>
              )
            })
          }
        </div>
        <div className="bt-cat-table-sep"></div>
        <div className="bt-cats-lists">
          <p className="bt-cat-list-title">{"COMMUNITY PROJECTS"}</p>
          {
            categories.slice(19,categories.length).map((category, index)=>{
              return (
                <p key={index} onClick={()=>{setCurrCat(category); setShowTable(false)}} className="bt-catinlist">{category}</p>
              )
            })
          }
        </div>
      </div>
    
    </>
  )
}
