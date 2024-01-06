class AudioPlayer {
  /** @type Map<String, Array> */
  static lists = new Map()

  /** @type Set<AudioTrack> */
  static currentTracklist = new Set()

  /** @type Integer */
  static currentTrackIndex = 0

  /** @type Map<String, HTMLElement> */
  static elements = new Map()

  /** This function loads a tracklist and then creates the HTML and appends it to the proper UI container. */
  static loadTracklist(project, content) {
    const trackContainer = El("div", "audio-track-container")
    Q("#project-detail-text-side").append(trackContainer)

    content.src.forEach(source => {
      let track = new AudioTrack(project, source)
      trackContainer.append(track.item)
    })
  }

  static createHTML(/** @type Project */ project) {
    let container =     El("div", "audio-player", [["id", "audio-player"]])
    let cover =         El("img", "audio-player-cover", [["src", "projects/jumpout/cover.jpg"]])
    let track =         El("div", "audio-player-track")
    let trackName =     El("div", "audio-player-track-name", [], "Sand Covered the Tracks of Past Crimes")
    let trackNumber =   El("div", "audio-player-track-number", [], "01: ")
    let progressBar =   El("div", "audio-player-progress-bar")
    let playhead =      El("div", "audio-player-playhead")

    track.append(trackNumber, trackName, progressBar, playhead)

    /* Controls: prev, play/pause, next, volume */
    let controls =      El("div", "audio-player-controls")
    let prevButton =    El("div", "audio-player-button previous-track")
    let nextButton =    El("div", "audio-player-button next-track")
    let playButton =    El("div", "audio-player-button play")
    let volumeButton =  El("div", "audio-player-button volume")

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

    container.projectIdentifier = project.projectIdentifier
  }

  /** This method updates the player element, according to the current track being played. */
  static updateHTML() {

  }

  /** @type HTMLDivElement */
  static element = null
}

AudioPlayer.createHTML()