class Search {
  /** @type Map<ProjectIdentifier, Object> */
  static results = new Map()
  static currentDataBlock = null
  static currentProject = null
  static searchBarVisible = false

  static showSearchBar() {
    Q("#search-bar").classList.add("active")
    Q("#search-bar input").focus()
    Q("#project-tags").classList.add("hidden")
    this.searchBarVisible = true
  }

  static hideSearchBar() {
    Q("#search-bar").classList.remove("active")
    Q("#search-bar input").blur()
    Q("#project-tags").classList.remove("hidden")
    this.searchBarVisible = false
  }

  static toggleSearchBar() {
    this.searchBarVisible ? this.hideSearchBar() : this.showSearchBar()
  }

  static search(/** @type String */ searchQuery) {
    if(searchQuery === "") return

    Q("#search-bar input").value = ""

    this.results.clear()
    let searchProperties = ["title", "releaseDate", "description", "projectType", "projectState", "genres", "tracks", "content", "src"]
    for(let key in projects) {
      let dataBlock = projects[key]
      this.currentProject = key
      this.currentDataBlock = dataBlock
      for(let prop of searchProperties) {
        this.searchData(dataBlock[prop], searchQuery)
      }
    }
    this.showResults()
  }

  static getActualDatatype(data) {
    let dataType = null
    if(Array.isArray(data))
      dataType = "array"
    if(typeof data == "object" || data !== null)
      dataType = "object"
    if(typeof data == "string")
      dataType = "string"
    if(data === null)
      dataType = "null"
    return dataType
  }

  static searchData(data, searchQuery) {
    let dataType = this.getActualDatatype(data)
    let match = this["search" + dataType.capitalize()]?.(data, searchQuery)
    if(match) 
      this.results.set(this.currentProject, this.currentDataBlock)
      
    return match
  }

  static searchArray(array, searchQuery) {
    for(let child of array) {
      if(this.searchData(child, searchQuery))
        return true
    }
    return false
  }

  static searchObject(object, searchQuery) {
    for(let key in object) {
      if(key.includes(searchQuery))
        return true
      if(typeof object[key] == "string" && object[key].includes(searchQuery))
        return true
    }
    return false
  }

  static searchString(string, searchQuery) {
    return string.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  }

  static searchNull() {
    return false
  }

  //#region visual logic
  static showResults() {
    Q("#search-results").innerHTML = ""
    this.results.forEach((result, projectIdentifier) => {
      let element = this.createSearchElement(result, projectIdentifier)
      Q("#search-results").append(element)
    })
    setPage(searchResultsPage)
  }
  static hideResults() {
    setPage(projectsPage)
  }
  static createSearchElement(dataBlock, projectIdentifier) {
    let 
    element = document.createElement("div")
    element.classList.add("search-result-element")
    element.onclick = () => Project.select(projectIdentifier)

    let
    title = document.createElement("div")
    title.classList.add("search-result-title")
    title.innerText = dataBlock.title || "No title"

    let
    cover = new Image()
    cover.draggable = false
    cover.src = `projects/${projectIdentifier}/thumbnail.jpg`
    cover.classList.add("search-result-image")

    element.append(cover, title)
    return element
  }
  //#endregion
}