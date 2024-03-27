/** @returns HTMLElement */
function Q(query) {
  return document.querySelector(query)
}
/** @returns Array<HTMLElement> */
function Qa(query) {
  return Array.from(document.querySelectorAll(query))
}

function El(
  element_tag_name = "div", 
  css_class = "words separated by spaces", 
  attributes = [] /* = [["key", "value"]] */,
  inner_text = "",
) {
  let element = document.createElement(element_tag_name)
  let css_classes = css_class.split(' ')
  attributes.forEach(attr=> {
    element.setAttribute(attr[0], attr[1])
  })
  css_classes.forEach(cls => {
    element.classList.add(cls)
  })
  element.innerText = inner_text
  return element
}

El.special = (name) => {
  if(name === "node-socket-out") return El('div', "dialogue-node-socket out", [["title", "Drag to connect to other sockets"]])
  if(name === "node-socket-in") return El('div', "dialogue-node-socket in", [["title", "Drag to connect to other sockets"]])
}
El.image = (src) => {
  let img = new Image()
  img.src = src
  return img
}

El.has_all_classes = (element, classes = []) => {
  let predicate = true
  classes.forEach(cls => {
    if(element.classList.contains(cls) === false) predicate = false 
  })
  return predicate
}

function SVGEl(
  element_tag_name = "svg", 
  css_class = "words separated by spaces", 
  attributes = [] /* = [["key", "value"]] */,
  inner_text = "",
) {
  let element = document.createElementNS("http://www.w3.org/2000/svg", element_tag_name)
  let css_classes = css_class.split(' ')
  attributes.forEach(attr=> {
    element.setAttribute(attr[0], attr[1])
  })
  css_classes.forEach(cls => {
    element.classList.add(cls)
  })
  element.innerText = inner_text
  return element
}

/** @returns String */
function secondsToMinutesString(/** @type Number */ seconds) {
  var min = parseInt(parseInt(seconds) / 60);
  var sec = parseInt(seconds % 60);
  if (sec < 10) {
    sec = "0"+ sec
  }
  if (min < 10) {
    min = "0"+ min
  }
  return min + ":" + sec
}

function getChildIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.childNodes, node)
}

function rand(min, max) {
  return Math.random()*(max-min) + min
}
function randR(min, max) {
  return Math.round(Math.random()*(max-min) + min)
}
function randInt(min, max) {
  return Math.round(Math.random()*(max-min) + min)
}
function pickRand(values = [0,1]) {
  let index = Math.round(Math.random()*(values.length - 1))
  return values[index]
}
function randomData(...data) {
  let i = randR(0, data.length - 1)
  return data[i]
}
function clamp(value, min, max) {
  let val = value
  if(val <= min) val = min
  if(val >= max) val = max
  return val
}

function radToDeg(rad) {
  return rad * 180/PI
}
function degToRad(deg) {
  return (deg/180) * PI
}

function sum(values = []) {
  let result = 0
  values.forEach((val)=> {
    result += val
  })
  return result
}

function avg(...numbers) {
  let sum = 0
  numbers.map(num => sum += num)
  return sum / numbers.length
}

function uniqueID(array) {
  let id = randR(0, 1_000_000)
  let isUnique = false
  while(!isUnique) {
    isUnique = true
    array.forEach(item => {
      if(item.id === id) {
        isUnique = false
        id = randR(0, 1_000_000)
      }
    })
  }
  return id
}
function stringToBool(string) {
  if(string === "true") return true
  if(string === "false") return false
  else alert(`not "false" or "true"`)
}
//valueTo is more accurately an ADD value to the valueFrom - if valueFrom = 900, valueTo = 100, the resulting value = 1000
function easeLinear(curTime, valueFrom, valueAdd, duration) {
  return (valueAdd * curTime) / duration + valueFrom;
}

function easeInOutQuad(curTime, valueFrom, valueAdd, duration) {
  if ((curTime /= duration / 2) < 1) {
    return (valueAdd / 2) * curTime * curTime + valueFrom;
  } else {
    return (-valueAdd / 2) * (--curTime * (curTime - 2) - 1) + valueFrom;
  }
}

function easeOutQuad(curTime, valueFrom, valueAdd, duration) {
  return -valueAdd * (curTime /= duration) * (curTime - 2) + valueFrom;
}

function easeInQuad(curTime, valueFrom, valueAdd, duration) {
  return valueAdd * (curTime /= duration) * curTime + valueFrom;
}


function mode(arr) {
  return arr.sort((a,b) =>
        arr.filter(v => v === a).length
      - arr.filter(v => v === b).length
  ).pop();
}

