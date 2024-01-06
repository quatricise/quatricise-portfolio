class AudioPlayer {
  /** @type Map<String, Array> */
  static tracklists = new Map()

  /** @type AudioTrack[] */
  static currentTracklist = []

  /** @type Map<String, HTMLElement> */
  static elements = new Map()

  /** @type Number */
  static collapseTimer = 0

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
    let playheadGhost = El("div", "audio-player-playhead ghost hidden")

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

    track.append(trackNumber, trackName, progressBar, playhead, playheadGhost)

    /* Controls: prev, play/pause, next, volume */
    let controls =      El("div",     "audio-player-controls")
    let prevButton =    El("button",  "audio-player-button previous-track")
    let nextButton =    El("button",  "audio-player-button next-track")
    let playButton =    El("button",  "audio-player-button play paused")
    let volumeButton =  El("button",  "audio-player-button volume")

    controls.append(prevButton, playButton, nextButton, volumeButton)

    /* separate close button that stops audio and hides the player. */
    let closeButton =   El("div", "audio-player-close-button")

    container.append(cover, track, controls, closeButton)
    document.body.append(container)

    this.elements.set("container", container)
    this.elements.set("controls", controls)
    this.elements.set("cover", cover)
    this.elements.set("prevButton", prevButton)
    this.elements.set("nextButton", nextButton)
    this.elements.set("playButton", playButton)
    this.elements.set("closeButton", closeButton)
    this.elements.set("progressBar", progressBar)
    this.elements.set("playhead", playhead)
    this.elements.set("playheadGhost", playheadGhost)
    this.elements.set("track", track)
    this.elements.set("trackName", trackName)
    this.elements.set("trackNumber", trackNumber)

    container.projectIdentifier = project.projectIdentifier



    /* functionality */

    /* auto-collapsing */
    container.onmouseleave = () => {
      this.collapseTimer = setTimeout(() => {
        this.collapseHTML()
      }, 2500)
    }
    container.onmouseover = () => {
      window.clearTimeout(this.collapseTimer)
      this.expandHTML()
    }

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

    closeButton.onclick = () => {
      this.close()
    }

    track.onclick = () => {
      /* calculate mouse offset */
      let bb = track.getBoundingClientRect()
      let offsetPX = Mouse.clientPosition.x - bb.left
      let offsetFactor = (offsetPX / bb.width)

      AudioTrack.current.audio.currentTime = AudioTrack.current.audio.duration * offsetFactor
    }

    track.onmousemove = () => {
      /* calculate mouse offset */
      let bb = track.getBoundingClientRect()
      let offsetPX = Mouse.clientPosition.x - bb.left
      let offsetFactor = (offsetPX / bb.width)

      playheadGhost.style.left = (offsetFactor * 100) + "%"
      playheadGhost.classList.remove("hidden")
    }
    track.onmouseout = () => {
      playheadGhost.classList.add("hidden")
    }

    cover.onclick = () => Project.showDetail()
  }

  /** This method updates the player element, according to the current track being played. */
  static updateHTML() {
    let offset = (AudioTrack.current.audio.currentTime / AudioTrack.current.audio.duration) * 100 + "%"
    this.elements.get("progressBar").style.width = offset
    this.elements.get("playhead").style.left = offset
  }

  static collapseHTML() {
    this.elements.get("container").classList.add("collapsed")
    this.elements.get("track").classList.add("collapsed")
    
    this.elements.get("closeButton").classList.add("hidden")
    this.elements.get("controls").classList.add("hidden")
    this.elements.get("cover").classList.add("hidden")
    this.elements.get("trackName").classList.add("hidden")
    this.elements.get("trackNumber").classList.add("hidden")

    this.elements.get("playheadGhost").classList.add("hidden")
  }

  /** This function assumes that all elements that have class "hidden" and "collapsed" will have those classes removed. */
  static expandHTML() {
    let container = this.elements.get("container")
    container.classList.remove("collapsed", "hidden")
    let elements = container.querySelectorAll(".collapsed, .hidden")
    Array.from(elements).forEach(e => e.classList.remove("collapsed", "hidden"))

    this.elements.get("playheadGhost").classList.add("hidden")
  }

  static close() {
    this.elements.get("container").remove()
    AudioTrack.current?.stop()
  }
}