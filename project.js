class Project {
  constructor(projectIdentifier) {
    /** The actual key inside projects{} */
    this.projectIdentifier = projectIdentifier

    /** @type Object - Raw data of the project, such as image and music links, and text. */
    this.data = projects[projectIdentifier]

    /** Crappy solution to displaying images - just push them here. */
    this.images = []

    /** @type HTMLImageElement */
    this.currentImage = null

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
    projectTag.innerText = firstTag

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
  }

  /* Open project detail, fill it with this.data and also update the background to contain an adjusted, darkened version of the gallery thumbnail. */
  select() {
    Project.showDetail()

    if(Project.current === this) return
    Project.current?.deselect()
    

    /* clear project detail panel */
    Q("#project-detail-type").innerHTML = ""
    Qa(".artwork-side-image").forEach(img => img.remove())

    /* clear images, it's simpler that way */
    this.images = []


    /* tags */
    let tagsHTML = El("div", "tag-container")
    /* fill the tag container with interactive tag buttons */
    Array.from(this.data.tags).forEach(tag => {
      let button = El("span", "tag-button")
      button.innerText = `#${tag} `
      button.style.cursor = "pointer"

      /* make button close the detail and filter the gallery by the tag */
      button.onclick = () => {
        Project.hideDetail()
        Project.showByTags(tag)
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
          throw "not done"
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
      
      if(isOrientationPortrait) {
        Q("#project-detail-artwork-side").after(Q("#project-detail-text-side"))
        Q("#project-detail-artwork-side").style.height = ""
        Q("#project-detail-text-side").style.paddingTop = ""
      }
    }
    else {
      Q("#project-detail-image-arrows").classList.add("hidden")
      
      if(isOrientationPortrait) {
        Q("#project-detail-text-side").after(Q("#project-detail-artwork-side"))
        Q("#project-detail-artwork-side").style.height = "unset"
        Q("#project-detail-text-side").style.paddingTop = "20px"
      }
    }


    Project.current = this
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
      isOrientationPortrait ? this.galleryItemShowInstant() : this.galleryItemShow()
    }
    else {
      //do mobile without animations
      isOrientationPortrait ? this.galleryItemHideInstant() : this.galleryItemHide()
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
      const delay = Math.round(Math.random() * 260)
      await waitFor(delay)

      Project.projectsToHide.push(this)
      
      const duration = 750 - delay/2
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
  galleryItemShowInstant() {
    this.elements.get("item").classList.remove("hidden")
  }
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
    console.log("show detail");
    this.projectDetailVisible = true

    this.animations.forEach(a => a.cancel())
    this.animations = []

    let duration = 350
    let easing = "cubic-bezier(0.0, 0.7, 0.2, 1.0)"
    
    Q("#project-detail-panel").style.filter = ""
    Q("#project-detail-panel").style.opacity = ""

    Q("#project-detail").style.opacity = ""
    Q("#project-detail").style.pointerEvents = ""

    Q("#project-detail").classList.remove("hidden")

    Q("#project-detail-content").scrollTo({top: 0, behavior: "auto"})
    Q("#project-detail-hide-button").classList.remove("hidden")

    this.animations.push(animateTranslate(
      Q("#project-detail-hide-button"), new AnimOffset(0, 0, 200, 0), duration, easing))
    this.animations.push(animateFilter(
      Q("#project-detail-hide-button"), "brightness(0.2) contrast(2) saturate(2)", "brightness(1) contrast(1) saturate(1)", duration, easing))
  }

  /** Closes the bottom-docked panel. */
  static hideDetail() {
    console.log("hide detail");
    this.projectDetailVisible = false

    let duration = 1050
    let easing = "cubic-bezier(0.1, 0.5, 0.5, 1.0)"

    let blurAmt = 100
    if(!isOrientationPortrait) blurAmt = 500

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
  }

  /** Toggles the bottom-docked panel. */
  static toggleDetail() {
    this.projectDetailVisible ? 
    this.hideDetail() :
    this.showDetail()
  }

  /** Filter the project gallery by tags. */
  static showByTags(
    /** @type String[] */ ...tags
  ) {

    /* cancel all animations */

    /* show everything */
    if(tags[0] === "*") {
      this.list.forEach(project => {
        project.galleryItemShow()
      })
    }

    /* Show all thumbnails whose dataset.tags includes any tags selected */
    else {
      this.list.forEach(project => {
        project.galleryItemToggle(...tags)
      })
    }

    /* Un-highlight all switches. @todo This is not ideal but so far is simple enough so I'm ignoring the "multiple tag visible" option */
    Qa(".project-tag-switch").forEach(item => item.classList.remove("active"))

    /* highlight the correct switches */
    Qa(`.project-tag-switch`).forEach(sw => {
      if(sw.dataset.tag.isAny(...tags)) {
        sw.classList.add("active")
      }
    })
  }

  /** Setup the gallery and other random shit that needs to be done on page load. */
  static init() {

    if(isOrientationPortrait) {
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
      let tagButton = El("div", "project-tag-switch", [], t)
      tagButton.tabIndex = 0
      tagButton.dataset.tag = t
      Q("#project-tags").append(tagButton)
    })



    /* select the "*" tag */
    this.showByTags("*")


    
    /* add functions to tag switches */
    Qa(".project-tag-switch").forEach(item => {
      item.onclick = () => this.showByTags(item.dataset.tag)
    })
  }

  /** Visual styling of the project gallery, this is used to initialize the element.*/
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
      console.log("gallery reflow")
      this.projectsToHide.forEach(p => p.elements.get("item").classList.add("hidden"))
      this.projectsToHide.empty()
      this.numItemsReadyToHide = 0
      this.galleryAnimations.empty()
    }
  }

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