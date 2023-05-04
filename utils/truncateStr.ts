function truncateStr(fullStr:string, strLen:number)
{
  const realLen = strLen - 3
  const frontSlice = Math.ceil(realLen / 2) 
  const backSlice = Math.floor(realLen / 2) 
  const frontChars = fullStr.slice(0, frontSlice)
  const backChars = fullStr.slice(fullStr.length - backSlice, fullStr.length)
  const charsToDisplay = frontChars + "—" + backChars

  return charsToDisplay
}

export { truncateStr }