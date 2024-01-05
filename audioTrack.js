class AudioTrack {
  constructor(src) {
    this.src = src
  }
  play() {

  }
  pause() {

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
}