const reducer = (accumulator, curr) => accumulator + curr;

// usage: [].reduce(reducer()) or something

function vectorRotate(x, y, rot) {
  var sin = Math.sin(rot);
  var cos = Math.cos(rot);
  // var newPos = {
  //   x: (cos * x) + (sin * y),
  //   y: (cos * y) - (sin * x)
  // }
  var newpos = new Vector2((cos * x) + (sin * y),(cos * y) - (sin * x))
  return newpos;
}

function vectorScale(vector, factor) {
  var newpos = {
    x: vector.x * factor,
    y: vector.y * factor
  }
  return newpos;
}

function vectorNorm() {
  //normalize vector
}

function weightedRandom(values = {apple: 1, orange: 2}) {
  let weights = []
  let keys = Object.keys(values)

  for (let i = 0; i < keys.length; i++) {
    weights.push(values[keys[i]])
  }

  let thresholds = []
  let value = 0;
  let prevValue = 0;
  for (let i = 0; i < keys.length; i++) {
    value = weights[i] + prevValue
    thresholds.push(value)
    prevValue = value
  }
  let pick;
  let random = randR(0,thresholds[thresholds.length - 1])

  for (let i = 0; i < thresholds.length; i++) {
    if(i === 0) {

      if(random < thresholds[i]) {
        pick = keys[i]
        break
      }

    }
    if(i > 0 && i < (thresholds.length - 1)) {

      if(random > thresholds[i - 1] && random <= thresholds[i]) {
        pick = keys[i]
        break
      }

    }
    if(i == thresholds.length - 1) {

      if(random <= thresholds[i]) {
        pick = keys[i]
        break
      }

    }
  }
  return pick
}

const PI = Math.PI
const PI_2 = Math.PI / 2
const TAU = Math.PI*2

class Vector2 {
  constructor(x = 0, y) {
    this.x = x
    if(y === undefined) this.y = x
    else this.y = y
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  distance(vector) {
    let v = new Vector2(
      Math.abs(this.x - vector.x),
      Math.abs(this.y - vector.y)
    )
    return v.length()
  }
  add(vector) {
    this.x = this.x + vector.x
    this.y = this.y + vector.y
    return this
  }
  dot(vector) {

  }
  sub(vector) {
    this.x = this.x - vector.x
    this.y = this.y - vector.y
    return this
  }
  get copy() {
    return new Vector2(this.x, this.y)
  }
  mult(magnitude) {
    this.x = this.x * magnitude
    this.y = this.y * magnitude
    return this
  }
  invert() {
    this.x *= -1
    this.y *= -1
    return this
  }
  normalize(length) {
    length = length || 1
    let total = this.length()
    this.x = (this.x / total) * length
    this.y = (this.y / total) * length
    return this
  }
  angle() {
    return Math.atan2(this.y, this.x)
  }
  angleTo(vector) {
    let angle = Math.atan2(vector.y - this.y, vector.x - this.x)
    if(angle < 0) angle += TAU
    return angle
  }
  result() {
    return new Vector2(this.x, this.y)
  }
  lerp(vector, amount) {
    return new Vector2(
      this.x + (vector.x - this.x) * amount,
      this.y + (vector.y - this.y) * amount
    )
  }
  rotate(angle) {
    this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
    this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
    return this
  }
  rotate_around(vector, rotation) {
    this.sub(vector)
    .rotate(rotation)
    .add(vector)
    return this
  }
  clamp(length) {
    if (this.length() > length)
      this.normalize(length)
    return this
  }
  lerp(target, value) {
    return new Vector2(this.x + (target.x - this.x) * value, this.y + (target.y - this.y) * value)
  }
  inbound(bound) {
    return this.x < bound && this.x > -bound && this.y < bound && this.y > -bound
  }
  set(x, y) {
    this.x = x
    if(y === undefined) this.y = x
    else this.y = y
    return this
  }
  set_from(vec) {
    this.x = vec.x
    this.y = vec.y
  }
  is(vector) {
    return this.x === vector.x && this.y === vector.y
  }
  isClose(margin, vector) {
    return this.distance(vector) <= margin
  }
  floor() {
    this.x = Math.floor(this.x)
    this.y = Math.floor(this.y)
    return this
  }
  round() {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
    return this
  }
  plain() {
    return {x: this.x, y: this.y}
  }
  static zero() {
    return new Vector2(0, 0)
  }
  static fromAngle(rotation) {
    return new Vector2(Math.cos(rotation), Math.sin(rotation))
  }
  static avg(...vectors) {
    let x = [],y = []
    vectors.map(vec => {x.push(vec.x); y.push(vec.y)})
    return new Vector2(avg(...x), avg(...y))
  }
}

function f(id) {
  return entities.find(e => e.id === +id)
}

function capitalize(string) {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1)
}

