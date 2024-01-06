class AudioTrack {
  constructor(project, src, index) {
    /** @type Project */
    this.project = project

    /** @type String */
    this.src = src

    /** @type String */
    this.title = src.title ?? src.filename

    /** @type Integer - Index in the tracklist this is part of. */
    this.index = index

    /** @type HTMLAudioElement */
    this.audio = new Audio(`projects/${project.projectIdentifier}/${src.filename}.mp3`)

    /** @type HTMLDivElement */
    this.item = this.createTrackItem(src.title ?? src.filename)

    this.audio.onloadedmetadata = () => {
      this.item.querySelector(".audio-track-duration").innerText = secondsToMinutes(this.audio.duration)
    }
  }
  play() {
    if(AudioTrack.current !== this) AudioTrack.current?.stop()
    AudioTrack.current = this
    this.audio.play()

    /* visuals */
    this.item.classList.add("active")

    /* trigger audioplayer to open */
    /* so far it recreates the html every time, later it will only do so when loading the project first, or something */
    AudioPlayer.createHTML(this.project)
    this.audio.ontimeupdate = () => AudioPlayer.updateHTML()
    this.audio.onended = () => AudioPlayer.playNext()
  }
  stop() {
    this.audio.currentTime = 0
    this.audio.pause()
    
    this.audio.ontimeupdate = ""
    this.audio.onended = ""

    /* visuals */
    this.item.classList.remove("active")
  }
  pause() {
    this.audio.pause()
  }
  toggle() {
    this.audio.paused ? this.play() : this.pause()
  }
  createTrackItem(title) {
    let container = El("div", "audio-track", [], )

    let icon = El("div", "audio-track-play-state-icon", [], )

    let trackTitle = El("div", "audio-track-title", [], title)

    let trackDuration = El("div", "audio-track-duration", [], )

    container.append(icon, trackTitle, trackDuration)
    container.onclick = () => this.play()
    return container
  }
  /** @type AudioTrack - Only one can be playing at the same time. This is a limitation I can accept. */
  static current = null
}
