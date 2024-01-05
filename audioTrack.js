class AudioTrack {
  constructor(project, src) {
    /** @type Project */
    this.project = project

    /** @type String */
    this.src = src

    /** @type HTMLAudioElement */
    this.audio = new Audio(`projects/${project.projectIdentifier}/${src.filename}.mp3`)

    /** @type HTMLDivElement */
    this.item = this.createTrackItem(src.title ?? src.filename)

    this.audio.onloadedmetadata = () => {
      this.item.querySelector(".audio-track-duration").innerText = secondsToMinutes(this.audio.duration)
    }
  }
  play() {
    if(AudioTrack.current !== this) AudioTrack.current?.pause()
    AudioTrack.current = this
    this.audio.play()
  }
  pause() {
    this.audio.pause()
  }
  createTrackItem(title) {
    let
    container = El("div", "audio-track", [], )

    let
    icon = El("div", "audio-track-play-state-icon", [], )

    let
    trackTitle = El("div", "audio-track-title", [], title)

    let
    trackDuration = El("div", "audio-track-duration", [], )

    container.append(icon, trackTitle, trackDuration)
    container.onclick = () => this.play()
    return container
  }
  /** @type AudioTrack */
  static current = null
}
