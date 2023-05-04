async function fetchRData(){
  const res = await fetch("/reward-text.txt")
  const final = await res.text()
  // const html = { __html: DOMPurify.sanitize(final) }
  return final
}

export { fetchRData }

{/* <article className="rc-description" dangerouslySetInnerHTML={rData}/> */}
