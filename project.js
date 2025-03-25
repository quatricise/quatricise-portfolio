class Project {
  constructor(projectIdentifier) {
    /** The actual key inside projects{} */
    this.projectIdentifier = projectIdentifier

    /** @type Object - Raw data of the project, such as image and music links, and text. */
    this.data = projects[projectIdentifier]

    /** @type Array<HTMLImageElement> Crappy solution to displaying images - just push them here. */
    this.images = []

    /** @type HTMLImageElement */
    this.currentImage = null

    /** The CSS color declaration used for audio player */
    this.trackColor = null

    /** @type Set<String> - Set of tags that describe the project, e.g.: music, code, illustration, design */
    this.tags = new Set()
    this.data.tags.forEach(t => this.tags.add(t))

    /** @type Map<String, HTMLElement> - Contains refs to HTML elements that are part of this project. */
    this.elements = new Map()

    this.createGalleryItem()

    Project.list.add(this)
  }

  /** Creates the HTML thumbnail that can be clicked on inside the project gallery. */
  createGalleryItem() {
    let 
    item = document.createElement("div")
    item.classList.add("project-gallery-item")
    item.style.width = Project.gallery.itemWidth + "px"
    item.style.height = Project.gallery.itemHeight + "px"
    item.dataset.tags = Array.from(this.tags).join(" ")
    item.dataset.project = this.projectIdentifier
    item.onclick = () => this.select()
    item.tabIndex = 0

    let
    thumbnail = new Image()
    thumbnail.draggable = false
    thumbnail.src =`projects/${this.projectIdentifier}/thumbnail.jpg`

    let
    thumbnailCircle = document.createElement("div")
    thumbnailCircle.classList.add("thumbnail-overlay-circle", "hidden")

    let 
    description = document.createElement("div")
    description.classList.add("project-gallery-item-description")
    description.innerText = this.data.title

    let 
    projectTag = document.createElement("div")
    projectTag.classList.add("project-gallery-item-project-type")
    /** @type String - Let the project visually only show the main tag inside the gallery thumbnail. */
    let firstTag = this.tags.values().next().value
    projectTag.innerText = "#" + firstTag

    let
    thumbnailTextLabel = document.createElement("div")
    thumbnailTextLabel.classList.add("project-gallery-item-label")

    thumbnailTextLabel.append(projectTag, description)
    item.append(thumbnail, thumbnailCircle, thumbnailTextLabel)
    
    Q("#projects-gallery").append(item)

    this.elements.set("item", item)
    this.elements.set("thumbnail", thumbnail)
    this.elements.set("thumbnailCircle", thumbnailCircle)
    this.elements.set("description", description)

    /* this looked weird */
    // thumbnail.onload = () => {
    //   description.style.backgroundColor = Project.generateGalleryItemLabelColor(this)
    // }
  }

  /** Open project detail, fill it with this.data and also update the background to contain an adjusted, darkened version of the gallery thumbnail. */
  select() {
    Project.showDetail()

    if(Project.current === this) return
    Project.current?.deselect()
    

    /* clear project detail panel */
    Q("#project-detail-type").innerHTML = ""
    Qa(".artwork-side-image").forEach(img => img.remove())
    Qa(".project-content--iframe").forEach(el => el.remove())

    /* clear images, it's simpler that way */
    this.images = []


    /* tags */
    let tagsHTML = El("div", "tag-container")
    /* fill the tag container with interactive tag buttons */
    Array.from(this.data.tags).forEach(tag => {
      let button = El("div", "tag-button")
      button.innerText = `#${tag} `
      button.style.cursor = "pointer"

      /* make button close the detail and filter the gallery by the tag */
      button.onclick = () => {
        Project.hideDetail()
        Page.applyState(new PageState({tags: tag}))
      }

      tagsHTML.append(button)
    })
    Q("#project-detail-type").append(tagsHTML)
    
    /* scroll-up button */
    Q("#project-detail-button-scroll-up").classList.add("hidden")
    
    /* title */
    Q("#project-detail-title").innerHTML = this.data.title

    /* description */
    Q("#project-detail-description").innerHTML = this.data.description

    /* Process data.content push the generated images into an array of content stored on this class. */
    this.data.content.forEach(content => {

      switch(content.type) {
        /* this means it only loads one tracklist from a project, a project cannot contain multiple audio tracklists */
        case "audio": {
          AudioPlayer.loadTracklist(this, content)

          /* add space at the bottom so the description can scroll far enough */
          Q("#project-detail-text-side").style.paddingBottom = "120px"

          break
        }
        case "images": {
          content.src.forEach((img, index) => {
            let image = El("img", "artwork-side-image", [["src", this.generateFileURL(img.src)],["title", img.title ?? ""]])

            /* append all images if option singleImageView == false */
            if(
              index === 0 || 
              this.data.options?.singleImageView == false
            ) {
              this.currentImage = image
              Q("#project-detail-artwork-side").append(image)
            }

            this.images.push(image)
          })
          break
        }
        case "text": {
          const html = El("div", "project-content--text", [])
          html.innerHTML = content.text
          Q("#project-detail-artwork-side").append(html)
          break
        }
        case "embed": {
          const iframe = El("iframe", "project-content--iframe", [["src", content.src], ["frameborder", "0"], ["referrerpolicy", "noreferrer"]])

          switch(content.size) {
            default: {
              iframe.style.width = "100%"
              iframe.style.height = "500px"
              iframe.style.minHeight = "500px"
              break
            }
            case "fill": {
              iframe.style.width = "100%"
              iframe.style.height = "900px"
              iframe.style.minHeight = "900px"
              break
            }
          }
          
          Q("#project-detail-artwork-side").append(iframe)
          break
        }
        default: {
          throw "Missing content label: images, audio, text"
        }
      }

    })



    /* hide arrows in the project detail gallery if only 1 image is there */
    if(this.images.length <= 1)
      Q("#project-detail-image-arrows").classList.add("hidden")
    else
      Q("#project-detail-image-arrows").classList.remove("hidden")



    /* process options */

    /* this adjusts the entire project-detail panel to have centered images */
    if(this.data.options?.collapseTextSide) {
      Q("#project-detail-text-side").classList.add("hidden")

      Q("#project-detail-artwork-side").classList.add("alt-layout")
      Q("#project-detail-content").classList.add("alt-layout")
    }
    else {
      Q("#project-detail-text-side").classList.remove("hidden")

      Q("#project-detail-artwork-side").classList.remove("alt-layout")
      Q("#project-detail-content").classList.remove("alt-layout")
    }


    if(this.data.options?.singleImageView) {
      
      if(state.isOrientationPortrait) {
        Q("#project-detail-artwork-side").after(Q("#project-detail-text-side"))
        Q("#project-detail-artwork-side").style.height = ""
        Q("#project-detail-text-side").style.paddingTop = ""
        // Q("#project-detail-artwork-side").style.justifyContent = ""
      }
      else {
        // Q("#project-detail-artwork-side").style.justifyContent = "center"
      }
    }
    else {
      Q("#project-detail-image-arrows").classList.add("hidden")
      
      if(state.isOrientationPortrait) {
        Q("#project-detail-text-side").after(Q("#project-detail-artwork-side"))
        Q("#project-detail-artwork-side").style.height = "unset"
        Q("#project-detail-text-side").style.paddingTop = "20px"
      }
    }


    if(this.data.options?.fillCoverWithFirstImage) {
      Q("#project-detail-cover").classList.remove("hidden")
      Q("#project-detail-cover").append(this.images[0].cloneNode(true))
    }
    else {
      Q("#project-detail-cover").classList.add("hidden")
    }


    Project.current = this
    Page.applyState(new PageState({page: "projects", project: this.projectIdentifier}))
  }


  /** Only relates to the image gallery inside project detail panel. */
  showNextImage() {
    let index = this.images.indexOf(this.currentImage)
    let nextImage = this.images[index + 1]
    if(nextImage && nextImage instanceof HTMLImageElement) {
      Q("#project-detail-artwork-side").append(nextImage) 
      this.currentImage.remove()
      this.currentImage = nextImage
    }

    /* adjust layout so the image fits in nicely */
  }

  /** Only relates to the image gallery inside project detail panel. */
  showPreviousImage() {
    let index = this.images.indexOf(this.currentImage)
    let previousImage = this.images[index - 1]
    if(previousImage && previousImage instanceof HTMLImageElement) {
      Q("#project-detail-artwork-side").append(previousImage) 
      this.currentImage.remove()
      this.currentImage = previousImage
    }
  }

  /** Close project detail and also reset the background to be the regular shade of black. Does not clear the project detail. */
  deselect() {
    Project.current = null

    /* remove generated audio track containers */
    Qa(".audio-track-container").forEach(c => c.remove())
  }

  /** Hide the background element with the darkened thumbnail. */
  hideBackground() {
    this.elements.background.style.filter = "opacity(0)"
  }

  /** Show the background element with the darkened thumbnail. */
  showBackground() {
    this.elements.background.style.filter = "opacity(1)"
  }

  /** Returns the full URL to a source file such as image or audio file */
  generateFileURL(filename) {
    return `projects/${this.projectIdentifier}/${filename}`
  }

  galleryItemToggle(...tags) {

    /* reset state on each toggle, this is error-prone as shit */
    Project.galleryAnimations.forEach(a => a.cancel())
    Project.galleryAnimations.empty()
    Project.numItemsReadyToHide = 0
    Project.projectsToHide.empty()
    
    if(this.elements.get("item").dataset.tags.includesAny(...tags)) {
      //do mobile without animations
      state.isOrientationPortrait ? this.galleryItemShowInstant() : this.galleryItemShow()
    }
    else {
      //do mobile without animations
      state.isOrientationPortrait ? this.galleryItemHideInstant() : this.galleryItemHide()
    }
  }

  async galleryItemShow() {
    const 
    item = this.elements.get("item")
    item.classList.remove("hidden")
    item.style.pointerEvents =  ""
    item.style.opacity =        ""
    this.elements.get("thumbnailCircle").classList.add("hidden")
  }

  async galleryItemHide() {
      const delay = Math.round(Math.random() * 200)
      await waitFor(delay)

      Project.projectsToHide.push(this)
      
      const duration = 480 - delay/2
      const circle = this.elements.get("thumbnailCircle")
      const item = this.elements.get("item")

      circle.classList.remove("hidden")
      item.style.pointerEvents = "none"

      Project.galleryAnimations.push(
        animateScale(circle, 0, 0, 1, 1, duration - 100, "cubic-bezier(0.75, 0.5, 0.5, 1.0)"))
      Project.galleryAnimations.push(
        animateScale(item, 1, 1, 1.12, 1.12, duration, "cubic-bezier(0.75, 0.5, 0.5, 1.0)"))

      const fltranim = animateFilter(item, "blur(0px) brightness(1) opacity(1)", "blur(5px) brightness(0.5) opacity(0.0)", duration, "cubic-bezier(0.0, 0.5, 0.5, 1.0)")
      Project.galleryAnimations.push(fltranim)
      fltranim.onfinish = () => {
        item.style.opacity = 0
        Project.numItemsReadyToHide += 1
        Project.galleryReflow()
      }
  }

  /** Simple method for mobile layouts */
  galleryItemShowInstant() {
    this.elements.get("item").classList.remove("hidden")
  }
  
  /** Simple method for mobile layouts */
  galleryItemHideInstant() {
    this.elements.get("item").classList.add("hidden")
  }
  
  //#region static
  
  /** Whether you can see the bottom-docked panel. */
  static projectDetailVisible = false

  static onScroll() {
    if(!this.projectDetailVisible) return

    let offset = Q("#project-detail-content").scrollTop
    let opacity = clamp((offset - 100) / 160, 0, 1)

    Q("#project-detail-top-shadow").style.opacity = opacity
    Q("#project-detail-top-line").style.opacity = opacity
    
    if(offset > window.innerHeight * 1.5) {
      Q("#project-detail-button-scroll-up").classList.remove("hidden")
    }
    else if(offset < window.innerHeight / 2) {
      Q("#project-detail-button-scroll-up").classList.add("hidden")
    }
  }
  
  /** Opens a bottom-docked panel with images, music and text contained within the project's data. */
  static showDetail() {
    this.projectDetailVisible = true

    this.animations.forEach(a => a.cancel())
    this.animations = []

    let duration = 330
    let easing = "cubic-bezier(0.0, 0.7, 0.2, 1.0)"
    
    Q("#project-detail-panel").style.filter = ""
    Q("#project-detail-panel").style.opacity = ""

    Q("#project-detail").style.opacity = ""
    Q("#project-detail").style.pointerEvents = ""

    Q("#project-detail").classList.remove("hidden")

    Q("#project-detail-content").scrollTo({top: 0, behavior: "auto"})
    Q("#project-detail-hide-button").classList.remove("hidden")

    // this.animations.push(animateTranslate(
    //   Q("#project-detail-hide-button"), new AnimOffset(0, 0, 200, 0), duration, easing))
    // this.animations.push(animateFilter(
    //   Q("#project-detail-hide-button"), "brightness(0.2) contrast(2) saturate(2)", "brightness(1) contrast(1) saturate(1)", duration, easing))
    this.animations.push(
      animateFilter(Q("#project-detail-panel"), "brightness(0.2) contrast(2) saturate(2) blur(10px)", "brightness(1) contrast(1) saturate(1) blur(0)", duration, easing))
    this.animations.push(
      animateTranslate(Q("#project-detail-panel"), new AnimOffset(0, 0, 50, 0), duration, easing))
  }

  /** Closes the bottom-docked panel. */
  static hideDetail() {
    this.projectDetailVisible = false

    let duration = 1050
    let easing = "cubic-bezier(0.1, 0.5, 0.5, 1.0)"

    let blurAmt = 100
    if(!state.isOrientationPortrait) blurAmt = 500

    this.animations.push(
      animateFade(
      Q("#project-detail-panel"), 1, 0, duration, easing, "none", () => {Q("#project-detail").classList.add("hidden")}))
    this.animations.push(
      animateTranslate(
      Q("#project-detail-panel"), new AnimOffset(0, 0, 0, 300), duration, easing))
    this.animations.push(
      animateScale(
      Q("#project-detail-panel"), 1.0, 1.0, 1.5, 1.25, duration, easing))
    this.animations.push(
      animateColor(
      Q("#project-detail"), "rgba(0, 0, 0, 0.75)", "rgba(0, 0, 0, 0)", null, null, duration, easing))
    this.animations.push(
      animateFilter(
      Q("#project-detail-panel"), "brightness(1) contrast(1) saturate(1) blur(0)", `brightness(0.75) contrast(5) saturate(1.5) blur(${blurAmt}px)`, duration, easing))

    Q("#project-detail").style.pointerEvents = "none"
    Q("#project-detail-hide-button").classList.add("hidden")

    /* collapse audio player */
    AudioPlayer.collapseHTML()

    Page.applyState(new PageState({page: "projects"}))
  }

  /** Toggles the bottom-docked panel. */
  static toggleDetail() {
    this.projectDetailVisible ? 
    this.hideDetail() :
    this.showDetail()
  }

  /** Filter the project gallery by tags. */
  static showByTags(/** @type String[] */ ...tags) {

    /* @todo ? cancel all animations */

    /* 1) show everything */
    if(tags[0] === "*") {
      this.list.forEach(project => {
        project.galleryItemShow()
      })
    }

    /* 2) Show all thumbnails whose dataset.tags includes any tags selected */
    else {
      this.list.forEach(project => {
        project.galleryItemToggle(...tags)
      })
    }

    /* Un-highlight all switches. @todo This is not ideal but so far is simple enough so I'm ignoring the "multiple tag visible" option */
    Qa(".project-tag-switch").forEach(item => item.classList.remove("active"))

    /* highlight the correct switches */
    Qa(`.project-tag-switch`).forEach(tagSwitch => {
      if(tagSwitch.dataset.tag.isAny(...tags)) {
        tagSwitch.classList.add("active")
      }
    })
  }



  /** Setup the gallery and other random shit that needs to be done on page load. */
  static init() {

    /* mobile layout adjustments */

    if(state.isOrientationPortrait) {
      Q("#projects-gallery-wrapper").classList.add("no-scrollbar")
      Q("#projects-gallery").classList.add("no-scrollbar")
      Q("#project-detail-content").classList.add("no-scrollbar")
      Q("#project-detail-hide-button").classList.add("portrait-mode")
      this.gallery.gap = 0

      Q("#project-detail-button-scroll-up").onclick = () => {
        Q("#project-detail-content").scrollTo({top: 0, behavior: "smooth"})
      }

    }
    


    /* setup gallery */

    let galleryDimensions = Q("#projects-gallery").getBoundingClientRect()
    this.gallery.width = galleryDimensions.width
    this.gallery.columns = Math.floor(galleryDimensions.width / this.gallery.desiredCellWidth)
    this.gallery.itemWidth = (this.gallery.width / this.gallery.columns) - this.gallery.gap 
    this.gallery.itemHeight = (this.gallery.width / this.gallery.columns) - this.gallery.gap
    Q("#projects-gallery").style.gridTemplateColumns = `repeat(${this.gallery.columns}, 1fr)`



    /* generate tag buttons */

    let tags = new Set()

    for(let key in projects) {
      projects[key].tags.forEach(t => tags.add(t))
    }

    tags.forEach(t => {
      let tagButton = El("div", "project-tag-switch", [], "#" + t)
      tagButton.tabIndex = 0
      tagButton.dataset.tag = t
      Q("#project-tags").append(tagButton)
    })



    /* select the "*" tag */
    // this.showByTags("*") 

    
    /* add functions to tag switches */
    Qa(".project-tag-switch").forEach(item => {
      item.onclick = () => Page.applyState(new PageState({tags: item.dataset.tag}))
      item.onkeydown = (e) => {
        if(e.code == "Enter" || e.code == "NumpadEnter") {
          Page.applyState(new PageState({tags: item.dataset.tag}))
        }
      }
    })

    /* setup canvas */
    this.canvas = document.createElement("canvas")
    this.ctx = this.canvas.getContext("2d")
    this.ctx.filter = "blur(500px)"
    
    /* generate projects */
    for(let key in projects)
      new Project(key)
  }

  /** Visual styling of the project gallery, this is used to initialize the element.
   * it's a bit shit, let's be honest
  */
  static gallery = {
    gap: 10,
    columns: 4,
    itemWidth: 250,
    itemHeight: 250,
    desiredCellWidth: 250,
  }

  /* After all items have been marked for removal, remove them at the same time, preventing glitches. */
  static galleryReflow() {
    if(this.numItemsReadyToHide === this.projectsToHide.length) {
      // console.log("gallery reflow")
      this.projectsToHide.forEach(p => p.elements.get("item").classList.add("hidden"))
      this.projectsToHide.empty()
      this.numItemsReadyToHide = 0
      this.galleryAnimations.empty()
    }
  }

  static generateGalleryItemLabelColor(/** @type Project */ project) {
    const src = project.elements.get("thumbnail")
    const [x, y] = [src.naturalWidth, src.naturalHeight]

    this.canvas.width = x
    this.canvas.height = y
    this.ctx.filter = "blur(200px)"
    this.ctx.drawImage(src, 0, 0)

    const imgdata = this.ctx.getImageData(x/2, y/2, 1, 1)
    const color = [imgdata.data[0], imgdata.data[1], imgdata.data[2]]

    // /* mute overly bright colors */
    // let multFactor = 1
    // for(let c of color) {
    //   multFactor = Math.min(110 / c, multFactor)
    // }
    // const finalColor = color.map(c => c * multFactor)

    const hsl = RGB_to_HSL(color[0], color[1], color[2])
    hsl.s = clamp(hsl.s, 25, 78)
    hsl.l = clamp(hsl.l, 15, 25)
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  }

  /** @type HTMLCanvasElement */
  static canvas

  /** @type CanvasRenderingContext2D */
  static ctx

  /** @type Set<Project> */
  static list = new Set()

  /** @type Project - Currently selected project, regardless of whether the detail panel is visible. */
  static current = null

  /** @type Array<Animation> */
  static animations = []

  /** @type Array<Animation> */
  static galleryAnimations = []

  /** @type Number */
  static numItemsReadyToHide = 0

  /** @type Array<Project> */
  static projectsToHide = []

  static select(/** @type String */ projectIdentifier) {
    let project = Array.from(this.list).find(p => p.projectIdentifier === projectIdentifier)
    project.select()
  }

  //#endregion static
}