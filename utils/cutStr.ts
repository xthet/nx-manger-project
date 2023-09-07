export function cutStr(fullStr:string, strLen:number)
{
  if(fullStr.length > strLen){
    return fullStr.substring(0,strLen - 3) + "..."
  }else{return fullStr}
}
