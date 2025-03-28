class AudioTrack {
  constructor(project, src, index) {
    /** @type Project */
    this.project = project

    /** @type String */
    this.src = src

    /** @type String */
    this.title = src.title ?? src.filename

    /** @type String */
    this.description = src.description ?? ""

    /** @type Integer - Index in the tracklist this is part of. */
    this.index = index

    /** @type HTMLAudioElement */
    this.audio = new Audio(`projects/${project.projectIdentifier}/${src.filename}.mp3`)

    /** @type Map<String, HTMLElement> */
    this.elements = new Map()

    this.createTrackItem()

    this.audio.onloadedmetadata = () => {
      this.elements.get("trackDuration").innerText = secondsToMinutes(this.audio.duration)
    }
  }
  /** Start playing this particular audio track(file). */
  play() {
    if(!AudioTrack.current) {
      AudioTrack.current = this
      this.audio.play()
      this.audio.volume = 1
    } else
    if(AudioTrack.current && AudioTrack.current !== this) {
      AudioTrack.current.stop()
      AudioTrack.current = this
      this.audio.play()
      this.audio.volume = 1
    } else
    if(AudioTrack.current === this) {
      if(this.audio.paused) {
        this.elements.get("playStateIcon").classList.remove("play", "pause")
        this.audio.play()
        AudioPlayer.elements.get("playButton").classList.add("paused")
      } 
      else this.pause()
      return
    }

    /* actually change what the AudioPlayer.currentTracklist is */
    AudioPlayer.setCurrentTracklist(this.project.projectIdentifier)

    /* visuals */
    this.elements.get("container").classList.add("active")

    /* @todo it recreates the entire player again, which will lead to more and more bugs as I add features */
    AudioPlayer.createHTML(this.project)

    AudioPlayer.elements.get("playButton").classList.add("paused")

    this.audio.ontimeupdate = () => AudioPlayer.tickDurationHTML()
    this.audio.onended = () => AudioPlayer.playNext()

    /* @todo is this if clause necessary? it should always have the HTML generated, it does that previously in this function */
    if(AudioPlayer.generatedHTML) {
      AudioPlayer.elements.get("duration").innerText = secondsToMinutesString(AudioTrack.current.audio.duration)
      /* @todo very inefficient, lmao */
      AudioPlayer.elements.get("progressBar").style.backgroundColor = AudioPlayer.getAudioPlayerTrackColor()
      
      if(state.isOrientationPortrait) {
        AudioPlayer.toggleControls(true)
      }

      if(this.index === 0) {
        AudioPlayer.elements.get("prevButton").disabled = true
      }
      
      if(this.index === AudioPlayer.currentTracklist.length - 1) {
        AudioPlayer.elements.get("nextButton").disabled = true
      }
    }
  }
  stop() {
    this.audio.currentTime = 0
    this.audio.pause()
    
    this.audio.ontimeupdate = ""
    this.audio.onended = ""

    /* visuals */
    this.elements.get("container").classList.remove("active")
    this.elements.get("playStateIcon").classList.remove("play", "pause")
  }
  pause() {
    this.audio.pause()
    this.elements.get("playStateIcon").classList.add("play")
    AudioPlayer.elements.get("playButton").classList.remove("paused")
  }
  toggle() {
    this.audio.paused ? this.play() : this.pause()
  }
  createTrackItem() {
    let container = El("div", "audio-track", [], )
    let icon = El("div", "audio-track-play-state-icon", [], )
    let trackTitle = El("div", "audio-track-title", [], this.title)
    let trackDuration = El("div", "audio-track-duration", [], "...loading")
    
    container.append(icon, trackTitle, trackDuration)
    container.onclick = (ev) => {
      if(ev.target?.closest(".audio-track-info-button")) return

      this.play()
    }

    if(this.description) {
      /* expander for info about the track */
      let trackInfoButton = El("div", "audio-track-info-button", [], "info")
      let trackDescription = El("div", "audio-track-description hidden", [], this.description)

      container.after(trackDescription)
      trackTitle.after(trackInfoButton)

      this.elements.set("trackInfoButton", trackInfoButton)
      this.elements.set("trackDescription", trackDescription)



      /* functionality */
      
      trackInfoButton.onclick = () => {
        trackDescription.classList.toggle("hidden")
        trackInfoButton.innerHTML == "info" ? trackInfoButton.innerHTML = "hide&nbsp;info" : trackInfoButton.innerHTML = "info"
      }

    }
    
    this.elements.set("container",      container)
    this.elements.set("playStateIcon",  icon)
    this.elements.set("trackDuration",  trackDuration)
  }

  /** @type AudioTrack - Only one can be playing at the same time. This is a limitation I can accept. */
  static current = null
}
