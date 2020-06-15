class LineNormal {
  constructor(config) {
    this.ratio = window.devicePixelRatio || 1
    this.config = Object.assign(config, {
      meterWidth: 2.5 * this.ratio,
      minHeight: 20 * this.ratio,
      play: false
    })
    this.audio = config.audio
    /**
     * @type CanvasRenderingContext2D
     */
    this.context = this.element.getContext('2d')
    this.init()
    this.drawLine()
  }
  switch(v = true) {
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
    let { analyser, array, gap, width, height, meterWidth } = this.config
    let { context } = this
    let distance = meterWidth + gap
    let meterNum = Math.round(width / distance)

    analyser.getByteFrequencyData(array)

    let step = Math.round(array.length / meterNum)

    context.save()
    context.clearRect(0, 0, width, height)
    context.beginPath()
    context.scale(1, -1)
    for (let i = 0; i < meterNum; i++) {
      let value = array[i * step]
      context.fillRect(0, i * distance, meterWidth, value)
    }

    context.restore()
    this.requestAnimationFrame(this.lineRender.bind(this, array))
  }
}
export default LineNormal
