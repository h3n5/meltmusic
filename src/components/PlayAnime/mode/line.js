import Base from './base'

class Line extends Base {
  constructor({ id, width, height, albumWidth, albumHeight, album, audio }) {
    super({ id, width, height, albumWidth, albumHeight })
    this.config = {
      lineColor: 'rgba(0,0,0,0.5)',
      meterNum: 128,
      meterWidth: 2.5 * this.ratio,
      minHeight: 20 * this.ratio,
      play: false,
    }
    this.audio = audio
    this.init()
    this.loadImg(album).then((image) => {
      this.drawAlubm(image)
      this.drawLine()
    })
  }
  switch(v = true) {
    this.baseSwitch(v)
    this.config.play = v
  }
  init() {
    this.audioCtx = new AudioContext() // 创建音频接收
    this.audioSrc = this.audioCtx.createMediaElementSource(this.audio) // 创建音频控制
    this.analyser = this.audioCtx.createAnalyser() // 创建音频分析
    this.audioSrc.connect(this.analyser)
    this.analyser.connect(this.audioCtx.destination)
    this.analyser.fftSize = 256
  }
  drawLine() {
    let { context, analyser, config } = this
    context.fillStyle = config.lineColor
    context.lineCap = 'round'
    this.array = new Uint8Array(analyser.frequencyBinCount)
    this.lineRender()
  }
  lineRender() {
    let { analyser, context, array, config, width, height, albumWidth, ratio } = this
    const PI = Math.PI

    analyser.getByteFrequencyData(array)

    let { meterNum, meterWidth, minHeight } = config
    let radius = albumWidth / 2 // 环形半径
    let distance = 20 * ratio
    let step = Math.round(array.length / meterNum)
    let max = Math.max.apply(this, array)

    context.clearRect(0, 0, width, height)
    context.save()
    context.translate(width / 2, height / 2)

    for (let i = 0; i < meterNum; i++) {
      let value = array[i * step]
      let meterHeight = value ? (value / max) * (width / 2 - radius) : minHeight
      context.moveTo(0, radius)
      context.rotate((2 * PI) / meterNum)
      context.fillRect(0, radius + distance, meterWidth, meterHeight)
    }
    context.fill()
    context.restore()
    this.requestAnimationFrame(this.lineRender.bind(this, array))
  }
}
export default Line
