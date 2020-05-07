import Events from './event'
class Auplayer extends Events {
  audio = null
  options = {}
  songList = []
  currentIndex = 0
  durationTime = 0
  currentTime = 0
  playState = null
  constructor(options = { preload: true, mode: 1 }) {
    super()
    this.options = options
    this.init()
    this.initEvent()
  }
  /**
   * mode =  1,歌单循环;2,歌单随机;3,单曲循环
   */
  init() {
    this.audio = document.createElement('audio')
    this.audio.preload = this.options.preload
    this.on('timeupdate', e => {
      this.currentTime = e.target.currentTime
    })
    this.on('canplay', e => {
      this.setdurationTime(e.target.duration)
    })
    this.on('ended', () => {
      this.trigger('next')
    })
  }
  initEvent() {
    for (let i = 0; i < this.audioEvents.length; i++) {
      this.audio.addEventListener(this.audioEvents[i], e => {
        this.trigger(this.audioEvents[i], e)
      })
    }
  }
  play(url) {
    if (url) {
      this.setAudio(url)
    }
    this.audio.play()
  }
  pause() {
    this.audio.pause()
  }
  async toggle() {
    if (!this.audio.readyState) return console.error('播放状态为0')
    if (this.playState) await this.playState
    if (this.audio.paused) {
      this.playState = this.audio.play()
    } else {
      this.playState = this.audio.pause()
    }
    this.trigger('changePlayState', this.audio.paused)
  }
  setAudio(value) {
    this.audio.src = value
    this.audio.load()
  }
  setdurationTime(time) {
    this.durationTime = time
  }
  setcurrentTime(time) {
    this.audio.currentTime = time
  }
  setloop(value) {
    this.audio.loop = value
  }
}

export default Auplayer
