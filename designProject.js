class DesignProject {
  constructor() {
    this.category = "design"
    DesignProject.list.push(this)
  }
  createGalleryItemHTML() {
    let 
    item = document.createElement("div")
    item.classList.add("project-thumbnail")
    item.style.width = ProjectManager.gallery.itemWidth + "px"
    item.style.height = ProjectManager.gallery.itemHeight + "px"
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
  static list = []
}
