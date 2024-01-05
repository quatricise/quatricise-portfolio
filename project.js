class Project {
  constructor(/** @type Object */ data) {

    /** @type Set<String> - Set of tags that describe the project, e.g.: music, code, illustration, design */
    this.tags = new Set()
    data.tags.forEach(t => this.tags.add(t))

    /** @type Object - Raw data of the project, such as image and music links, and text. */
    this.data = data

    /** @type Map<String, HTMLElement> - Contains refs to HTML elements that are part of this project. */
    this.elements = new Map()

    this.createGalleryItem()

    Project.list.add(this)
  }

  /** Creates the HTML thumbnail that can be clicked on inside the project gallery. */
  createGalleryItem() {
    let 
    item = document.createElement("div")
    item.classList.add("project-thumbnail")
    item.style.width = Project.gallery.itemWidth + "px"
    item.style.height = Project.gallery.itemHeight + "px"
    item.dataset.tags = Array.from(this.tags).join(" ")
    item.onclick = () => this.select()

    let
    image = new Image()
    image.draggable = false
    image.src =`projects/${this.name}/images/thumbnail.jpg`

    /* so this was some weird hack in the illustration projects */

    // let thumbnailSource = `projects/design/illustrationDump/${this.image.thumbnail}`
    // fetch(thumbnailSource)
    // .then(data => image.src = thumbnailSource)
    // .catch(data => image.src = `projects/design/illustrationDump/${this.image.src}`)

    let 
    description = document.createElement("div")
    description.classList.add("project-gallery-item-description")
    description.innerText = this.data.title

    let 
    projectType = document.createElement("div")
    projectType.classList.add("project-gallery-item-project-type")
    
    /** Let the project visually only show the main tag inside the gallery thumbnail. */
    let firstTag = this.tags.values().next().value
    projectType.innerText = firstTag

    console.log(firstTag)

    let
    background = new Image()
    background.classList.add("music-background-image")
    background.src = `projects/music/${this.name}/images/background.jpg`
    background.style.filter = "opacity(0)"
    
    let
    thumbnailTextLabel = document.createElement("div")
    thumbnailTextLabel.classList.add("project-gallery-item-label")

    thumbnailTextLabel.append(projectType, description)
    item.append(image, thumbnailTextLabel)
    
    Q("#projects-gallery").append(item)

    this.elements.set("item", item)
    this.elements.set("albumCover", image)
    this.elements.set("description", description)
    this.elements.set("background", background)

    {
      /* sooo this happens inside the AudioProject, and needs to be somehow standardized. */

      // Q("#projects-gallery").append(container)
      // Q("#project-detail-description").append(description)
      // Q("#background-container").append(background)

      // this.elements.albumContainer = container
      // this.elements.albumCover = image
      // this.elements.description = description
      // this.elements.background = background
    }
  }

  /* Open project detail, fill it with this.data and also update the background to contain an adjusted, darkened version of the gallery thumbnail. */
  select() {
    Project.showDetail()

    if(Project.selected === this) return
    Project.selected?.deselect()

    Q("#project-detail-title").innerHTML = this.data.title

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

    Q("#project-detail-type").innerHTML = ""
    Q("#project-detail-type").append(tagsHTML)

    Q("#project-detail-description").innerHTML = this.data.description

    Project.selected = this
  }

  /* Close project detail and also reset the background to be the regular shade of black. Does not clear the project detail. */
  deselect() {
    Project.selected = null
  }

  /** Hide the background element with the darkened thumbnail. */
  hideBackground() {
    this.elements.background.style.filter = "opacity(0)"
  }
  /** Show the background element with the darkened thumbnail. */
  showBackground() {
    this.elements.background.style.filter = "opacity(1)"
  }
  
  //#region static
  
  /** Whether you can see the bottom-docked panel. */
  static projectDetailVisible = false
  
  /** Opens a bottom-docked panel with images, music and text contained within the project's data. */
  static showDetail() {
    Q("#project-detail").classList.remove("hidden")
    this.projectDetailVisible = true
  }

  /** Closes the bottom-docked panel. */
  static hideDetail() {
    Q("#project-detail").classList.add("hidden")
    this.projectDetailVisible = false
  }

  /** Toggles the bottom-docked panel. */
  static toggleDetail() {
    this.projectDetailVisible ? 
    this.hideDetail() :
    this.showDetail()
  }

  /** Filter the project gallery by tags. */
  static showByTags( /** @type String[] */ ...tags) {

    /* show everything */
    if(tags[0] === "*") {
      Qa(".project-thumbnail").forEach(thumbnail => thumbnail.classList.remove("hidden"))
    }
    /* Show all thumbnails whose dataset.tags includes any tags selected */
    else {
      Qa(".project-thumbnail").forEach(thumbnail => {
        if(thumbnail.dataset.tags.includesAny(...tags)) 
          thumbnail.classList.remove("hidden")
        else
          thumbnail.classList.add("hidden")
      })
    }

    /* Un-highlight all switches. This is not ideal but so far is simple enough so I'm ignoring the "multiple tag visible" option */
    Qa(".project-switch-item").forEach(item => item.classList.remove("active"))

    /* highlight the correct switches */
    Qa(`.project-switch-item`).forEach(sw => {
      if(sw.dataset.tag.isAny(...tags)) {
        sw.classList.add("active")
      }
    })
  }

  /** Setup the gallery and other random shit that needs to be done on page load. */
  static init() {

    /* add functions to category switches */
    Qa(".project-switch-item").forEach(item => {
      item.onclick = () => this.showByTags(item.dataset.tag)
    })

    /* setup gallery */
    let galleryDimensions = Q("#projects-gallery").getBoundingClientRect()
    this.gallery.width = galleryDimensions.width
    this.gallery.columns = Math.floor(galleryDimensions.width / this.gallery.desiredCellWidth)
    this.gallery.itemWidth = (this.gallery.width / this.gallery.columns) - this.gallery.gap 
    this.gallery.itemHeight = (this.gallery.width / this.gallery.columns) - this.gallery.gap
    Q("#projects-gallery").style.gridTemplateColumns = `repeat(${this.gallery.columns}, 1fr)`
  }

  /** Visual styling of the project gallery, this is used to initialize the element.*/
  static gallery = {
    gap: 10,
    columns: 4,
    itemWidth: 250,
    itemHeight: 250,
    desiredCellWidth: 250,
  }

  /** @type Set<Project> */
  static list = new Set()

  /** @type Project - Currently selected project, regardless of whether the detail panel is visible. */
  static selected = null

  //#endregion static
}