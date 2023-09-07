import { Notibox } from "@/components/exportComps"
import { noti } from "@/types"
import { Dispatch, ReactNode, createContext, useReducer } from "react"
import { v4 } from "uuid"

interface props {
  children: ReactNode
}

interface pyld {
  dispatch: Dispatch<any>
}

const NotificationContext = createContext<pyld | null>(null)

function reducer (state:noti[], action:any){
  switch(action.type){
  case "ADD_NOTI":
    return [...state, action.payload]
  case "DEL_NOTI":
    return state.filter(noti => noti.id != action.id)
  default:
    return state
  }
}

function NotificationProvider({ children }:props){
  const [state, dispatch] = useReducer(reducer, [])

  const payload:pyld = { dispatch }
  return (
    <NotificationContext.Provider value={payload}>
      <div className="noti-wrapper" style={state.length > 0 ? {} : { "display":"none" }}>
        { 
          state.map((note)=>{
            return <Notibox key={note.id} title={note.title} message={note.message} type={note.type} id={note.id}/>
          })
        }
      </div>
      {children}
    </NotificationContext.Provider>
  )
}

export { NotificationContext, NotificationProvider }