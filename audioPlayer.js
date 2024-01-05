class AudioPlayer {
  /** @type Map<String, Array>*/
  static lists = new Map()

  /** @type Set<AudioTrack> */
  static currentTracklist = new Set()

  /** @type Integer */
  static currentTrackIndex = 0

  /** This function loads a tracklist and then creates the HTML and appends it to the proper UI container. */
  static loadTracklist(project, content) {
    const trackContainer = El("div", "audio-track-container")
    Q("#project-detail-text-side").append(trackContainer)

    content.src.forEach(source => {
      let track = new AudioTrack(project, source)
      trackContainer.append(track.item)
    })
  }
}