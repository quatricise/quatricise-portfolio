class ProjectManager {
  static projectDetailVisible = false
  static openProject(project) {
    this.openProjectDetail()
    project.showProject()
  }
  static openProjectDetail() {
    Q("#project-detail").classList.remove("hidden")
    this.projectDetailVisible = true
  }
  static hideProjectDetail(project) {
    Q("#project-detail").classList.add("hidden")
    this.projectDetailVisible = false
  }
  static toggleProjectDetail(project) {
    this.projectDetailVisible ? 
    this.hideProjectDetail() :
    this.openProjectDetail()
  }
  static showByCategory(category) {
    /* wildcard */
    if(category === "*") {
      Qa(".project-thumbnail").forEach(thumbnail => thumbnail.classList.remove("hidden"))
    }
    else {
      Qa(".project-thumbnail").forEach(thumbnail => {
        if(thumbnail.dataset.category === category) 
        thumbnail.classList.remove("hidden")
        else
        thumbnail.classList.add("hidden")
      })
    }

    Qa(".project-switch-item").forEach(item => item.classList.remove("active"))
    Q(`.project-switch-item[data-category='${category}']`).classList.add("active")
  }
  static showAll() {

  }
  static setup() {
    /* add functions to switches */
    Qa(".project-switch-item").forEach(item => {
      item.onclick = () => this.showByCategory(item.dataset.category)
    })

    /* setup gallery */
    let galleryDimensions = Q("#projects-gallery").getBoundingClientRect()
    this.gallery.width = galleryDimensions.width
    this.gallery.columns = Math.floor(galleryDimensions.width / this.gallery.desiredCellWidth)
    this.gallery.itemWidth = (this.gallery.width / this.gallery.columns) - this.gallery.gap 
    this.gallery.itemHeight = (this.gallery.width / this.gallery.columns) - this.gallery.gap
    Q("#projects-gallery").style.gridTemplateColumns = `repeat(${this.gallery.columns}, 1fr)`
  }

  static gallery = {
    gap: 10,
    columns: 4,
    itemWidth: 250,
    itemHeight: 250,
    desiredCellWidth: 250,
  }
}