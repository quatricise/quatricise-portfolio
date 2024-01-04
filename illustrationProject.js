class IllustrationProject {
  constructor(imageDataBlock) {
    this.image = imageDataBlock
    this.category = "illustration"
    this.createGalleryItemHTML() 
    IllustrationProject.list.push(this)
  }
  createGalleryItemHTML() {
    let 
    item = document.createElement("div")
    item.classList.add("project-thumbnail")
    item.style.width = ProjectManager.gallery.itemWidth + "px"
    item.style.height = ProjectManager.gallery.itemHeight + "px"
    item.dataset.category = this.category

    let
    image = new Image()
    image.draggable = false

    let thumbnailSource = `projectData/design/illustrationDump/${this.image.thumbnail}`
    fetch(thumbnailSource)
    .then(data => image.src = thumbnailSource)
    .catch(data => image.src = `projectData/design/illustrationDump/${this.image.src}`)

    image.onclick = () => this.load()

    let 
    description = document.createElement("div")
    description.classList.add("project-gallery-item-description")
    description.innerText = this.image.name

    let 
    projectType = document.createElement("div")
    projectType.classList.add("project-gallery-item-project-type")
    projectType.innerText = "Illustration"

    let
    thumbnailTextLabel = document.createElement("div")
    thumbnailTextLabel.classList.add("project-gallery-item-label")

    thumbnailTextLabel.append(projectType, description)
    item.append(image, thumbnailTextLabel)
    
    Q("#projects-gallery").append(item)
  }
  load() {
    
  }
  static list = []
}
