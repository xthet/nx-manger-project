import Crowdfunder from "@/constants/abis/CrowdFunder.json"
import { ConnectionContext } from "@/contexts/connection"
import { NotificationContext } from "@/contexts/notification"
import { auth, conn } from "@/types"
import fleek from "@fleekhq/fleek-storage-js"
import { cutStr } from "@/utils/cutStr"
import { truncateStr } from "@/utils/truncateStr"
import { faImages } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import Error from "next/error"
import Head from "next/head"
import { useRouter } from "next/router"
import { FormEvent, useContext, useEffect, useState } from "react"
import ReactLoading from "react-loading"
import { v4 } from "uuid"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { CHECK_UVAL } from "@/constants/subgraphQueries"


export default function Account() {
  const { isConnected, connect, account, signer, isAuth, usrData }:conn = useContext(ConnectionContext)!
  const { dispatch } = useContext(NotificationContext)!
  const router = useRouter()
  const { address } = router.query
  const [uloading, setUloading] = useState(true)
  const [twit, setTwit] = useState("")
  const [usrName, setUsrName] = useState("")
  const [imgState, setImgState] = useState("unset")
  const [imgURLToBe, setImgURLToBe] = useState("")
  const [showImgNoti, setShowImgNoti] = useState(false)
  const [showInvalidUVal, setShowInvalidUVal] = useState(false)
  const [uValDuplicate, setUValDuplicate] = useState(false)

  const [showTBX, setShowTBX] = useState(false)
  const tlArr = [
    "Entering credentials",
    "Awaiting confirmation",
    "Account Updated"
  ]
  const [tlIndex, setTlIndex] = useState(0)
  const [tlClosable, setTlClosable] = useState(false)

  async function uploadImg(e:any){
    const date = new Date()
    const timestamp = date.getTime()
    const imgData = {
      apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY!,
      apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SEC!,
      key: `manger/usrPfps/${truncateStr(account, 10)}/MNG_${timestamp}`,
      data: e.target.files[0]
    }
    try {
      const tme = setTimeout(()=>{setShowImgNoti(true)},10000)
      const response = await fleek.upload(imgData)
      clearTimeout(tme)
      setImgURLToBe(`ipfs://${response.hashV0}`)
      setImgState("finished")
    } catch (error) {
      console.log(error)      
    }
  }

  async function checkName(e:string){
    if(e.length > 0){
      const valid = /^[a-z][a-z0-9_]{4,19}$/.test(e)
      if(!valid){
        setShowInvalidUVal(true)
      }else{setShowInvalidUVal(false)}
    }

    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })
      
    const userData = await client
      .query({
        query: CHECK_UVAL,
        variables: { term: e }
      })
      .then(async (data) => {return data.data.userAddeds})
      .catch(err => console.log("Error fetching data: ", err))

    if(userData.length > 0){
      setUValDuplicate(true)
    }else{setUValDuplicate(false)}
  }


  async function handleSubmit(e:FormEvent|any){
    setShowTBX(true)
    const data = new FormData(e.target)
    const username = data.get("username")!.toString()
    // let twitter = data.get("twitter")!.toString() ? data.get("twitter")!.toString() : "_NIL"
    let email = data.get("email")!.toString()
    let conAddress = data.get("conAddress")!.toString() ? data.get("conAddress")!.toString() : "_NIL"

    // if(!(twitter == "_NIL") && !twitter.includes("https://twitter.com/")){
    //   twitter = `https://twitter.com/${twitter.replace("@" || "https://twitter.com/" || "www.twitter.com/" || "https://www.twitter.com/" , "")}`
    // }
    const pfp = imgURLToBe ? imgURLToBe : "_NIL"
    if(username && email){  
      const crowdfunder = new ethers.Contract(Crowdfunder.address, Crowdfunder.abi, signer)
      try {
        setTlIndex(prev => prev >= tlArr.length ? prev : prev + 1)  
        const addUserTx = await crowdfunder.addUser(account, username, email, conAddress, pfp)
        await addUserTx.wait(1)
        setTlIndex(prev => prev >= tlArr.length ? prev : prev + 2)  
        dispatch({
          type: "ADD_NOTI",
          payload:{
            id: v4(),
            type: "SUCCESS",
            title: "Account Updated Successfully",
            message: ""
          }
        })
      } catch (error) {
        dispatch({
          type: "ADD_NOTI",
          payload:{
            id: v4(),
            type: "FAILURE",
            title: "Account Update Failed",
            message: "Sorry, we couldn't update your account details"
          }
        })
        console.log(error) 
        setShowTBX(true); setTlIndex(0)       
      }
    }
  }

  useEffect(()=>{
    if(usrData && usrData.pfp && (usrData.pfp != "_NIL")){
      setImgState("finished")
      setImgURLToBe(usrData.pfp)
    }
  },[usrData])

  useEffect(()=>{
    let id:any
    if(usrName.length > 0){id = setTimeout(()=>{checkName(usrName).catch(e=>console.log(e))}, 1000)}
    else{
      setUValDuplicate(false)
      setShowInvalidUVal(false)
    }
    return()=>{clearTimeout(id)}
  },[usrName])

  return (
    <>
      <Head>
        <title>{"Manger | Settings"}</title>
        <meta name="description" content="Manger Project - Account Settings" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/manger_favicon.svg" />
      </Head>
      {
        !address 
          ? <ReactLoading type="bubbles" color="#827B93"/> 
          : typeof(address) == "string" && address.includes("0x") && address.length == 42 ? isAuth 
            ? <section className="acs">
              <form onSubmit={(e)=>{e.preventDefault(); !uValDuplicate && !showInvalidUVal && handleSubmit(e)}} className="acs-container">
                <div className="acs-header">
                  <div className="acs-usr-address">{truncateStr(account, 14)}</div>
                  <h1 className="acs-title">{"Account Settings"}</h1>
                  <p className="acs-info">{"This isn't you?, please switch to the address you used to sign up."}</p>
                </div>

                <div className="acs-img-grp">
                  <p className="acs-avt-title">{"Avatar"}</p>
                  <div className="su-img-upld">
                    <div className="acs-img-inpt">
                      <input type="file" id="bt-card-img" hidden onChange={(e)=>{uploadImg(e); setImgState("loading")}}/>
                      <label htmlFor="bt-card-img" className="su-img-label">
                        <div className="su-img-container">
                          {imgState == "loading"
                            ? <ReactLoading type="bubbles" color="#827B93"/>
                            : imgState == "finished"
                              ? imgURLToBe && <img src={imgURLToBe.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="--" />
                              : <FontAwesomeIcon icon={faImages} className="acs-ipld-img-icon"/>
                          }
                        </div>
                      </label>
                    </div>
                    {/* {showImgNoti && <small className="inpt-small-noti">{"The network is congested right now, Image upload may take a while"}</small>} */}
                  </div>
                  <p className="acs-avt-spec">{"recommended: 150px x 150px"}</p>
                </div>

                <div className="su-inpt-grp">
                  <div className="su-inpt short">
                    <div className="acs-inpt-lbl">
                      <label htmlFor="username">{"Username"}</label>
                      {showInvalidUVal ? <small style={{ "color":"red" }}>{"Invalid Username!!"}</small> : uValDuplicate 
                        ? <small style={{ "color":"red" }}>{"Username already exists!!"}</small> 
                        : <small style={{ "color":"orange" }}>{"required"}</small>}
                    </div>
                    <input type="text" name="username" placeholder="username" required className="acs-form-input"
                      defaultValue={usrData ? usrData.username : ""}
                      onChange={(e)=>{setUsrName(e.target.value)}}
                    />
                  </div>

                  {/* <div className="su-inpt short">
                    <div className="acs-inpt-lbl">
                      <label htmlFor="twitter">{"Twitter"}</label>
                      <small style={{ "opacity":"0.7" }}>{twit && `https://twitter.com/${cutStr(twit,14)}`}</small>
                    </div>
                    <input type="text" name="twitter" placeholder="twitter_handle" className="acs-form-input" 
                      onChange={(e)=>{setTwit(e.target.value)}}
                      defaultValue={usrData ? usrData.twitter !== "_NIL" ? usrData.twitter.replace("https://twitter.com/", "") : "" : ""}
                    />
                  </div> */}
                </div>
                <div className="su-inpt full">
                  <div className="acs-inpt-lbl">
                    <label htmlFor="email">{"Email address"}</label>
                    <small style={{ "color":"orange" }}>{"required"}</small>
                  </div>
                  <input type="email" name="email" placeholder="email address" required className="acs-form-input"
                    defaultValue={usrData ? usrData.email : ""}
                  />
                </div>
                <div className="su-inpt full">
                  <div className="acs-inpt-lbl">
                    <label htmlFor="hAddress">{"Contact address"}</label>
                    <small style={{ "color":"orange" }}>{"required"}</small>
                  </div>
                  <textarea cols={91} rows={2} name="conAddress" placeholder="home address" className="acs-form-input"
                    defaultValue={usrData ? usrData.shipAddr !== "_NIL" ? usrData.shipAddr : "" : ""}
                  />
                </div>
                <div className="acs-cta">
                  <button type="submit">{"Save changes"}</button>
                </div>
              </form>
            </section> 
            : <Error statusCode={404}/> : <Error statusCode={404}/>
      }
    </>
  )
}
