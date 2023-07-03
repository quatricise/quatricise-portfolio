class AudioPlayer {
  constructor() {
    this.currentTrackIndex = 0
    this.createHTML()
  }
  createHTML() {
    let
    playlist = document.createElement("div")
    playlist.classList.add("audio-playlist")
  }
  createTrackHTML() {
    let
    track = document.createElement("div")
    track.classList.add("audio-track")

    let
    trackTitle = document.createElement("div")
    trackTitle.classList.add("audio-track-title")

    let
    trackDuration = document.createElement("div")
    trackDuration.classList.add("audio-track-duration")

    let
    icon = document.createElement("div")
    icon.classList.add("audio-track-play-state-icon")

    track.append(icon, trackTitle, trackDuration)
  }
  loadTracks(tracks = []) {
    tracks.forEach(track => {
      this.createTrackHTML()
    })
  }
  revertPlay() {
    document.querySelector('.fa-play').style.display = 'block';
    document.querySelector('.fa-pause').style.display = 'none';
    document.getElementById('myBar').style.width = '0%';
    document.getElementById('myBarCircle').style.left = '0%';
  }
  playTrack(index) {
    this.tracks[index].play()
  }
  nextTrack() {
    this.currentTrackIndex++
    this.tracks[this.currentTrackIndex].play()
  }
}
