//#region audio player core logic
var timer = document.getElementsByClassName('timer')[0]
var barProgress = document.getElementById("myBar");
var isSeeking = false;
var progressbar = document.querySelector('#my-progress-hitbox') 
var volumeBar = document.querySelector('#volume-bar');
var volSliderInner = document.querySelector('#volume-bar--inner');
var volumeCircle = document.querySelector('#volumeCircle');
var isAdjustingVolume = false;
var currentAudio = document.getElementById("active-audio-element");
var interval1
var playListItems = document.querySelectorAll(".playlist-track-ctn");
var indexAudio = 0;
let currentAudioName

volumeBar.addEventListener('mousedown', function () {
  if(isAdjustingVolume) return

  isAdjustingVolume = true
})
progressbar.addEventListener("mousedown", function () {
  if(isSeeking) return

  isSeeking = true
})

volumeBar.addEventListener('mouseup', adjustVolume.bind(this))
volumeBar.addEventListener('mousemove', adjustVolumeDrag.bind(this))
document.addEventListener('mouseup', seek.bind(this))
progressbar.addEventListener("mousemove", seekDrag.bind(this)) // this part listens for clicking on the progress bar

function loadAudio(data) {
  let folder = data.folder
  data.items.forEach(item => {
    let 
    audio = new Audio()
    audio.src = folder + item.filename
    item.filename.replaceAll("_", " ").cap()
  })
}
function toggleAudio() {
  if(this.currentAudio.paused) {
    document.querySelector('#icon-play').style.display = 'none';
    document.querySelector('#icon-pause').style.display = 'block';
    document.querySelector('#ptc-'+this.indexAudio).classList.add("active-track");
    this.playToPause(this.indexAudio);
    this.currentAudio.play();
  } else {
    document.querySelector('#icon-play').style.display = 'block';
    document.querySelector('#icon-pause').style.display = 'none';
    this.pauseToPlay(this.indexAudio);
    this.currentAudio.pause();
  }
}
function pauseAudio() {
  this.currentAudio.pause();
  clearInterval(interval1);
}
function onTimeUpdate() {
  var t = this.currentAudio.currentTime
  timer.innerHTML = this.getMinutes(t)
  this.setBarProgress()
  if(this.currentAudio.ended) {
    document.querySelector('#icon-play').style.display = 'block'
    document.querySelector('#icon-pause').style.display = 'none'
    this.pauseToPlay(this.indexAudio)
    if(this.indexAudio < currentListAudio.tracks.length - 1) {
      var index = this.indexAudio + 1
      this.loadNewTrack(index)
    }
  }
}
function setBarProgress() {
  var progress = ( this.currentAudio.currentTime / this.currentAudio.duration ) * 100
  document.getElementById("myBar").style.width = progress + "%"
  document.getElementById('myBarCircle').style.left = progress + "%"
}
function getMinutes(time) {
  var min = parseInt(parseInt(time) / 60);
  var sec = parseInt(time % 60);
  if (sec < 10) {
    sec = "0"+ sec
  }
  if (min < 10) {
    min = "0"+ min
  }
  return min + ":" + sec
}
function seek(event) { // this part sets the currentTime to the mouse target, or something
  if(isSeeking == false) return

  var percent = event.offsetX / progressbar.offsetWidth;
  this.currentAudio.currentTime = percent * this.currentAudio.duration;
  barProgress.style.width = percent*100 + "%";
  isSeeking = false;
}
function seekDrag(event) { // this part sets the currentTime to the mouse target, or something
  if(isSeeking == false) return

  var percent = event.offsetX / progressbar.offsetWidth
  this.currentAudio.currentTime = percent * this.currentAudio.duration
  barProgress.style.width = percent * 100 + "%"
}
function adjustVolume (event) {
  if(!isAdjustingVolume) return

  var percent = event.offsetX / volumeBar.offsetWidth
  this.currentAudio.volume = percent
  volSliderInner.style.width = percent * 100 + "%"
  isAdjustingVolume = false
}
function adjustVolumeDrag (event) {
  if (isAdjustingVolume == false) return

  var percent = event.offsetX / volumeBar.offsetWidth
  this.currentAudio.volume = percent
  volSliderInner.style.width = percent * 100 + "%"
}
function forward() {
  this.currentAudio.currentTime += 5
  this.setBarProgress();
}
function rewind() {
  this.currentAudio.currentTime -= 5
  this.setBarProgress();
}
function next() {
  if(this.indexAudio >= currentListAudio.length - 1) return
  
  var oldIndex = this.indexAudio
  this.indexAudio++
  updatePlaylistCSS(oldIndex, this.indexAudio)
  this.loadNewTrack(this.indexAudio)
}
function previous() {
  if(this.indexAudio <= 0) return

  var oldIndex = this.indexAudio
  this.indexAudio--
  updatePlaylistCSS(oldIndex,this.indexAudio)
  this.loadNewTrack(this.indexAudio)
}
function updatePlaylistCSS(oldIndex, newIndex){
  document.querySelector('#ptc-'+oldIndex).classList.remove("active-track");
  this.pauseToPlay(oldIndex);
  document.querySelector('#ptc-'+newIndex).classList.add("active-track");
  this.playToPause(newIndex)
}
function playToPause(index) {
  var element = document.querySelector('#p-img-'+index)
  element.classList.remove("fa-play");
  element.classList.add("fa-pause");
}
function pauseToPlay(index) {
  var element = document.querySelector('#p-img-' + index)
  element.classList.remove("fa-pause");
  element.classList.add("fa-play");
}
function toggleMute() {
  var btnMute = document.querySelector('#volume-slider');
  var volUp = document.querySelector('#icon-vol');
  var volMute = document.querySelector('#icon-vol-mute');
  if(this.currentAudio.muted == false) {
     this.currentAudio.muted = true
     volUp.style.display = "none"
     volMute.style.display = "block"
  }
  else
  {
    this.currentAudio.muted = false
    volMute.style.display = "none"
    volUp.style.display = "block"
  }
}
function createTrackItem(index, name, duration) {
  let
  trackItem = document.createElement('div');
  trackItem.setAttribute("class", "playlist-track-ctn");
  trackItem.setAttribute("id", "ptc-"+index);
  trackItem.setAttribute("data-index", index);
  document.querySelector("#project-detail-tracklist").appendChild(trackItem);

  let
  playBtnItem = document.createElement('div');
  playBtnItem.setAttribute("class", "playlist-btn-play");
  playBtnItem.setAttribute("id", "pbp-"+index);
  document.querySelector("#ptc-"+index).appendChild(playBtnItem);

  let
  btnImg = document.createElement('i');
  btnImg.setAttribute("class", "fas fa-play");
  btnImg.setAttribute("height", "40");
  btnImg.setAttribute("width", "40");
  btnImg.setAttribute("id", "p-img-"+index);
  document.querySelector("#pbp-"+index).appendChild(btnImg);

  let
  trackInfoItem = document.createElement('div');
  trackInfoItem.setAttribute("class", "audio-track-title");
  trackInfoItem.innerHTML = name
  document.querySelector("#ptc-"+index).appendChild(trackInfoItem);

  let
  trackDurationItem = document.createElement('div');
  trackDurationItem.setAttribute("class", "playlist-duration");
  trackDurationItem.innerHTML = duration || ""
  document.querySelector("#ptc-"+index).appendChild(trackDurationItem);
}
function loadNewTrack(index) {
  var player = document.querySelector('#source-audio')
  player.src = getAudioFileURL(currentAudioName, index)
  document.querySelector('.title').innerHTML = currentListAudio.tracks[index]
  this.currentAudio = document.getElementById("active-audio-element");
  this.currentAudio.load()
  this.toggleAudio()
  this.updatePlaylistCSS(this.indexAudio, index)
  this.indexAudio = index;
}
function getClickedElement(event) {
  for (let i = 0; i < playListItems.length; i++){
    if(playListItems[i] == event.target){
      var clickedIndex = event.target.getAttribute("data-index")
      if (clickedIndex == this.indexAudio )
        this.toggleAudio()
      else
        loadNewTrack(clickedIndex);
    }
  }
}

