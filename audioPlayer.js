class AudioPlayer {
  /** @type Map<String, Array> */
  static tracklists = new Map()

  /** @type AudioTrack[] */
  static currentTracklist = []

  /** @type Map<String, HTMLElement> */
  static elements = new Map()

  /** This function loads a tracklist and then creates the HTML and appends it to the proper UI container. */
  static loadTracklist(/** @type Project */ project, content) {
    const trackContainer = El("div", "audio-track-container")
    Q("#project-detail-text-side").append(trackContainer)

    const tracks = []
    content.src.forEach((source, index) => {
      let track = new AudioTrack(project, source, index)
      trackContainer.append(track.item)
      tracks.push(track)
    })

    /* set a tracklist into the list map */
    this.tracklists.set(project.projectIdentifier, tracks)

    this.currentTracklist = tracks
  }

  static playNext() {
    let index = AudioTrack.current?.index
    this.currentTracklist[index + 1]?.play()
  }

  static playPrevious() {
    let index = AudioTrack.current?.index
    this.currentTracklist[index - 1]?.play()
  }

  static createHTML(/** @type Project */ project) {
    let container =     El("div", "audio-player", [["id", "audio-player"]])
    let cover =         El("img", "audio-player-cover", [["src", "projects/jumpout/cover.jpg"]])
    let track =         El("div", "audio-player-track")
    let trackName =     El("div", "audio-player-track-name", [], AudioTrack.current.title)
    let trackNumber =   El("div", "audio-player-track-number")
    let progressBar =   El("div", "audio-player-progress-bar")
    let playhead =      El("div", "audio-player-playhead")

    /* create the visual index with the double digits */
    let index = AudioTrack.current.index + 1
    let indexText = ""
    if(index < 10) {
      indexText = "0" + index + ":"
    }
    else {
      indexText = index + ":"
    }
    trackNumber.innerText = indexText

    track.append(trackNumber, trackName, progressBar, playhead)

    /* Controls: prev, play/pause, next, volume */
    let controls =      El("div",     "audio-player-controls")
    let prevButton =    El("button",  "audio-player-button previous-track")
    let nextButton =    El("button",  "audio-player-button next-track")
    let playButton =    El("button",  "audio-player-button play paused")
    let volumeButton =  El("button",  "audio-player-button volume")

    controls.append(prevButton, playButton, nextButton, volumeButton)

    /* separate-looking close button that stops audio and hides the player. */
    let closeButton =   El("div", "audio-player-close-button")

    container.append(cover, track, controls, closeButton)
    document.body.append(container)

    this.elements.set("container", container)
    this.elements.set("controls", controls)
    this.elements.set("prevButton", prevButton)
    this.elements.set("nextButton", nextButton)
    this.elements.set("playButton", playButton)
    this.elements.set("progressBar", progressBar)
    this.elements.set("playhead", playhead)

    container.projectIdentifier = project.projectIdentifier



    /* functionality */

    playButton.onclick = () => {
      AudioTrack.current.toggle()
      playButton.classList.toggle("paused")
    }

    nextButton.onclick = () => this.playNext()

    prevButton.onclick = () => this.playPrevious()

    volumeButton.onclick = () => {
      AudioTrack.current.audio.volume == 0 ? AudioTrack.current.audio.volume = 1 : AudioTrack.current.audio.volume = 0
      volumeButton.classList.toggle("muted")
    }

    track.onclick = () => {
      let bb = track.getBoundingClientRect()
      let offsetPX = Mouse.clientPosition.x - bb.left
      let offsetFactor = (offsetPX / bb.width)
      
      /* set duration according to percentage offset */
      AudioTrack.current.audio.currentTime = AudioTrack.current.audio.duration * offsetFactor
    }

    cover.onclick = () => Project.showDetail()
  }

  /** This method updates the player element, according to the current track being played. */
  static updateHTML() {
    let offset = (AudioTrack.current.audio.currentTime / AudioTrack.current.audio.duration) * 100 + "%"
    this.elements.get("progressBar").style.width = offset
    this.elements.get("playhead").style.left = offset
  }

  /** @type HTMLDivElement */
  static element = null
}