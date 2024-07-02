let hamburger = document.querySelector(".hamburger")
let checkbox = Q('#dayNightCheckbox')
let background = Q('#background')

let navbarButtons = Qa('.navbar-button')
let navbarButtonCell = Q('.button-cell')
let logoHolder = document.querySelector('.logo-holder')
let daytime = "dark";
let preloader = document.querySelector('.preloader')

let projectsPage = Q('#projects-page');
let aboutPage = Q('#aboutPage');
let searchResultsPage = Q('#search-results-page');

/** @type HTMLDivElement */
let currentPage = projectsPage;

let pages = [
  projectsPage,
  aboutPage,
  searchResultsPage,
]

function setPage(/** @type HTMLDivElement */ page) {
  if(state.isOrientationPortrait) {
    toggleNavlinks(false)
  }

  if(page === currentPage) return

  currentPage = page
  pages.forEach(p => p.classList.add("hidden"))
  page.classList.remove("hidden")


  if(page === projectsPage) {
    document.body.scrollTo({top: 0, behavior: "auto"})
    document.body.style.overflowY = "hidden"
  }
  if(page === aboutPage) {
    document.body.style.overflowY = ""
  }

  if(page === searchResultsPage) {
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

function toggleNavlinks(/** @type Boolean */ value) {
  if(value === true) {
    currentPage.classList.add("hidden")
    navbarButtonCell.classList.remove("hidden")
    // hamburger.classList.remove("selected")
  }
  else if(value === false) {
    currentPage.classList.remove("hidden")
    navbarButtonCell.classList.add("hidden")
    // hamburger.classList.add("selected")
  }
  else if(value === undefined) {
    currentPage.classList.toggle("hidden")
    navbarButtonCell.classList.toggle("hidden")
    // hamburger.classList.toggle("selected")
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
  if(state.isOrientationPortrait) {
    Q(".project-type-switch").classList.add("hidden")
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

  if(event.code === "Tab" && document.activeElement == Q("#search-bar input")) {
    Search.hideSearchBar()
  }
  
  if(event.code === "Tab" && document.activeElement == Q("#search-bar input")) {
    Search.hideSearchBar()
  }

  if((event.code === "Enter" || event.code === "NumpadEnter" || event.keyCode === 13) && document.activeElement == Q("#search-bar input")) {
    Search.search(Q("#search-bar-input").value)
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

document.addEventListener("click", (event) => {

  /* Execute search when clicking on the search icon while the searchbar is open */
  if(event.target.closest(".search-bar-icon") && Search.searchBarVisible) {
    Search.search(Q("#search-bar-input").value)
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
  let searchQuery = window.location.search.replace("?", "")
  let pairs = searchQuery.split("+")
  pairs.forEach(pair => {
    let [key, value] = pair.split("=")
    
    switch(key) {
      case "tag": {
        Project.showByTags(value)
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
      case "page": {
        switch(value) {
          case "projects": {
            setPage(projectsPage)
            break
          }
          case "about": {
            setPage(aboutPage)
            break
          }
        }
        break
      }
      case "carouselindex": {
        for(let i = 0; i < value; i++)
        Project.current?.showNextImage()
        break
      }
    }
  })
}
window.onload = init
