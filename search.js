class Search {
  /** @type Map<ProjectIdentifier, Object> */
  static results = new Map()
  static currentDataBlock = null
  static currentProject = null
  static searchBarVisible = false

  /** @type string */
  static searchQuery = ""

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

  static search(/** @type String */ query) {
    if(query == "") return
    console.log(query)
    this.searchQuery = query
    Q("#search-bar input").value = ""

    this.results.clear()
    let searchProperties = ["title", "tags", "releaseDate", "description", "projectType", "projectState", "genres", "tracks", "content", "src"]
    for(let key in projects) {
      let dataBlock = projects[key]
      this.currentProject = key
      this.currentDataBlock = dataBlock
      for(let prop of searchProperties) {
        this.searchData(dataBlock[prop], query)
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
  static async showResults() {
    Q("#search-results").innerHTML = ""
    let index = 0
    const delayMS = 35
    this.results.forEach(async (result, projectIdentifier) => {
      const element = this.createSearchResultElement(result, projectIdentifier)
      Q("#search-results").append(element)

      element.style.filter = "opacity(0)"
      ++index
      await waitFor(delayMS * index)
      animateFilter(element, "opacity(0)", "opacity(1.0)", 250, "cubic-bezier(0.3, 0.0, 0.4, 1.0)")
      element.style.filter = ""
    })
    Q("#search-results-wrapper").scrollTo({top: 0, behavior: "auto"})

    if(this.results.size === 0) {
      let 
      element = document.createElement("div")
      element.innerText = "No results"
      element.style.width = "100%"
      element.style.textAlign = "center"
      element.style.fontSize = "1.2rem"
      Q("#search-results").append(element)
      setTimeout(() => {
        Q("#close-search").focus()
        console.log(document.activeElement)
      }, 50)
    }
  }
  static hideResults() {
    Page.applyState(new PageState({page: "projects"}))
  }
  /** @returns HTMLDivElement */
  static createSearchResultElement(dataBlock, projectIdentifier) {
    let 
    element = document.createElement("div")
    element.classList.add("search-result-element")
    element.onclick = () => Project.select(projectIdentifier)

    let textContainer = El("div", "search-result-text-container", [])

    let
    title = document.createElement("div")
    title.classList.add("search-result-title")
    title.innerText = dataBlock.title || "No title"

    let
    desc = document.createElement("div")
    desc.classList.add("search-result-description")
    desc.innerHTML = dataBlock.description || "<Missing description>"

    let
    cover = new Image()
    cover.draggable = false
    cover.src = `projects/${projectIdentifier}/thumbnail.jpg`
    cover.classList.add("search-result-image")

    textContainer.append(title, desc)
    element.append(cover, textContainer)
    return element
  }

  
  static init() {
    if(state.isOrientationPortrait) {
      Q("#search-results-wrapper").classList.add("no-scrollbar")
    }  
  }
  //#endregion
}