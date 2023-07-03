String.prototype.capitalize = function() {
  return this.charAt(0).toLocaleUpperCase() + this.slice(1)
}
String.prototype.reverse = function() {
  let array = this.split('')
  let string = array.reverse().join('')
  return string
}
String.prototype.bool = function() {
  if(this.includes("false")) return false
  if(this.includes("true")) return true
}
String.prototype.matchAgainst = function(...strings) {
  let match = false
  strings.forEach(str => {
    if(str == this) 
      match = true
  })
  return match
}
String.prototype.includesAny = function(...strings) {
  for(let str of strings)
    if(this.includes(str))
      return true
}
String.prototype.splitCamelCase = function() {
  return this.replace(/([a-z])([A-Z])/g, '$1 $2')
}
String.prototype.camelCaseToLowerCaseArray = function() {
  return this.splitCamelCase().toLocaleLowerCase().split(" ")
}
String.prototype.convertCase = function(from, to) {
  let array = []
  switch(from) {
    case "camel": {
      array = this.camelCaseToLowerCaseArray()
      break
    }
    case "pascal": {
      array = this.camelCaseToLowerCaseArray()
      break
    }
    case "snake": {
      array = this.split("_")
      break
    }
  }
  if(to === "camel")
    return array.map((string, index) => index === 0 ? string : string.capitalize()).join("")
  if(to === "pascal")
    return array.map((string, index) => string.capitalize()).join("")
  if(to === "snake")
    return array.join("_")
  throw `unsupported conversion: ${from} ${to}`
}
Array.prototype.remove = function(...children) {
  children.forEach(child => {
    if(this.find(c => c === child) === undefined)
      return
    this.splice(this.indexOf(child), 1)
  })
}
Array.prototype.findChild = function(child) {
  return this.find(obj => obj === child)
}
Array.prototype.last = function() {
  return this[this.length - 1]
}
Array.prototype.empty = function() {
  while(this.length)
    this.shift()
}
