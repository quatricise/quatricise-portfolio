let hamburger = document.querySelector(".hamburger")
let checkbox = Q('#dayNightCheckbox')
let background = Q('#background')

let navbarButtons = Qa('.navbar-button')
let navbarButtonCell = Q('.button-cell')
let logoHolder = document.querySelector('.logo-holder')
let daytime = "dark";
let preloader = document.querySelector('.preloader')

/** @type HTMLDivElement */
const projectsPage = Q('#page--projects');
/** @type HTMLDivElement */
const aboutPage = Q('#page--about');
/** @type HTMLDivElement */
const searchResultsPage = Q('#page--search');

/** @type HTMLDivElement */
let currentPage = projectsPage;

class PageState {
  constructor(args = {}) {
    PageState.checkValidity(args)
    for(let key in args) {
      this[key] = args[key]
    }
  }
  set(args = {}) {
    PageState.checkValidity(args)
    for(let key in args) {
      this[key] = args[key]
    }
  }

  static allowed = ["page", "project", "tags", "search"]

  static checkValidity(args = {}) {
    for(let key in args) {
      if(!this.allowed.has(key) && key) throw "Wrong key in args: " + key
    }
  }
}

class Page {

  /** @type string
   * String that represents the name of the current page. Default home page is 'projects'.
   */
  static current = "projects"



  static set(/** @type string */ pageName) {
    if(state.isOrientationPortrait) {
      toggleNavlinks(false)
    }
  
    if(pageName === this.current) return
  
    this.current = pageName
    Qa(".page").forEach(p => p.classList.add("hidden"))
    Q("#page--" + pageName).classList.remove("hidden")
  
  
    if(pageName === "project") {
      projectsPage.classList.remove()
      document.body.scrollTo({top: 0, behavior: "auto"})
      document.body.style.overflowY = "hidden"
    }
    if(pageName === "about") {
      document.body.style.overflowY = ""
    }
  
    if(pageName === "search") {
      if(state.isOrientationPortrait) {
        Q(".header").classList.add("hidden")
      }
    }
    else {
      if(state.isOrientationPortrait) {
        Q(".header").classList.remove("hidden")
      }
    }
  }



  /** @returns PageState */
  static deserializeSearchString() {
    const searchQuery = window.location.search.replace("?", "")
    const pairs = searchQuery.split("+")
    const args = {}
    for(let pair of pairs) {
      if(!pair) continue
      const [key, value] = pair.split("=")
      args[key] = value
    }
    const state = new PageState(args)
    return state
  }



  /** @returns string | Returns a usable url navigator search string whatever appendix starting with "?" */
  static serializeSearchString(/** @type PageState */ data) {
    let url = "?"
    for(let key in data) {
      if(!key) continue
      const value = data[key]
      // if(value.includes(" ")) {
      //   value.replaceAll(" ", "%20")
      // }
     
      if(url !== "?") url += "+"
      url += key + "=" + value
    }
    return url
  }


  /** Applies some state data to the website so it works as a single-page app */
  static applyState(/** @type PageState */ pageState, fromHistory = false) {
    if(!pageState) return

    if(keyInObject(pageState, "page") === false) {
      pageState.set({page: "projects"})
    }
    if(keyInObject(pageState, "tags") === false) {
      pageState.set({tags: "*"})
    }
    // console.log(pageState)
    if(keyInObject(pageState, "search") === true && pageState.search != "") {
      pageState.set({page: "search"})
    }

    for(let key in pageState) {
      const value = pageState[key]
      
      if(!key) continue 
      
      switch(key) {
        case "page": {
          Page.set(value)
          break
        }

        case "tags": {
          Project.showByTags(...value.split("%20"))
          break
        }

        case "project": {
          let project = Array.from(Project.list).find(p => p.projectIdentifier === value)
          project.select()
          break
        }

        case "search": {
          Search.search(value)
          break
        }

        case "carouselindex": {
          for(let i = 0; i < value; i++)
          Project.current?.showNextImage()
          break
        }

      }
    }

    if(!fromHistory) {
      history.pushState(pageState, "", Page.serializeSearchString(pageState))
    }
  }
} 

function toggleNavlinks(/** @type Boolean */ value) {
  if(value === true) {
    currentPage.classList.add("hidden")
    navbarButtonCell.classList.remove("hidden")
  }
  else if(value === false) {
    currentPage.classList.remove("hidden")
    navbarButtonCell.classList.add("hidden")
  }
  else if(value === undefined) { //this is to toggle them
    currentPage.classList.toggle("hidden")
    navbarButtonCell.classList.toggle("hidden")
  }
  else {
    throw "Value incorrect"
  }
}

function quitPreloader() {
  preloader.classList.add('opacity-zero');
  setTimeout(() => preloader.classList.add('hidden'), 1000)
}



/* MAIN LOAD EVENT */

window.addEventListener('load', () => {
  if(!state.isOrientationPortrait) {
    navbarButtonCell.classList.remove("hidden")
  }
  if(state.isOrientationPortrait) { //@todo this is a hot-fix, not permanent
    Q(".projects-page-header").classList.add("hidden")
  }
  quitPreloader();
})



