import { counOpt } from "@/types"
import country from "country-list-js"

export default function getCountrySelect(countries:any[] = []){
  if(countries.length){
    let counArr:counOpt[] = []
    if(countries[0] == "_AITW"){
      counArr.push({ value: "_AITW", label:"Anywhere in the world" })
      return counArr
    }else{
      countries.forEach(mutateCoun)
      function mutateCoun(value:string, index:number){
        let x:counOpt = { value: value, label: value }
        counArr.push(x)
      }
      return counArr
    }
  }else{
    let countryNames = (country.names()).sort()
    let counArr:counOpt[] = [{ value: "_AITW", label: "Anywhere in the world" }]
  
    function mutateCoun(value:string, index:number){
      let x:counOpt = { value: value, label: value }
      counArr.push(x)
    }
  
    countryNames.forEach(mutateCoun)
    return counArr
  }
}