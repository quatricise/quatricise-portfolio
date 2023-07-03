function embeddedElement(tagname, ...attributes) {
  let text = attributes.find(a => a[0] == "text")?.[1]
  let attribs = attributes.filter(a => a[0] != "text")
  return `<${tagname}${attribs.map(a => ` ${a[0] || ''}="${a[1] || ''}"`)}>${text || ''}</${tagname}>`
}