/** Inner width of window. */
let ww = window.innerWidth 

/** Inner height of window. */
let wh = window.innerHeight 

window.addEventListener("resize", (e) => {
  ww = window.innerWidth
  wh = window.innerHeight

  app.renderer.resize(ww, wh)
})

const app = new PIXI.Application({height: window.innerHeight, width: window.innerWidth, backgroundColor: 0x000000})
const stage = app.stage
const canvas = app.view
Q("#background-shit").append(canvas)

let delta = 0

const glyphCount = 17
const glyphSpacing = 200
const glyphs = []

function glyphLoad(src) {
  const sprite = PIXI.Sprite.from(src)
  const position = new Vector2(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight
  )
  sprite.position.set(position.x, position.y)
  sprite.anchor.set(0.5)
  sprite.scale.set(0.28)

  const 
  filter = new PIXI.ColorMatrixFilter()    
  filter.brightness(0.2)
  sprite.filters = [filter]

  sprite.positionDefault = new Vector2(sprite.position.x, sprite.position.y)
  sprite.velocity =        new Vector2()
  sprite.angularVelocity = 0

  const offsetStrength = 0.05
  const offsetFactor = (Math.random() * (offsetStrength/2)) - offsetStrength
  sprite.offsetFactor = offsetFactor
  
  //also incorporate some random sine movement into with a randomized speed for both axes
  const timeScale =  0.0010 + Math.random() * 0.00015
  const waveX = (Math.random() * 100) + 20
  const waveY = (Math.random() * 100) + 20

  sprite.glyphUpdate = () => {
    /* constants */
    const distance = Mouse.clientPosition.distance({x: sprite.position.x, y: sprite.position.y})
    const distanceToDefault = Mouse.clientPosition.distance({x: sprite.positionDefault.x, y: sprite.positionDefault.y})
    const time = Date.now()
    
    /* FILTER */
    const effectRadius = 400
    const ceilClip = 100 //how many pixels away will still be full 1.0 alpha
    const maxAlpha = 0.55
    const minAlpha = 0.13
    sprite.filters[0].brightness(
      clamp(maxAlpha - ((distance - ceilClip) / (effectRadius * 2)), minAlpha, maxAlpha))

    /* POSITION */
    const [defX, defY] =    [sprite.positionDefault.x, sprite.positionDefault.y]
    const [sprtX, sprtY] =  [sprite.position.x, sprite.position.y]

    const waveOffsetX = Math.sin(time * timeScale) * waveX
    const waveOffsetY = Math.sin(time * timeScale) * waveY

    const mouseOffsetX = Mouse.clientPosition.x*offsetFactor - (ww/2)*offsetFactor
    const mouseOffsetY = Mouse.clientPosition.y*offsetFactor - (wh/2)*offsetFactor

    const maxOffsetScaling = 5
    const maxOffset = clamp(distanceToDefault/100, 0, maxOffsetScaling)

    const finalX = clamp(defX + mouseOffsetX, sprtX - maxOffset, sprtX + maxOffset) + (waveOffsetX * delta)
    const finalY = clamp(defY + mouseOffsetY, sprtY - maxOffset, sprtY + maxOffset) + (waveOffsetY * delta)
    
    sprite.position.set(
      finalX,
      finalY,
    )

    /* ROTATION */
    sprite.angularVelocity += clamp(PI_2 - (distance/(200 / PI)), -PI_2, PI_2) / 5
    sprite.angularVelocity = clamp(sprite.angularVelocity, -0.03, 0.03)
    sprite.rotation += sprite.angularVelocity
    sprite.rotation = clamp(sprite.rotation, 0, PI)
  }

  glyphs.push(sprite)
}

if(!state.isOrientationPortrait) {
  /* LOAD GLYPHS */
  for(let i = 1; i <= glyphCount; i++) {
    glyphLoad(`images/glyphs/${i}.png`)
  }

  /* SORT GLYPHS BASED ON OFFSET FACTOR, essentially creating parallax */
  glyphs.sort((a, b) => {return b.offsetFactor - a.offsetFactor})

  /* APPEND NOW IN THE NEW ORDER */
  glyphs.forEach(g => stage.addChild(g))

  function tick() {
    delta = app.ticker.elapsedMS / 1000
    glyphs.forEach(glyph => glyph.glyphUpdate())
  }

  app.ticker.add(tick)
}