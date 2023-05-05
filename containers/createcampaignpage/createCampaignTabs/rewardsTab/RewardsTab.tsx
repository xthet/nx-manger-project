import { DummyRewardCard, TimelineBox } from "@/components/exportComps"
import campaignABI from "@/constants/abis/Campaign.json"
import { CampaignCreatorContext } from "@/contexts/campaignCreator"
import { ConnectionContext } from "@/contexts/connection"
import { NotificationContext } from "@/contexts/notification"
import { basicCmpObj, conn, counOpt, rwdFormObj } from "@/types"
import getCountrySelect from "@/utils/getCountrySelect"
import { truncateStr } from "@/utils/truncateStr"
import { faCaretLeft, faCirclePlus, faCircleXmark, faImages, faSquarePen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import onetime from "onetime"
import { useContext, useEffect, useRef, useState } from "react"
import ReactLoading from "react-loading"
import Select, { components } from "react-select"
import { v4 } from "uuid"
import fleek from "@fleekhq/fleek-storage-js"


function Option(props:any){
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  )
}

export default function RewardsTab() {
  const router = useRouter()
  const { updateGrandCmp, newCampaignAddr, setNewCampaignAddr, setActiveTab, grandCmp } = useContext(CampaignCreatorContext)!
  const { isConnected, connect, account, signer, isAuth }:conn = useContext(ConnectionContext)!
  const { dispatch } = useContext(NotificationContext)!
  const [counOptionsArr, setCounOptionsArr] = useState<counOpt[]>([])
  const [rFormVisible, setRFormVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState<readonly any[]>([])
  const [rPrice, setRPrice] = useState("")
  const [rName, setRName] = useState("")
  const [rDesc, setRDesc] = useState("")
  const [rType, setRType] = useState("")
  const [rDelD, setRDelD] = useState("")
  const [rQty, setRQty] = useState("")
  const [shipsTo, setShipsTo] = useState<any[]>([])
  const [currItem, setCurrItem] = useState("")
  const [itemArr, setItemArr] = useState<string[]>([])
  const [rwdArr, setRwdArr] = useState<any[]>([])
  const [rwdIds, setRwdIds] = useState<any[]>([])
  const [currRwd, setCurrRwd] = useState<any | number>(null)
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  const [onEdit, setOnEdit] = useState(false)
  const [imgState, setImgState] = useState("unset")
  const [imgURLToBe, setImgURLToBe] = useState("")



  const [showTBX, setShowTBX] = useState(false)
  const tlArr = [
    "Entering reward info",
    "Sending info to contract",
    "Awaiting Confirmation",
    "Reward Created"
  ]
  const [tlIndex, setTlIndex] = useState(0)
  const [tlClosable, setTlClosable] = useState(false)

  const digRef = useRef<HTMLInputElement|null>(null)
  const phyRef = useRef<HTMLInputElement|null>(null)
 
  function handleRewardsCheck(){
    if(rwdArr.length > 0){
      updateGrandCmp({ rewards: true })
    }else{
      updateGrandCmp({ rewards: false })
    }
    localStorage.setItem("rewardsObj", JSON.stringify({ rewards: modifyRwdArr() }))
    setActiveTab("Content")
  }

  async function uploadImg(e:any){
    const date = new Date()
    const timestamp = date.getTime()
    const imgData = {
      apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY!,
      apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SEC!,
      key: `manger/rwdImgUploads/${truncateStr(account, 10)}/MNG_${grandCmp.title}_${timestamp}`,
      data: e.target.files[0]
    }
    try {
      const response = await fleek.upload(imgData)
      setImgURLToBe(`ipfs://${response.hashV0}`)
      setImgState("finished")
    } catch (error) {
      console.log(error)      
    }
  }
 
  const handleRewardSubmit = onetime(async (e:any) => {
    setRwdIds(prev=>([...prev, rPrice]))
    const data = new FormData(e.target)
    const date = Math.floor((new Date(data.get("r-deld")!.toString()).getTime()) / 1000)
    
    if(rType && newCampaignAddr && rPrice){
      setShowTBX(true)
      const currCmp = new ethers.Contract(newCampaignAddr, campaignABI.abi, signer)
      try {
        setTlIndex(prev => prev >= tlArr.length ? prev : prev + 1)
        const addRwdTx = await currCmp.makeReward(
          ethers.utils.parseEther(rPrice),
          rName,
          rDesc,
          imgURLToBe,
          currItem ? currItem.split(",") : [""],
          (Math.floor((new Date(rDelD).getTime()) / 1000)).toString(),
          rQty && Number(rQty) ? rQty : "0",
          !rQty ? true : false, // bool infinite
          shipsTo.length > 0 ? shipsTo : ["_NW"]
        )
        setTlIndex(prev => prev >= tlArr.length ? prev : prev + 1)
        const addRwdTxR = await addRwdTx.wait(1)

      } catch (error) {
        dispatch({
          type: "ADD_NOTI",
          payload:{
            id: v4(),
            type: "FAILURE",
            title: "",
            message: "Failed to add reward."
          }
        })
        console.log(error)        
      }

      const rwdFormObj:rwdFormObj = {
        rPrice,
        rName,
        rDesc,
        rPic: imgURLToBe,
        rType,
        rDelD: (Math.floor((new Date(rDelD).getTime()) / 1000)).toString(),
        rQty: rQty && rQty !== "0" && Number(rQty) ? rQty : "0",
        infinite: !rQty ? true : false,
        items: currItem.split(","),
        shipsTo: shipsTo.length > 0 ? shipsTo : ["_NW"]
      }
      if(onEdit){
        if(currRwd >= 0){
          rwdArr[currRwd] = rwdFormObj
          setRwdArr(prev => ([...rwdArr]))
        }
      }
      else{
        setRwdArr(prev => ([...prev, rwdFormObj]))
      }

      setRPrice("")
      setRName("")
      setRDesc("")
      setRDelD("")
      setRQty("")
      setItemArr([])
      setSelectedOption([])
      setCurrItem("")
      setOnEdit(false)
      setCurrRwd(null)
      setRFormVisible(false)
      setTlIndex(prev => prev >= tlArr.length ? prev : prev + 2)
    }
  })

  function editRwd(rwd:rwdFormObj, index:number){
    if(rwd.shipsTo.length && shipsTo[0] !== "_NW" || rwd.shipsTo.length && rwd.rType == "Physical"){
      const newCounArr = getCountrySelect(rwd.shipsTo)
      setSelectedOption(newCounArr)
    }
    setOnEdit(true)
    setRPrice(rwd.rPrice)
    setRName(rwd.rName)
    setRDesc(rwd.rDesc)
    setRDelD((new Date(parseInt(rwd.rDelD) * 1000)).toISOString().substring(0,10))
    setRQty(rwd.rQty)
    setRType(rwd.rType)
    setItemArr(rwd.items)
    rwd.rType == "Physical" ? phyRef.current!.click() : rwd.rType == "Digital" ? digRef.current!.click() : ""
    setCurrItem("")
    setCurrRwd(index)
  }
  
  async function deleteRwd(rwd:rwdFormObj, index:number){
    if(newCampaignAddr){
      const currCmp = new ethers.Contract(newCampaignAddr, campaignABI.abi, signer)
      try {
        const delRwdTx = await currCmp.deleteReward(
          ethers.utils.parseEther(rwd.rPrice)
        )

        const delRwdTxR = await delRwdTx.wait(1)

      } catch (error) {
        console.log(error)        
      }
    }

    rwdArr.splice(index,1)
    setRwdArr(prev=>([...rwdArr]))
    if(rwdIds.includes(rwd.rPrice)){
      rwdIds.splice(rwdIds.indexOf(rwd.rPrice), 1)
      setRwdIds(prev=>([...rwdIds]))
    }
    setOnEdit(false)
    localStorage.setItem("rewardsObj", JSON.stringify({ rewards: modifyRwdArr() }))
  }

  function modifyRwdArr() {
    const prices:string[] = []
    const modRwdArr = rwdArr.reverse().filter((rwd, index)=>{
      if(!(prices.includes(rwd.rPrice))){
        prices.push(rwd.rPrice)
        return true
      }else{
        rwdArr.splice(index,1)
        return false
      }
    })
    return modRwdArr
  }

  function checkPrice(e:any){
    if(rwdIds.includes(e.target.value)){
      setRPrice(e.target.value)
      !onEdit && setShowDuplicateWarning(true)
    }else{
      setShowDuplicateWarning(false)
      setRPrice(e.target.value)
    }
  }

  useEffect(()=>{
    const counArr = getCountrySelect()
    setCounOptionsArr(counArr)
  },[])

  useEffect(()=>{
    if(selectedOption.length > 0){
      const muShipsTo = selectedOption.map((option:counOpt, index:number)=>{
        return option.value
      })
      setShipsTo(muShipsTo)
    }else{
      setShipsTo([])
    }
  },[selectedOption])

  useEffect(()=>{
    const basicRec = localStorage.getItem("basicsObj")
    if(basicRec){
      const basicObj:basicCmpObj = JSON.parse(basicRec)
      updateGrandCmp(basicObj)
      setNewCampaignAddr(basicObj.campaign)
    }
    const rwdRec = localStorage.getItem("rewardsObj")
    if(rwdRec && !rwdArr.length){
      const recObj = JSON.parse(rwdRec)
      setRwdArr(recObj.rewards)
      if(recObj.rewards.length){
        updateGrandCmp({ rewards: true })
      }
    }
  },[])

  useEffect(()=>{
    localStorage.setItem("grandCmp", JSON.stringify(grandCmp))
  },[grandCmp])

  return (
    <>
      {!newCampaignAddr
        ? <div className="ct-denial">
          <p>{"You need an existing campaign smart contract to create rewards"}</p>
          <ReactLoading type="bubbles" color="#827B93"/> 
          <button className="ct-notice-btn" onClick={()=>{setActiveTab("Basics")}}>
            <FontAwesomeIcon icon={faCaretLeft} className="ct-notice-left-icon"/>
            {"Back to Basics"}
          </button>
        </div>

        : <div className="ct-tab" id="rewards-tab">
          <div className="ct-heading">
            <h2 className="ct-title">{"Rewards"}</h2>
            <p className="ct-subtitle">
              {"Rewards are incentives offered to backers in exchange for their support. " + 
          "Rewards are not editable once they're made. " + 
          "Visit the Help Center to learn about different kinds of perks you can offer. "}
            </p>
            <div className="ct-card-sep"></div>
          </div>
          <div className="ct-container">
            <div className="rt-made-rewards">
              { rwdArr && 
              modifyRwdArr().map((rwd, index)=>{
                return (
                  <div className="rt-rwd-edit-grp" key={index}>
                    <DummyRewardCard rwd={rwd}/>
                    {/* <div className="rt-rwd-options">
                      <FontAwesomeIcon icon={faSquarePen} className="rt-edit-icon" 
                        onClick={()=>{setRFormVisible(true); router.push("/create-campaign#rt-form"); editRwd(rwd, index)}}
                      />
                      <FontAwesomeIcon icon={faTrash} className="rt-rwd-x-icon" 
                        onClick={()=>{deleteRwd(rwd, index)}}
                      />
                    </div> */}
                  </div>
                )
              }) }
            </div>

            <form className="rt-card-form" 
              onSubmit={(e)=>{e.preventDefault(); !showDuplicateWarning && handleRewardSubmit(e)}}
              style={!rFormVisible ? { "display":"none" } : {}}
              id="rt-form"
            >
              <div className="rt-form-inpt-grp">
                <p className="rt-form-inpt-label">{"Reward Price:"}</p>
                <div className="rt-form-inpt-sm-grp">
                  <input type="number" name="r-qty" className="rt-form-inpt"
                    onChange={(e)=>{checkPrice(e)}} value={rPrice} required
                    disabled={onEdit}
                  />
                  <small style={showDuplicateWarning ? { "color":"red" } : {}}>
                    {showDuplicateWarning 
                      ? "You cannot have two rewards with the same price"
                      : "Reward prices are not editable once created"
                    }
                  </small>
                </div>
              </div>

              <div className="rt-form-inpt-grp">
                <p className="rt-form-inpt-label">{"Reward Name:"}</p>
                <input type="text" name="r-name" className="rt-form-inpt"
                  onChange={(e)=>{setRName(e.target.value)}} value={rName}
                  required
                />
              </div>
     
              <div className="rt-form-inpt-grp">
                <p className="rt-form-inpt-label">{"Reward Description:"}</p>
                <textarea cols={60} rows={3} name="r-desc" className="rt-form-inpt"
                  onChange={(e)=>{setRDesc(e.target.value)}} value={rDesc}
                  required
                />
              </div>

              <div className="rt-form-inpt-grp">
                <p className="rt-form-inpt-label">{"Reward Image:"}</p>
                <div className="rt-img-inpt">
                  <input type="file" id="rt-card-img" hidden onChange={(e)=>{uploadImg(e); setImgState("loading")}}/>
                  <label htmlFor="rt-card-img" className="rt-card-img-lbl">
                    <div className="rt-img-cont">
                      {imgState == "loading" 
                        ? <ReactLoading type="bubbles" color="#827B93"/> 
                        : imgState == "finished" 
                          ? imgURLToBe && <img src={imgURLToBe.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="--" /> 
                          : <FontAwesomeIcon icon={faImages} className="rt-card-img-icon"/>
                      }
                    </div>
                  </label>
                </div>
              </div>

              <div className="rt-form-inpt-grp">
                <p className="rt-form-inpt-label">{"Reward Type:"}</p>
                <div className="rt-form-grp-input">
                  <input type="radio" name="r-type" value={"Digital"} 
                    onChange={(e)=>setRType("Digital")} required
                    ref={digRef}
                  /> 
                  <p className="rt-rad-inpt-label">{"Digital"}</p>
                  <input type="radio" name="r-type" value={"Physical"} 
                    onChange={(e)=>setRType("Physical")} required
                    ref={phyRef}
                  /> 
                  <p className="rt-rad-inpt-label">{"Physical"}</p>
                  <small className="rt-rad-info">{"Does this reward include physical items?"}</small>
                </div>
              </div>

              <div className="rt-form-inpt-grp ft-top">
                <p className="rt-form-inpt-label">{"Included items:"}</p>
                <div className="rt-form-items-inpt">
                  <input type="text" name="r-items" className="rt-form-inpt --rt-items-inpt"
                    onChange={(e)=>{setCurrItem(e.target.value)}} value={currItem}
                    placeholder="Separate reward items with comma; ','"
                  />
                  {/* <div className="rt-form-add-item-grp">
                    <input type="text" name="r-items" className="rt-form-inpt"
                      onChange={(e)=>{setCurrItem(e.target.value)}} value={currItem}
                    />
                    <FontAwesomeIcon icon={faCirclePlus} className="rt-form-add-item-icon"
                      onClick={()=>{currItem && setItemArr(prev => ([...prev, currItem])); setCurrItem("")}}
                    />
                  </div> */}
                  <div className="rt-form-items-ul">
                    <ul>
                      {
                        currItem && currItem.split(",").map((item, index)=>{
                          return (
                            <div key={index} className="rt-i-item">
                              <li>{item}</li>
                              {/* <FontAwesomeIcon icon={faCircleXmark} className="rt-x-item"
                                onClick={()=>{itemArr.splice(index,1); setItemArr(prev => ([...itemArr]))}}
                              /> */}
                            </div>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
              </div> 

              <div className="rt-form-inpt-grp">
                <p className="rt-form-inpt-label">{"Estimated Delivery Date:"}</p>
                <input type="date" name="r-deld" className="rt-form-inpt"
                  onChange={(e)=>{setRDelD(e.target.value)}} value={rDelD} required
                />
              </div>

              <div className={`rt-form-inpt-grp ${!(rType == "Physical") && "ft-space"}`}>
                <p className="rt-form-inpt-label">{"Quantity:"}</p>
                <div className="rt-form-inpt-sm-grp">
                  <input type="number" name="r-qty" className="rt-form-inpt"
                    onChange={(e)=>{setRQty(e.target.value)}} value={rQty}
                  />
                  <small>{"Leave blank if infinite"}</small>
                </div>
              </div>

              <div className="rt-form-inpt-grp ft-space" style={!(rType == "Physical") ? { "display":"none" } : {}}>
                <p className="rt-form-inpt-label">{"Ships To:"}</p>
                <Select options={counOptionsArr} 
                  onChange={setSelectedOption} isMulti 
                  value={selectedOption} className="rt-form-select"
                  placeholder="Select countries..."
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option }}
                />
              </div>     

              <footer className="rt-form-footer">
                <div className="rt-form-cancel" onClick={()=>{setRFormVisible(false)}}>
                  {"Cancel"}
                </div>
                <button type="submit" className="rt-form-save">
                  {"Save"}
                </button>
              </footer>     
            </form>
            {showTBX && <TimelineBox offMe={()=>{setShowTBX(false)}} arr={tlArr} arrIndex={tlIndex} closable={tlClosable}/>}

            <div className="rt-cta">
              <p className="rt-cta-label">{"Add a reward"}</p>
              <div className="rt-cta-btn" onClick={()=>{setRFormVisible(true); router.push("/create-campaign#rt-form")}}>
                <FontAwesomeIcon icon={faCirclePlus} className="rt-add-icon"/>
              </div>
            </div>

            <div className="tt-cta">
              <button className="tt-cta-btn" onClick={()=>{handleRewardsCheck()}}>
                {"Continue"}
              </button>
            </div>
          </div>
        </div>
      } 
    </>      
  )
                
}