let loadingCircle = document.querySelector('.circle-loading')

function animateCircle() {
  isLoaded = false
  loadingCircle.classList.add('spinning')
  loadingCircle.classList.remove('hidden')
}



document.addEventListener("keydown", (event) => {

  if(event.code  === "ArrowLeft") {
    Project.current?.showPreviousImage()
  } 

  if(event.code === "ArrowRight") {
    Project.current?.showNextImage()
  }

  if(event.code === "Escape") {
    Search.hideSearchBar()
    Search.hideResults()
    Project.hideDetail()
  }

  if(event.code === "ArrowRight" && Project.projectDetailVisible) {
    Project.selectNext()
  }

  if(event.code === "ArrowLeft" && Project.projectDetailVisible) {
    Project.selectPrev()
  }

  if(event.code === "Tab" && document.activeElement == Q("#search-bar input")) {
    Search.hideSearchBar()
  }
  
  if(event.code === "Tab" && document.activeElement == Q("#search-bar input")) {
    Search.hideSearchBar()
  }

  if((event.code === "Enter" || event.code === "NumpadEnter" || event.keyCode === 13) && document.activeElement == Q("#search-bar input") && Q("#search-bar-input")?.value) {
    Page.applyState(new PageState({search: Q("#search-bar-input").value}))
  }
  if((event.code === "Enter" || event.code === "NumpadEnter" || event.keyCode === 13) && document.activeElement.classList.contains("project-gallery-item")) {
    document.activeElement.click()
  }

})

document.addEventListener("keyup", (event) => {
  if(event.code === "KeyF" && document.activeElement !== Q("#search-bar-input")) {
    Search.showSearchBar()
  } 
})

document.addEventListener("mousedown", (event) => {

  /* Execute search when clicking on the search icon while the searchbar is open */
  if(event.target.closest(".search-bar-icon") && Q("#search-bar-input")?.value && Search.searchBarVisible) {
    Page.applyState(new PageState({search: Q("#search-bar-input").value}))
  }

})

Q("#search-bar").onfocus =      () => Search.showSearchBar()
Q("#search-bar input").onblur = () => Search.hideSearchBar()
Q("#background").onclick =      () => Project.hideDetail()


/** @type Animation - Animation instance of the arrow container in the project detail. */
let arrowAnimation = null

/* project detail arrow hiding */
Q("#project-detail-artwork-side").onmouseout = () => {

  setTimeout(() => {

    arrowAnimation = Q("#project-detail-image-arrows").animate([
      {filter: "opacity(1)"},
      {filter: "opacity(0)"},
    ], {
      duration: 1500,
      easing: "ease-in-out"
    })
    arrowAnimation.onfinish = () => {
      Q("#project-detail-image-arrows").style.filter = "opacity(0)"
    }

  }, 800)
}
Q("#project-detail-artwork-side").onmouseover = () => {
  arrowAnimation?.cancel()
  Q("#project-detail-image-arrows").style.filter = ""
}



document.addEventListener("mousemove", (event) => {
  Mouse.update(event)
})


Q("#projects-gallery-wrapper").addEventListener("scroll", (e) => {
  /* we don't want the logo to ever hide on desktop */
  if(!state.isOrientationPortrait) return

  const scrollTop = Q("#projects-gallery-wrapper").scrollTop

  /* scrolled up */
  if(state.lastScrollTop > scrollTop) {
    if(scrollTop <= 0) {
      logoAnimate(true)
    }
  }
  /* scrolled down */
  else {
    logoAnimate(false)
  }

  state.lastScrollTop = scrollTop
})

function logoAnimate(show = true) {

  /* if the state is already what it should be */
  console.log(state.logoVisible === show)
  if(state.logoVisible === show) return

  /* the naming is baaaad */
  const navbar = Q(".navbar")
  const logo = Q(".banner-image.mobile")

  if(logo.getAnimations().length !== 0) {
    return
  }

  const height = navbar.offsetHeight

  let to = "0px"
  let from = (-height + "px")
  let easing = show ? "cubic-bezier(0.2, 0.0, 0.3, 1.0)" : "cubic-bezier(0.7, 0.0, 0.8, 1.0)"
  let duration = 500

  if(!show) {
    [to, from] = [from, to]
  }

  logo.style.top = from
  logo.animate([
    {top: from},
    {top: to},
  ], {
    duration,
    easing
  })
  .onfinish = () => {
    logo.style.top = to
    show ? logo.classList.remove("hidden") : logo.classList.add("hidden")
  }
  state.logoVisible = show
}


function init() {
  Project.init()
  Search.init()

  /* Process the URL search to allow things such as linking to pre-filtered content or opening a specific project */
  /* @todo replace this with Page.applyState */
  const state = Page.deserializeSearchString()
  Page.applyState(state)

  /* implement the history thing */
  window.addEventListener("popstate", (e) => {
    Page.applyState(history.state, true)
  })
}
window.onload = init
