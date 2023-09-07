import { months } from "@/constants/constants"

export function getDateFromTS(timestamp:number){
  let deli = new Date(timestamp * 1000)
  const deliMon = months[deli.getMonth()]
  const deliYr = deli.getFullYear()
  return(`${deliMon} ${deliYr}`) 
}
