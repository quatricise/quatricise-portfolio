let hamburger = document.querySelector(".hamburger")

let checkbox = Q('#dayNightCheckbox')
let background = Q('#background')

let lightboxFull = Q('#lightboxFull')
let lightboxFullImage = Q('#lightboxFullImage')
let lightboxDescription = Q('#lightbox-description')
let lightboxTitle = Q('#lightbox-title')

let lightboxAlbum = Q('#lightbox-album')
let lightboxAlbumImage = Q('#lightbox-album--image')

let audioPlayerColor = document.getElementsByClassName('fas')
let playlistTrackInfo = Qa('.audio-track-title')
let playlistTrackDuration = Qa('.playlist-duration')
let navbarButtons = Qa('.navbar-button')
let navbarButtonCell = Q('.buttonCell')
let dayNightSwitchText = document.querySelector('.brightness-mode-switch-text')
let logoHolder = document.querySelector('.logo-holder')
let aboutParagraph = document.querySelector('.aboutParagraph')
let daytime = "dark";
let daytimeCheck = Q('#daytime-check')
let playerTimer = document.querySelector('.timer')
let playerTitle = document.querySelector('.title')
let playerDuration = document.querySelector('.duration')
let buttonAction = Qa('.btn-action')
let navMusicLinks = document.querySelector('.navbar--music-links')
let musicIcons = Qa('.navbar--music-links a')
let albumDescription = Q('#album-description')
let myProgress = Q('#myProgress')
let myBarCircle = Q('#myBarCircle')
let preloader = document.querySelector('.preloader')

let projectsPage = Q('#projects-page');
let projectsPageWrapper = Q('#projects-page-content');
let aboutPage = Q('#aboutPage');
let searchResultsPage = Q('#search-results-page');
let currentPage = projectsPage;

