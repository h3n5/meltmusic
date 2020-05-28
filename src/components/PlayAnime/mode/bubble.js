import Base from './base'
import Noise from './noise'
const noise = Noise.noise
noise.seed(Math.random())

class Bubble extends Base {
  constructor({ id, width, height, albumWidth, albumHeight, audio }) {
    super({ id, width, height, albumWidth, albumHeight, alubm: true })
    this.config = {
      play: false,
      point: 10,
      spacing: 20,
    }
    this.audio = audio
    this.init()
    this.render()
  }
  init() {
    this.audioCtx = new AudioContext() // 创建音频接收
    this.audioSource = this.audioCtx.createMediaElementSource(this.audio) // 创建音频控制
    let splitter = this.audioCtx.createChannelSplitter(2)
    this.audioSource.connect(splitter) // 分离左右声道

    this.analyserLeft = this.audioCtx.createAnalyser() // 创建音频分析
    this.analyserLeft.fftSize = 1024
    this.arrayLeft = new Uint8Array(this.analyserLeft.frequencyBinCount)
    splitter.connect(this.analyserLeft, 0, 0)

    this.analyserRight = this.audioCtx.createAnalyser() // 创建音频分析
    this.analyserRight.fftSize = 1024
    this.arrayRight = new Uint8Array(this.analyserRight.frequencyBinCount)
    splitter.connect(this.analyserRight, 1, 0)

    let mergerNode = this.audioCtx.createChannelMerger(2)
    this.analyserLeft.connect(mergerNode, 0, 0)
    this.analyserRight.connect(mergerNode, 0, 1)

    mergerNode.connect(this.audioCtx.destination) // 合并左右声道
  }
  render() {
    let { analyserLeft, analyserRight, arrayRight, arrayLeft } = this

    analyserLeft.getByteFrequencyData(arrayLeft)
    this.drawBubble(arrayLeft)
    function samePoint(arr1 = [], arr2) {
      let res = 0
      arr1.forEach((v, i) => {
        if (v === arr2[i]) {
          res += 1
        }
      })
      return res / arr1.length
    }
    console.log('AutoConsole: render -> arrayLeft', samePoint(arrayLeft, arrayRight))
    analyserRight.getByteFrequencyData(arrayRight)
    this.drawBubble(arrayRight)

    this.requestAnimationFrame(this.render.bind(this), true)
  }
  drawBubble(array = []) {
    let { config, albumWidth, width } = this
    let step = ~~(array.length / config.point)
    let angle = (Math.PI * 2) / config.point
    let res = []
    let max = Math.max.apply(this, array)
    for (let index = 0; index < array.length; index += step) {
      const element = max ? ((array[index] / max) * (width - albumWidth)) / 2 : array[index]
      let base = albumWidth / 2 + config.spacing
      let real = albumWidth / 2 + config.spacing + element
      let anglePlus = (angle * index) / step
      let angleBase = angle * (index / step + 0.5)
      res.push([Math.sin(anglePlus) * real, Math.cos(anglePlus) * real])
      res.push([Math.sin(angleBase) * base, Math.cos(angleBase) * base])
    }
    this.paint(res)
  }
  paint(array = []) {
    let { context, width, height } = this
    context.clearRect(0, 0, width, height)
    context.save()
    context.beginPath()
    let copyArray = array.concat(array)
    context.translate(width / 2, height / 2)
    let start = [(array[0][0] + array[1][0]) / 2, (array[0][1] + array[1][1]) / 2]
    context.moveTo(start[0], start[1])
    for (let index = 0; index < array.length; index += 1) {
      let res = copyArray.slice(index + 1, index + 3)
      let center = [(res[0][0] + res[1][0]) / 2, (res[0][1] + res[1][1]) / 2]
      let arr = copyArray
        .slice(index + 1, index + 2)
        .concat(center)
        .flat()
      context.quadraticCurveTo.apply(context, arr)
    }
    context.closePath()
    context.fill()
    context.stroke()
    context.restore()
  }
}
export default Bubble
