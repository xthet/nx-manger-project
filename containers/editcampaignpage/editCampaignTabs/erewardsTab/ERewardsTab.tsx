import { CampaignEditorContext } from "@/contexts/campaignEditor"
import { conn, counOpt, rwdFormObj } from "@/types"
import getCountrySelect from "@/utils/getCountrySelect"
import { faCaretLeft, faCirclePlus, faCircleXmark, faSquarePen, faSquareXmark, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useContext, useEffect, useState } from "react"
import Select from "react-select"
import { components } from "react-select"
import ReactLoading from "react-loading"
import campaignABI from "@/constants/abis/Campaign.json"
import { BigNumber, ethers } from "ethers"
import { ConnectionContext } from "@/contexts/connection"
import { useRouter } from "next/router"
import { DummyRewardCard, RewardCard, TimelineBox } from "@/components/exportComps"
import useRwdTab from "@/hooks/useRwdTab"
import onetime from "onetime"

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

export default function EewardsTab() {
  const router = useRouter()
  const { updateGrandCmp, setActiveTab, currAddress } = useContext(CampaignEditorContext)!
  const { isConnected, connect, account, signer, isAuth }:conn = useContext(ConnectionContext)!
  const { loading:rwdLoading, rwIds:cpRwIds } = useRwdTab(currAddress)
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
  const [newRwdArr, setNewRwdArr] = useState<any[]>([])
  const [rwdIds, setRwdIds] = useState<any[]>([])
  const [newRwdIds, setNewRwdIds] = useState<any[]>([])
  const [currRwd, setCurrRwd] = useState<any | number>(null)
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  const [onEdit, setOnEdit] = useState(false)

  const [showTBX, setShowTBX] = useState(false)
  const tlArr = [
    "Creating reward",
    "Awaiting confirmation",
    "Reward created"
  ]
  const [tlIndex, setTlIndex] = useState(0)
  const [tlClosable, setTlClosable] = useState(false)
 
  function handleRewardsCheck(){
    if(newRwdIds.length > 0){
      updateGrandCmp({ rewards: true })
    }else{
      updateGrandCmp({ rewards: false })
    }
    localStorage.setItem("rewardsObj", JSON.stringify({ rewards: modifyRwdArr() }))
    setActiveTab("Content")
  }
 
  const handleRewardSubmit = onetime( async (e:any) => {
    setNewRwdIds(prev=>([...prev, rPrice]))
    const data = new FormData(e.target)
    const date = Math.floor((new Date(data.get("r-deld")!.toString()).getTime()) / 1000)
    console.log(data.get("r-qty"))
    
    if(rType && currAddress && rPrice){
      const currCmp = new ethers.Contract(currAddress, campaignABI.abi, signer)
      setShowTBX(true)
      try {
        const addRwdTx = await currCmp.makeReward(
          ethers.utils.parseEther(rPrice),
          rName,
          rDesc,
          itemArr.length > 0 ? itemArr : [""],
          (Math.floor((new Date(rDelD).getTime()) / 1000)).toString(),
          rQty ? rQty : "0",
          !rQty ? true : false,
          shipsTo.length > 0 ? shipsTo : ["_NW"]
        )
        setTlIndex(prev => prev >= tlArr.length ? prev : prev + 1)
        const addRwdTxR = await addRwdTx.wait(1)
        setTlIndex(prev => prev >= tlArr.length ? prev : prev + 2)

      } catch (error) {
        console.log(error)    
        setShowTBX(false)    
      }

      const rwdFormObj:rwdFormObj = {
        rPrice,
        rName,
        rDesc,
        rType,
        rDelD: (Math.floor((new Date(rDelD).getTime()) / 1000)).toString(),
        rQty: rQty ? rQty : "0",
        infinite: !rQty ? true : false,
        items: itemArr,
        shipsTo: shipsTo.length > 0 ? shipsTo : ["_NW"]
      }
      if(onEdit){
        if(currRwd >= 0){
          newRwdArr[currRwd] = rwdFormObj
          setNewRwdArr(prev => ([...newRwdArr]))
        }
      }
      else{
        setNewRwdArr(prev => ([...prev, rwdFormObj]))
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
    }
  })

  function editRwd(rwd:rwdFormObj, index:number){
    if(shipsTo && shipsTo[0] !== "_NW" || rwd.rType == "Physical"){
      const newCounArr = getCountrySelect(shipsTo)
      setSelectedOption(newCounArr)
    }
    console.log(rwd.rDelD)
    setOnEdit(true)
    setRPrice(rwd.rPrice)
    setRName(rwd.rName)
    setRDesc(rwd.rDesc)
    setRDelD((new Date(parseInt(rwd.rDelD) * 1000)).toISOString().substring(0,10))
    setRQty(rwd.rQty)
    setRType(rwd.rType)
    setItemArr(rwd.items)
    setCurrItem("")
    setCurrRwd(index)
  }

  async function deleteRwd(rwd:rwdFormObj, index:number){
    if(currAddress){
      const currCmp = new ethers.Contract(currAddress, campaignABI.abi, signer)
      try {
        const delRwdTx = await currCmp.deleteReward(
          ethers.utils.parseEther(rwd.rPrice)
        )

        const delRwdTxR = await delRwdTx.wait(1)

      } catch (error) {
        console.log(error)        
      }
    }

    newRwdArr.splice(index,1)
    setNewRwdArr(prev=>([...newRwdArr]))
    if(newRwdIds.includes(rwd.rPrice)){
      newRwdIds.splice(newRwdIds.indexOf(rwd.rPrice), 1)
      setNewRwdIds(prev=>([...newRwdIds]))
    }
    setOnEdit(false)
  }

  function modifyRwdArr() {
    const prices:string[] = []
    const modRwdArr = newRwdArr.reverse().filter((rwd, index)=>{
      if(!(prices.includes(rwd.rPrice))){
        prices.push(rwd.rPrice)
        return true
      }else{
        newRwdArr.splice(index,1)
        return false
      }
    })
    return modRwdArr
  }

  function checkPrice(e:any){
    if(newRwdIds.includes(e.target.value)){
      setRPrice(e.target.value)
      !onEdit && setShowDuplicateWarning(true)
    }
    if(rwdIds.includes(parseFloat(e.target.value))){
      setRPrice(e.target.value)
      !onEdit && setShowDuplicateWarning(true)
    }    
    else{
      setShowDuplicateWarning(false)
      setRPrice(e.target.value)
    }
  }

  useEffect(()=>{
    const counArr = getCountrySelect()
    setCounOptionsArr(counArr)
    setRType("Digital")
  },[])

  useEffect(()=>{
    if(selectedOption.length > 0){
      const muShipsTo = selectedOption.map((option:counOpt, index:number)=>{
        return option.value
      })
      setShipsTo(muShipsTo)
    }
  },[selectedOption])

  useEffect(()=>{
    if(!rwdLoading){
      setRwdIds(cpRwIds)
    }
  },[rwdLoading, cpRwIds])

  return (
    <>
      {!currAddress
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
          "You will not be allowed to edit your reward details once your campaign has been published. " + 
          "Visit the Help Center to learn about different kinds of rewards you can offer."}
            </p>
            <div className="ct-card-sep"></div>
          </div>
          <div className="ct-container">
            <div className="rt-made-rewards">
              { rwdIds && 
              rwdIds.map((id, index)=>{
                return (
                  <div className="rt-rwd-edit-grp" key={index}>
                    <RewardCard id={id} address={currAddress} onEdit={true}/>
                    {/* <div className="rt-rwd-options"> 
                      <FontAwesomeIcon icon={faTrash} className="rt-rwd-x-icon" 
                        onClick={()=>{deleteRwd(id, index)}}
                      />
                    </div> */}
                  </div>
                )
              }) }

              { newRwdArr && 
              modifyRwdArr().map((rwd, index)=>{
                return (
                  <div className="rt-rwd-edit-grp" key={index}>
                    <DummyRewardCard rwd={rwd}/>
                    <div className="rt-rwd-options">
                      <FontAwesomeIcon icon={faSquarePen} className="rt-edit-icon" 
                        onClick={()=>{setRFormVisible(true); router.push(`/edit-campaign/${currAddress}/#rt-form`); editRwd(rwd, index)}}
                      />
                      <FontAwesomeIcon icon={faTrash} className="rt-rwd-x-icon" 
                        onClick={()=>{deleteRwd(rwd, index)}}
                      />
                    </div>
                  </div>
                )
              }) }
            </div>
            {showTBX && <TimelineBox offMe={()=>{setShowTBX(false)}} arr={tlArr} arrIndex={tlIndex} closable={tlClosable}/>}
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
                <p className="rt-form-inpt-label">{"Reward Type:"}</p>
                <div className="rt-form-grp-input">
                  <input type="radio" name="r-type" value={"Physical"} 
                    onChange={(e)=>setRType("Digital")} required
                  /> 
                  <p className="rt-rad-inpt-label">{"Digital"}</p>
                  <input type="radio" name="r-type" value={"Physical"} 
                    onChange={(e)=>setRType("Physical")} required
                  /> 
                  <p className="rt-rad-inpt-label">{"Physical"}</p>
                  <small className="rt-rad-info">{"Does this reward include physical items?"}</small>
                </div>
              </div>

              <div className="rt-form-inpt-grp ft-top">
                <p className="rt-form-inpt-label">{"Included items:"}</p>
                <div className="rt-form-items-inpt">
                  <div className="rt-form-add-item-grp">
                    <input type="text" name="r-items" className="rt-form-inpt"
                      onChange={(e)=>{setCurrItem(e.target.value)}} value={currItem}
                    />
                    <FontAwesomeIcon icon={faCirclePlus} className="rt-form-add-item-icon"
                      onClick={()=>{currItem && setItemArr(prev => ([...prev, currItem])); setCurrItem("")}}
                    />
                  </div>
                  <div className="rt-form-items-ul">
                    <ul>
                      {
                        itemArr.map((item, index)=>{
                          return (
                            <div key={index} className="rt-i-item">
                              <li>{item}</li>
                              <FontAwesomeIcon icon={faCircleXmark} className="rt-x-item"
                                onClick={()=>{itemArr.splice(index,1); setItemArr(prev => ([...itemArr]))}}
                              />
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

            <div className="rt-cta">
              <p className="rt-cta-label">{"Add a reward"}</p>
              <div className="rt-cta-btn" onClick={()=>{setRFormVisible(true); router.push(`/edit-campaign/${currAddress}#rt-form`)}}>
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
