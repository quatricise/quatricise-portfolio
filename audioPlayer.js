// class AudioPlayer {
//   static currentTrackIndex = 0
//   static createHTML() {
//     let
//     playlist = document.createElement("div")
//     playlist.classList.add("audio-playlist")
//   }
//   static createTrackHTML(src) {
//     let
//     track = document.createElement("div")
//     track.classList.add("audio-track")

//     let
//     trackTitle = document.createElement("div")
//     trackTitle.classList.add("audio-track-title")

//     let
//     trackDuration = document.createElement("div")
//     trackDuration.classList.add("audio-track-duration")

//     let
//     icon = document.createElement("div")
//     icon.classList.add("audio-track-play-state-icon")

//     track.append(icon, trackTitle, trackDuration)
//   }
//   static loadTracks(/** @type string[] */ sources) {
//     sources.forEach(src => {
//       this.createTrackHTML(src)
//     })
//   }
//   static revertPlay() {
//     document.querySelector('.fa-play').style.display = 'block';
//     document.querySelector('.fa-pause').style.display = 'none';
//     document.getElementById('myBar').style.width = '0%';
//     document.getElementById('myBarCircle').style.left = '0%';
//   }
//   static playTrack(index) {
//     this.tracks[index].play()
//   }
//   static nextTrack() {
//     this.currentTrackIndex++
//     this.tracks[this.currentTrackIndex].play()
//   }
// }

class AudioPlayer {
  /** @type Map<String, Array> - */
  static lists = new Map()
  static currentTracklist = new Set()
  static currentTrackIndex = 0

  /** This function loads a tracklist and then creates the HTML and appends it to the proper UI container. */
  static loadTracklist(projectIdentifier, content) {
    const trackContainer = El("div", "audio-track-container")
    Q("#project-detail-text-side").append(trackContainer)

    content.src.forEach(source => {
      let audio = new Audio(`projects/${projectIdentifier}/${source.filename}.mp3`)
      let item = this.createTrackItem(source.title ?? source.filename)
      trackContainer.append(item)

      audio.onloadedmetadata = () => {
        item.querySelector(".audio-track-duration").innerText = this.secondsToMinutes(audio.duration)
      }
    })
  }

  static createTrackItem(title) {
    let
    container = El("div", "audio-track", [], )

    let
    icon = El("div", "audio-track-play-state-icon", [], )

    let
    trackTitle = El("div", "audio-track-title", [], title)

    let
    trackDuration = El("div", "audio-track-duration", [], )

    container.append(icon, trackTitle, trackDuration)
    return container
  }

  static play() {

  }

  static pause() {

  }

  /** @returns String */
  static secondsToMinutes(time) {
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
}