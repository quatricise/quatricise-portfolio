class AudioPlayer {

  /** @type Map<String, Array> */
  static tracklists = new Map()

  /** @type AudioTrack[] */
  static currentTracklist = []

  /** @type Project */
  static currentProject = null

  /** @type Map<String, HTMLElement> */
  static elements = new Map()

  /** @type Number */
  static collapseTimer = 0

  /** @type Boolean */
  static generatedHTML = false

  /** This function loads a tracklist and then creates the HTML and appends it to the proper UI container. */
  static loadTracklist(/** @type Project */ project, content) {
    
    /* Create a new track container element */
    const trackContainer = El("div", "audio-track-container")
    Q("#project-detail-text-side").append(trackContainer)

    /** @type AudioTrack[] */
    const tracks = []
    
    content.src.forEach((source, index) => {
      let track = new AudioTrack(project, source, index)
      trackContainer.append(track.elements.get("container"))

      /* append description in case it was */
      if(track.elements.has("trackDescription")) {
        trackContainer.append(track.elements.get("trackDescription"))
      }

      tracks.push(track)
    })

    /* set a tracklist into the list map */
    this.tracklists.set(project.projectIdentifier, tracks)
  }

  static setCurrentTracklist(/** @type string */ projectIdentifier) {
    if(projectIdentifier) {
      this.currentTracklist = this.tracklists.get(projectIdentifier)
      this.currentProject = Array.from(Project.list).find(p => p.projectIdentifier === projectIdentifier)
    }
    else {
      this.currentTracklist = this.tracklists.get(Project.current.projectIdentifier)
      this.currentProject = Project.current
    }
  }

  static playNext() {
    let index = AudioTrack.current?.index
    this.currentTracklist[index + 1]?.play()
  }

  static playPrevious() {
    // let index = AudioTrack.current?.index
    // if(index === 0) {
    //   const track = this.currentTracklist[0]
    //   track.audio.currentTime = 0
    //   if(track.audio.paused) {
    //     track.play()
    //   }
    // }
    // else {
    //   this.currentTracklist[index - 1]?.play()
    // }
    let index = AudioTrack.current?.index
    this.currentTracklist[index - 1]?.play()
  }

  static createHTML(/** @type Project */ project) {

    /* go dirty and literally recreate the player each time it needs updating, this would resolve some jankiness */
    if(this.elements.get("container")) this.elements.get("container").remove()

    let audioPlayer =   El("div", "audio-player", [["id", "audio-player"]])
    let cover =         El("img", "audio-player-cover", [["src", `projects/${project.projectIdentifier}/cover.jpg`]])
    let track =         El("div", "audio-player-track")
    let trackName =     El("div", "audio-player-track-name", [], AudioTrack.current.title)
    let trackNumber =   El("div", "audio-player-track-number")
    let progressBar =   El("div", "audio-player-progress-bar")
    let playhead =      El("div", "audio-player-playhead")
    let playheadGhost = El("div", "audio-player-playhead ghost hidden")
    let currentTime =   El("div", "audio-player-current-time", [], "00:00")
    let duration =      El("div", "audio-player-duration", [], "00:00")

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

    track.append(progressBar, trackNumber, trackName, playhead, playheadGhost, currentTime, duration)

    /* Controls: prev, play/pause, next, volume */
    let controls =        El("div",     "audio-player-controls")
    let prevButton =      El("button",  "audio-player-button previous-track")
    let nextButton =      El("button",  "audio-player-button next-track")
    let playButton =      El("button",  "audio-player-button play paused")
    let volumeButton =    El("button",  "audio-player-button volume")
    let toggleControls =  El("button",  "audio-player--button-show-audio-controls hidden")

    controls.append(prevButton, playButton, nextButton, volumeButton)

    /* separate close button that stops audio and hides the player. */
    let closeButton =   El("div", "audio-player-close-button")

    audioPlayer.append(cover, track, toggleControls, controls, closeButton)
    document.body.append(audioPlayer)

    this.elements.set("container", audioPlayer)
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
    this.elements.set("currentTime", currentTime)
    this.elements.set("duration", duration)
    this.elements.set("toggleControls", toggleControls)

    audioPlayer.projectIdentifier = project.projectIdentifier


    /* functionality */

    /* auto-collapsing */
    audioPlayer.onmouseleave = () => {
      this.collapseTimer = setTimeout(() => {
        this.collapseHTML()
      }, 2500)
    }
    audioPlayer.onmouseover = () => {
      window.clearTimeout(this.collapseTimer)
      this.expandHTML()
    }

    /* stupid hack */
    document.addEventListener("click", (e) => {
      if(e.target.closest("#audio-player") == null && Project.projectDetailVisible == false) {
        this.collapseHTML()
      }
    })

    playButton.onclick = () => {
      AudioTrack.current.toggle()
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

    toggleControls.onclick = () => this.toggleControls()

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

    cover.onclick = () => {
      if(Project.current === project && Project.projectDetailVisible) {
        return
      } else
      if(Project.current === project && !Project.projectDetailVisible)
        Project.showDetail()
      else
        Project.select(project.projectIdentifier)
    }

    this.generatedHTML = true

    if(state.isOrientationPortrait) {
      this.HTMLDesktopToMobile()
    }
  }

  /** This method updates the visual for track duration, according to the current track being played. */
  static tickDurationHTML() {
    if(!this.generatedHTML) return
    
    let offset = (AudioTrack.current.audio.currentTime / AudioTrack.current.audio.duration) * 100 + "%"
    this.elements.get("progressBar").style.width = offset
    this.elements.get("playhead").style.left = offset
    this.elements.get("currentTime").innerText = secondsToMinutesString(AudioTrack.current.audio.currentTime)
    //@todo inefficient but works
    this.elements.get("duration").innerText = secondsToMinutesString(AudioTrack.current.audio.duration)
  }

  /** Turns the player into a tiny bar. */
  static collapseHTML() {
    if(!this.generatedHTML) return
    if(Project.projectDetailVisible && Project.current === this.currentProject) return
    if(state.isOrientationPortrait) return

    this.elements.get("container").classList.add("collapsed")
    this.elements.get("track").classList.add("collapsed")
    
    this.elements.get("closeButton").classList.add("hidden")
    this.elements.get("controls").classList.add("hidden")
    this.elements.get("cover").classList.add("hidden")
    this.elements.get("trackName").classList.add("hidden")
    this.elements.get("trackNumber").classList.add("hidden")
    this.elements.get("duration").classList.add("hidden")
    this.elements.get("currentTime").classList.add("hidden")
    this.elements.get("toggleControls").classList.add("hidden")

    this.elements.get("playheadGhost").classList.add("hidden")
  }

  /** This function assumes that all elements that have class "hidden" and "collapsed" will have those classes removed. */
  static expandHTML() {
    if(!this.generatedHTML) return
    if(state.isOrientationPortrait) return

    let container = this.elements.get("container")
    container.classList.remove("collapsed", "hidden")
    
    let elements = container.querySelectorAll(".collapsed, .hidden")
    Array.from(elements).forEach(e => e.classList.remove("collapsed", "hidden"))

    this.elements.get("playheadGhost").classList.add("hidden")
  }

  /** change the layout to desktop, by only reverting changes made by the mobile conversion, the default player state is the exact desktop variant. */
  static HTMLMobileToDesktop() {
    this.elements.forEach(e => e.classList.remove("layout--mobile"))
    this.elements.get("toggleControls").classList.add("hidden")
  }

  /** change the layout to mobile. */
  static HTMLDesktopToMobile() {
    this.elements.forEach(e => e.classList.add("layout--mobile"))

    this.elements.get("toggleControls").classList.remove("hidden")
    this.elements.get("cover").after(this.elements.get("trackName"))
    this.elements.get("trackName").before(this.elements.get("trackNumber"))

    this.toggleControls(false)
  }

  static toggleControls(value) {
    if(value === undefined) {
      this.elements.get("controls").classList.toggle("hidden")
      this.elements.get("toggleControls").classList.toggle("shown")
      this.elements.get("trackName").classList.toggle("hidden")
      this.elements.get("trackNumber").classList.toggle("hidden")
    }
    else if(value === true) {
      this.elements.get("controls").classList.remove("hidden")
      this.elements.get("toggleControls").classList.add("shown")
      this.elements.get("trackName").classList.add("hidden")
      this.elements.get("trackNumber").classList.add("hidden")
  
    }
    else if(value === false) {
      this.elements.get("controls").classList.add("hidden")
      this.elements.get("toggleControls").classList.remove("shown")
      this.elements.get("trackName").classList.remove("hidden")
      this.elements.get("trackNumber").classList.remove("hidden")
    }
  }

  /** creates a canvas and samples kind of the average color of the cover image of an album, then stores that into the project. */
  static getAudioPlayerTrackColor() {
    if(this.currentProject?.trackColor) return this.currentProject.trackColor

    const src = Q(".artwork-side-image")
    const [x, y] = [src?.naturalWidth, src?.naturalHeight ]

    const 
    canvas = document.createElement("canvas")
    canvas.width = x
    canvas.height = y

    const 
    ctx = canvas.getContext("2d")
    ctx.filter = "blur(300px)"
    ctx.drawImage(Q(".artwork-side-image"), 0, 0)

    const imgdata = ctx.getImageData(x/2, y/2, 1, 1)
    const color = [imgdata.data[0], imgdata.data[1], imgdata.data[2]]

    /* mute overly bright colors */
    let multFactor = 1
    for(let c of color) {
      multFactor = Math.min(110 / c, multFactor)
    }
    const finalColor = color.map(c => c * multFactor)
    const css = `rgba(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]}, 1.0)`
    Project.current.trackColor = css
    return css
  }

  /** Stop music and close the player. */
  static close() {
    this.elements.get("container").remove()
    AudioTrack.current?.stop()
  }
}