function getDuration() {
  document.querySelectorAll('.duration')[0].innerHTML = this.getMinutes(this.currentAudio.duration)
}

function getAudioFileURL(albumName, trackIndex) {
  return "projectData/music/" + albumName + "/tracks/" + projects.music[albumName].tracks[trackIndex] + ".mp3"
}

function refreshAudioPlayer(audioData) {
  currentListAudio = audioData
  currentAudioName = audioName
  document.querySelector('#project-detail-tracklist').innerHTML = ''
  for (var i = 0; i < audioData.src.length; i++) {
    createTrackItem(i, audioData.src[i], audioData.src[i].duration)
  }
  playListItems = document.querySelectorAll(".playlist-track-ctn")
  for (let i = 0; i < playListItems.length; i++){
    playListItems[i].addEventListener("click", getClickedElement.bind(this))
  }
  document.querySelector('#source-audio').src = getAudioFileURL(audioName, 0)
  document.querySelector('.title').innerHTML = "01: " + audioData.src[0]
  currentAudio.load()
  currentAudio.onloadedmetadata = getDuration.bind(this)
}

function revertPlay() {
  document.querySelector('.fa-play').style.display = 'block';
  document.querySelector('.fa-pause').style.display = 'none';
  document.getElementById('myBar').style.width = '0%';
  document.getElementById('myBarCircle').style.left = '0%';
}
//#endregion

//preload the first list audio thingy, this is so garbage
window.addEventListener('load', function () {
  document.querySelector('.myBarColor').style.backgroundColor = '#ee6767'
})