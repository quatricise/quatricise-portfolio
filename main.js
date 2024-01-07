let hamburger = document.querySelector(".hamburger")
let checkbox = Q('#dayNightCheckbox')
let background = Q('#background')

let navbarButtons = Qa('.navbar-button')
let navbarButtonCell = Q('.buttonCell')
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
  if(page === currentPage) return

  currentPage = page
  pages.forEach(p => p.classList.add("hidden"))
  page.classList.remove("hidden")

  if(window.innerHeight >= window.innerWidth)
    hamburger.click()

  if(page === projectsPage) {
    logoHolder.classList.replace("background-logo-thin", "backgroundLogoWhite")
    background.classList.remove('desaturated');
  }
  if(page === aboutPage) {
    background.classList.add('desaturated');
    if(daytime == "dark") {
      logoHolder.classList.replace("background-logo-thin", "backgroundLogoWhite")
    }
  }
}

function toggleNavlinks() {
  currentPage.classList.toggle("hidden")
  navbarButtonCell.classList.toggle("hidden")
  hamburger.classList.toggle("selected")
}

hamburger.onclick = () => toggleNavlinks()

function quitPreloader() {
  preloader.classList.add('opacity-zero');
  setTimeout(() => preloader.classList.add('hidden'), 1000)
}

window.addEventListener('load', () => {
  if(window.innerHeight <= window.innerWidth) {
    navbarButtonCell.classList.remove("hidden")
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

  if((event.code === "Enter" || event.code === "NumpadEnter") && document.activeElement == Q("#search-bar input")) {
    Search.search(Q("#search-bar-input").value)
  }
  if((event.code === "Enter" || event.code === "NumpadEnter") && document.activeElement.classList.contains("project-thumbnail")) {
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



function init() {
  Project.init()

  for(let key in projects)
    new Project(key)

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
      case "carouselindex": {
        for(let i = 0; i < value; i++)
        Project.current?.showNextImage()
        break
      }
    }
  })
}
window.onload = init
