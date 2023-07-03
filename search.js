class Search {
  static results = new Set()
  static currentDataBlock = null
  static currentProjectType = null
  static searchBarVisible = false
  static showSearchBar() {
    Q("#search-bar").classList.add("active")
    Q("#search-bar input").focus()
    Q("#project-categories").classList.add("hidden")
    this.searchBarVisible = true
  }
  static hideSearchBar() {
    Q("#search-bar").classList.remove("active")
    Q("#search-bar input").blur()
    Q("#project-categories").classList.remove("hidden")
    this.searchBarVisible = false
  }
  static toggleSearchBar() {
    this.searchBarVisible ? this.hideSearchBar() : this.showSearchBar()
  }
  static for(searchQuery) {
    this.currentProjectType = "music" 
    //this is shit currently, the results do not store information of project type, 
    //so the only thing that can be searched is music
    this.results.clear()
    let searchProperties = ["title", "releaseDate", "description", "projectType", "projectState", "genres", "tracks"]
    for(let key in projectData.music) {
      let dataBlock = projectData.music[key]
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
      this.results.add(this.currentDataBlock)
      
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
    this.results.forEach(result => {
      let element = this["createSearchElement" + this.currentProjectType.capitalize()](result)
      Q("#search-results").append(element)
    })
    setPage(searchResultsPage)
  }
  static hideResults() {
    setPage(projectsPage)
  }
  static createSearchElementMusic(dataBlock) {
    let 
    element = document.createElement("div")
    element.classList.add("search-result-element")

    let
    title = document.createElement("div")
    title.classList.add("search-result-title")
    title.innerText = dataBlock.title || "No title"

    let
    cover = new Image()
    cover.draggable = false
    cover.src = `projectData/music/${dataBlock.blockName}/images/coverSmall.jpg`
    cover.classList.add("search-result-image")

    element.append(cover, title)
    return element
  }
  static createSearchElementArtwork() {

  }
  //#endregion
}