let pages = [
  projectsPage,
  aboutPage,
  searchResultsPage,
]
function setPage(page) {
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

let isLoaded = false //probably refers to lightbox

function checkCheckbox(check) {
  checkbox.checked = check;
}
function toggleCheckbox() {
  checkbox.checked ? changeToDark() : changeToBright()
}

function toggleNavlinks() {
  currentPage.classList.toggle("hidden")
  navbarButtonCell.classList.toggle("hidden")
  hamburger.classList.toggle("selected")
}

hamburger.onclick = () => {
  toggleNavlinks()
}

lightboxFull.addEventListener('click', function(event) {
  event.preventDefault();
})

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

document.addEventListener('DOMContentLoaded', function () {
  checkbox.addEventListener('change', () => checkbox.checked ? changeToBright() : changeToDark())
  checkBrowserMode();
});

function checkBrowserMode() {
  window.matchMedia('(prefers-color-scheme: dark)').matches ? changeToDark() : changeToBright()
}

function changeToBright() {
  checkbox.checked = true
  daytimeCheck.style.backgroundColor = 'white'
  daytime = "bright";
  //set background to be reflective of current album
  background.classList.remove('background-dark');
  Qa(".music-background-image").forEach(img => img.classList.remove("hidden"))
  
  aboutParagraph.classList.add('color-night--white')
  playerTimer.classList.add('color-night--white')
  playerTitle.classList.add('color-night--white')
  playerDuration.classList.add('color-night--white')
  myProgress.classList.add('bg-color--white05')
  myProgress.classList.remove('bg-color--purple-bright04')
  
  dayNightSwitchText.classList.add('color-night--white')
  dayNightSwitchText.innerText = "DARK MODE"

  logoHolder.classList.add('backgroundLogoWhite')
  logoHolder.classList.remove('background-logo-thin')

  playlistTrackInfo = Qa('.audio-track-title')
  playlistTrackDuration = Qa('.playlist-duration')

  for(var i = 0; i < navbarButtons.length; i++) {
    navbarButtons[i].classList.add('color-night--white');
  }
  for(var i = 0; i < audioPlayerColor.length; i++) {
    audioPlayerColor[i].classList.add('color-night--white');
  };
  for(var i = 0; i < playlistTrackInfo.length; i++) {
    playlistTrackInfo[i].classList.add('color-night--white08');
  }
  for(var i = 0; i < playlistTrackDuration.length; i++) {
    playlistTrackDuration[i].classList.add('color-night--white08');
  }
  for(var i = 0; i < buttonAction.length; i++) {
    buttonAction[i].classList.add('hover-bright');
    buttonAction[i].classList.remove('hover-dark');
  }
  for(var i = 0; i < musicIcons.length; i++) {
    musicIcons[i].classList.add('color-night--whitegray');
  }
}

function changeToDark() {
  checkbox.checked = false
  daytimeCheck.style.backgroundColor = 'black'
  daytime = "dark"
  //set background to dark always
  background.classList.add('background-dark')
  Qa(".music-background-image").forEach(img => img.classList.add("hidden"))
  aboutParagraph.classList.remove('color-night--white')
  playerTimer.classList.remove('color-night--white')
  playerTitle.classList.remove('color-night--white')
  playerDuration.classList.remove('color-night--white')
  myProgress.classList.remove('bg-color--white05')
  myProgress.classList.add('bg-color--purple-bright04')

  dayNightSwitchText.classList.remove('color-night--white')
  dayNightSwitchText.innerText = "LIGHT MODE"
  logoHolder.classList.add('background-logo-thin')
  logoHolder.classList.remove('backgroundLogoWhite')
  
  playlistTrackInfo = Qa('.audio-track-title')
  playlistTrackDuration = Qa('.playlist-duration')
  
  for(var i = 0; i < navbarButtons.length; i++) {
    navbarButtons[i].classList.remove('color-night--white')
  }
  for(var i = 0; i < audioPlayerColor.length; i++) {
    audioPlayerColor[i].classList.remove('color-night--white')
  }
  for(var i = 0; i < playlistTrackInfo.length; i++) {
    playlistTrackInfo[i].classList.remove('color-night--white08','color-night--white');
  }
  for(var i = 0; i < playlistTrackDuration.length; i++) {
    playlistTrackDuration[i].classList.remove('color-night--white08','color-night--white');
  }
  for(var i = 0; i < buttonAction.length; i++) {
    buttonAction[i].classList.add('hover-dark');
    buttonAction[i].classList.remove('hover-bright');
  }
  for(var i = 0; i < musicIcons.length; i++) {
    musicIcons[i].classList.remove('color-night--whitegray');
  }
}

function openLightboxFull() {
  lightboxFull.classList.remove('opacity-zero', 'z-index-minus100');
  lightboxFull.style.pointerEvents = 'initial';
  lightboxFullImage.classList.remove('pointerEventsNoneBlock');
  lightboxFull.classList.remove('hidden');
  lightboxFull.scrollTo(0,0);
}

function closeLightboxFull() {
  lightboxFull.classList.add('opacity-zero', 'z-index-minus100');
  lightboxFull.style.pointerEvents = 'none';
  lightboxFullImage.classList.add('pointerEventsNoneBlock');
  setTimeout(function () {lightboxFull.classList.add('hidden')}, 1000);
}

function openLightboxAlbum() {
  lightboxAlbum.classList.remove('opacity-zero', 'z-index-minus100', 'hidden');
  lightboxAlbum.classList.add('z-index-100000');
  lightboxAlbum.style.pointerEvents = 'initial';
  lightboxAlbumImage.classList.remove('pointerEventsNoneBlock');
  lightboxAlbum.scrollTo(0,0);
}

function closeLightboxAlbum() {
  lightboxAlbum.classList.add('opacity-zero', 'z-index-minus100');
  lightboxAlbum.style.pointerEvents = 'none';
  lightboxAlbumImage.classList.add('pointerEventsNoneBlock');
  setTimeout(function () {lightboxAlbum.classList.add('hidden');lightboxAlbum.classList.remove('z-index-100000');}, 1000);
}

var artwork = Qa('.artwork');
var allDescriptions = Qa('.artwork-description');
var allTitles = Qa('.artwork-title-card');
var lightboxImageNumber = null;
for (var i = 0; i < artwork.length; i++) {
  let ind = i + "";
  artwork[i].onclick = function () {
    lightboxImageNumber = ind 
    lightboxFullImage.srcset = this.getAttribute("data-srcset2")
    openLightboxFull()
    lightboxDescription.innerHTML = allDescriptions[ind].innerHTML
    lightboxTitle.innerHTML = allTitles[ind].innerHTML
  };
};

const targetNode = lightboxFullImage
const observeSrcset = {
  childList: false,
  attributes: true,
  subtree: false,
  attributeFilter: ["srcset"]
}

const srcsetObserver = new MutationObserver(animateCircle);
srcsetObserver.observe(targetNode, observeSrcset);

lightboxFullImage.onload = function () {
  isLoaded = true
  this.classList.remove('opacity-zero')
  circleLoading.classList.remove('spinning')
  circleLoading.classList.add('hidden')
}

if(lightboxFull) 
  lightboxFull.onclick = closeLightboxFull;
if(lightboxAlbum) 
  lightboxAlbum.onclick = closeLightboxAlbum;

let albums = [
  "ancient-cycles",
  "metal-valley",
  "flowerized",
  "midnight-bowling"
]

function createAlbumCover(albumName) {
  let cont = El("div", "cover-container" + " " + albumName)
  let strip = El("div", "cover-strip cover-strip--metal-valley")
  let icon_cont = El("div", "cell--icon-search")
  let icon = El.image("images/icon_search__lightgray.png")
  let img = El.image("images/album_covers/") // inconsistent naming of files, this can't work
  icon_cont.append(icon)
  cont.append(icon_cont, strip)
}

for (let i = 0; i < albums.length; i++) {
  createAlbumCover(albums[i])
}

function setDaytimeForTracks() {
    var fas = Qa('.fas');
    var infotrack = Qa('.audio-track-title')
    var duration = Qa('.playlist-duration')

    if(daytime == "bright") {
      console.log("Changed track color to reflect bright mode")

      for(var i = 0; i < fas.length; i++) {
        fas[i].classList.add('color-night--white')
      }
      for(var i = 0; i < infotrack.length; i++) {
        infotrack[i].classList.add('color-night--white')
      }
      for(var i = 0; i < duration.length; i++) {
        duration[i].classList.add('color-night--white')
      }
    }  
}

let descriptionExpandState = "closed";

function hideSplash() {
  var splash = document.querySelector('.splash-screen')
  splash.classList.add('opacity-zero', 'slide-up', 'pointerEventsNoneBlock')
  setTimeout(() => {
    splash.classList.add('z-index-minus100');splash.classList.remove('z-index-100');splash.classList.remove('display-flex');splash.classList.add('hidden')}
  ,1100)
}
function slideMusicFromBottom () {
  projectsPage.classList.remove('slide-from-bottom');
  console.log('Music slid from bottom.')
}
function enlargeAlbumCover(albumName) {
  openLightboxAlbum();
  lightboxAlbumImage.srcset = document.querySelector(albumName).getAttribute("data-srcset");
}
function updateLightboxImage() {
  lightboxFullImage.srcset = artwork[lightboxImageNumber].dataset.srcset2 
  lightboxDescription.innerHTML = allDescriptions[lightboxImageNumber].innerHTML
  lightboxTitle.innerHTML = allTitles[lightboxImageNumber].innerHTML

  setTimeout(() => {
    if(!isLoaded)
      lightboxFullImage.classList.add('opacity-zero')
  }, 50)
}
function getNextImage() {
  if(lightboxImageNumber < (artwork.length - 1)) 
    lightboxImageNumber++;
  else 
  if(lightboxImageNumber == (artwork.length - 1)) 
    lightboxImageNumber = 0

  updateLightboxImage()
}
function getPrevImage() {
  if(lightboxImageNumber > 0) 
    lightboxImageNumber--
  else 
  if(lightboxImageNumber == 0) 
    lightboxImageNumber = artwork.length - 1

  updateLightboxImage()
}

let circleLoading = document.querySelector('.circle-loading')

function animateCircle() {
  isLoaded = false
  circleLoading.classList.add('spinning')
  circleLoading.classList.remove('hidden')
}

document.addEventListener("keydown", (event) => {
  if(lightboxFull.style.opacity !== '0') {
    if(event.code  === "ArrowLeft") {
      Project.current?.showPreviousImage()
    } 
    if(event.code === "ArrowRight") {
      Project.current?.showNextImage()
    } 
    if(event.code === "ArrowUp") {
      lightboxFull.scrollTo(0,0);
    } 
    if(event.code === "ArrowDown") {
      lightboxFull.scrollTo(0,500);
    } 
    if(event.code === "Escape") {
      closeLightboxFull()
    }
  }
  if(event.code === "Escape") {
    Search.hideSearchBar()
    Search.hideResults()
    Project.hideDetail()
  }
  if(event.code === "Tab" && document.activeElement == Q("#search-bar input")) {
    Search.hideSearchBar()
  }
  if((event.code === "Enter" || event.code === "NumpadEnter") && document.activeElement == Q("#search-bar input")) {
    Search.search(Q("#search-bar-input").value)
  }
});

Q("#search-bar").onfocus = () => Search.showSearchBar()
Q("#search-bar input").onblur = () => {
  Search.hideSearchBar()
}
Q("#background").onclick = () => Project.hideDetail()

function init() {
  Project.init()

  for(let key in projects)
    new Project(key)

  let searchQuery = window.location.search.replace("?", "")
  let pairs = searchQuery.split("+")
  pairs.forEach(pair => {
    let [key, value] = pair.split("=")
    
    switch(key) {
      case "tag": {
        Project.showByTags(value)
        break
      }
    }
  })
}

/** Animation of arrows in the project detail */
let arrowAnimation = null

/* project detail arrow hiding */
Q("#project-detail-artwork-side").onmouseleave = () => {

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
Q("#project-detail-artwork-side").onmouseenter = () => {
  arrowAnimation?.cancel()
  Q("#project-detail-image-arrows").style.filter = ""
}


window.onload = init
