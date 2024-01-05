class AudioProject {
  constructor(name) {
    this.name = name
    this.projectData = projects.music[name]
    this.audioCategory = this.projectData.category
    this.category = "music"
    this.selected = false
    this.elements = {}
    this.createGalleryItemHTML()
    AudioProject.list.push(this)
  }
  createGalleryItemHTML() {
    let 
    item = document.createElement("div")
    item.classList.add("project-thumbnail")
    item.style.width = Project.gallery.itemWidth + "px"
    item.style.height = Project.gallery.itemHeight + "px"
    item.dataset.category = this.category
    item.onclick = () => this.load()

    let
    image = new Image()
    image.draggable = false
    image.dataset.srcset = `projectData/music/${this.name}/images/coverSmall.jpg 450w, projectData/music/${this.name}/images/coverLarge.jpg 900w`
    image.src =`projectData/music/${this.name}/images/coverSmall.jpg`

    let 
    description = document.createElement("div")
    description.classList.add("project-gallery-item-description")
    description.innerText = this.projectData.title

    let 
    projectType = document.createElement("div")
    projectType.classList.add("project-gallery-item-project-type")
    projectType.innerText = "Music"

    let
    background = new Image()
    background.classList.add("music-background-image")
    background.src = `projectData/music/${this.name}/images/background.jpg`
    background.style.filter = "opacity(0)"
    
    let
    thumbnailTextLabel = document.createElement("div")
    thumbnailTextLabel.classList.add("project-gallery-item-label")

    thumbnailTextLabel.append(projectType, description)
    item.append(image, thumbnailTextLabel)
    
    Q("#projects-gallery").append(item)

    this.elements.item = item
    this.elements.albumCover = image
    this.elements.description = description
    this.elements.background = background
  }
  createHTML() {
    let 
    container = document.createElement("div")
    container.classList.add("project-thumbnail", `cover-container--${this.name}`, "box-shadow--dark-generic", "hide-gradient")
    container.style.background = `linear-gradient(90deg, ${this.projectData.colors.gradient[0]} 0%, ${this.projectData.colors.gradient[1]} 100%)`
    container.onclick = () => this.load()
  
    let 
    image = new Image()
    image.draggable = false
    image.classList.add("album-cover", this.name)
    image.dataset.srcset = `projectData/music/${this.name}/images/coverSmall.jpg 450w, projectData/music/${this.name}/images/coverLarge.jpg 900w`
    image.src =`projectData/music/${this.name}/images/coverSmall.jpg`

    let
    description = document.createElement("div")
    description.classList.add("hidden")
    description.id = "description--" + this.name
    description.innerHTML = this.projectData.description + "<br>"

    let
    background = new Image()
    background.classList.add("music-background-image")
    background.src = `projectData/music/${this.name}/images/background.jpg`
    background.style.filter = "opacity(0)"

    container.append(image)

    Q("#projects-gallery").append(container)
    Q("#project-detail-description").append(description)
    Q("#background-container").append(background)

    this.elements.albumContainer = container
    this.elements.albumCover = image
    this.elements.description = description
    this.elements.background = background
  }
  load() {
    AudioProject.deselectAll()
    revertPlay()
    refreshAudioPlayer(this.name)
    this.select()
    Q('.myBarColor').style.backgroundColor = this.projectData.colors.accent
  }
  select() {
    if(this.selected) return

    this.selected = true    
    this.elements.description.classList.remove("hidden")
    this.showBackground()
    setDaytimeForTracks()
  }
  deselect() {
    if(!this.selected) return

    this.selected = false    
    this.elements.description.classList.add("hidden")
    this.hideBackground()
  }
  hideBackground() {
    this.elements.background.style.filter = "opacity(0)"
  }
  showBackground() {
    this.elements.background.style.filter = "opacity(1)"
  }
  showProject() {
    this.elements.albumContainer.classList.remove("hidden")
  }  
  hideProject() {
    this.elements.albumContainer.classList.add("hidden")
  }
  enlargeAlbumCover() {
    openLightboxAlbum()
    lightboxAlbumImage.srcset = this.elements.albumCover.getAttribute("data-srcset");
  }
  static deselectAll() {
    this.list.forEach(project => project.deselect())
  }
  static list = []
}