function rgb_to_hex(rgb) {
  let a = rgb.split("(")[1].split(")")[0]
  a = a.split(",")
  let b = a.map((x) => {              //For each array element
    x = parseInt(x).toString(16)      //Convert to a base16 string
    return (x.length==1) ? "0"+x : x  //Add zero if we get only one character
  })
  return "#" + b[0] + b[1] + b[2]
}

/** @returns String */
function secondsToMinutes(time) {
  var min = parseInt(parseInt(time) / 60);
  var sec = parseInt(time % 60);
  if (sec < 10) {
    sec = "0"+ sec
  }
  if (min < 10) {
    min = "0"+ min
  }
  return min + ":" + sec
}

function waitFor(durationMS) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, durationMS);
  });
}



/* animation utilities */

function animateFade(/** @type HTMLElement */ element, fromOpacity, toOpacity, duration, easing = "linear", onfinish = "none", onfinishFunc = () => {}) {

  /* auto show if going from 0 opacity */
  if(fromOpacity === 0) {
    element.classList.remove("hidden")
  }

  const anim = element.animate([
    {opacity: fromOpacity},
    {opacity: toOpacity},
  ],
  {
    duration: duration,
    easing: easing
  })

  switch(onfinish) {
    case "none": {
      anim.onfinish = () => {
        onfinishFunc()
      }
      break
    }
    case "hide": {
      anim.onfinish = () => {
        // element.style.opacity = 0
        // element.style.filter = "opacity(0)"
        element.classList.add("hidden")
        onfinishFunc()
      }
      break
    }
    case "show": {
      anim.onfinish = () => {
        element.classList.remove("hidden")
        onfinishFunc()
      }
      break
    }
  }
  return anim
}

class AnimOffset {
  constructor(fromX, toX, fromY, toY) {
    /** @type Number */ this.fromX =  fromX   ?? null
    /** @type Number */ this.toX =    toX     ?? null
    /** @type Number */ this.fromY =  fromY   ?? null
    /** @type Number */ this.toY =    toY     ?? null
  }
}

function animateTranslate(
  /** @type HTMLElement */  element, 
  /** @type AnimOffset */   animOffset, 
  duration, 
  easing = "linear"
) {
  let transFrom = ""
  let transTo =   ""

  if(animOffset.fromX !== null) {
    transFrom += animOffset.fromX + "px "
  }
  if(animOffset.fromY !== null) {
    transFrom += animOffset.fromY + "px "
  }
  if(animOffset.toX !== null) {
    transTo += animOffset.toX + "px "
  }
  if(animOffset.toY !== null) {
    transTo += animOffset.toY + "px "
  }

  const anim = element.animate([
    {translate: transFrom},
    {translate: transTo},
  ],
  {
    duration: duration,
    easing: easing,
  })
  anim.onfinish = () => {

  }
  return anim
}

function animateScale(
  /** @type HTMLElement */  element, 
  scaleXFrom,
  scaleYFrom,
  scaleXTo,
  scaleYTo,
  duration,
  easing = "linear"
) {
  let from = ""
  let to = ""

  if(scaleXFrom || scaleXTo) {
    from += scaleXFrom + " "
    to += scaleXTo + " "
  }
  if(scaleYFrom || scaleYTo) {
    from += scaleYFrom + " "
    to += scaleYTo + " "
  }
  const anim = element.animate([
    {scale: from},
    {scale: to},
  ],
  {
    duration: duration,
    easing: easing
  })
  return anim
}

function animateFilter(
  /** @type HTMLElement */  element, 
  filterFrom,
  filterTo,
  duration,
  easing = "linear"
) {
  const anim = element.animate([
    {filter: filterFrom},
    {filter: filterTo},
  ],
  {
    duration: duration,
    easing: easing
  })
  return anim
}

function animateColor(
  /** @type HTMLElement */  element, 
  bgFrom,
  bgTo,
  colorFrom,
  colorTo,
  duration,
  easing = "linear"
) {

  let from = {}
  let to = {}

  if(bgFrom || bgTo) {
    from.backgroundColor = bgFrom
    to.backgroundColor = bgTo
  }
  if(colorFrom || colorTo) {
    from.color = colorFrom
    to.color = colorTo
  }
  const anim = element.animate([
    from,
    to,
  ],
  {
    duration: duration,
    easing: easing
  })
  return anim
}