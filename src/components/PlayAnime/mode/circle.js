import Base from './base'

class Ring extends Base {
  constructor({ id, width, height, albumWidth, albumHeight, album }) {
    super({ id, width, height, albumWidth, albumHeight, album })
    this.config = {
      num: 7, // 圆环数量
      speed: 1, // 圆环速度
      play: false, // 状态
      lineWidth: 0.5 * this.ratio, // 圆环线颜色
      littleWidth: 3 * this.ratio // 圆点颜色
    }
    this.circles = Array.from({ length: this.config.num }).map((_, i) => {
      function getRaduis(i) {
        return (i + 1) * (this.width / this.config.num)
      }
      function getAngle(i) {
        return (360 / this.config.num) * (i + 1)
      }
      return {
        radius: getRaduis.call(this, i),
        alpha: 1,
        angel: getAngle.call(this, i)
      }
    })
    this.context.lineWidth = this.config.lineWidth

    this.loadImg(album).then(res => {
      this.image = res
      this.init()
    })
  }
  async init() {
    let { image, album } = this
    if (!image) await this.loadImg(album)
    this.drawAlubm(image)
    this.drawRing()
  }
  switch(v = true) {
    this.config.play = v
    this.baseSwitch(v)
  }
  drawRing() {
    let { context, width, height, albumWidth } = this
    context.rect(0, 0, width, height)
    context.arc(width / 2, height / 2, albumWidth / 2, 0, 2 * Math.PI)
    context.clip('evenodd')
    this.drawCircle()
  }
  drawCircle() {
    let { context, circles, width, height, albumWidth, config, mainColor } = this
    context.save()
    context.clearRect(0, 0, width, height)
    context.translate(width / 2, height / 2)
    for (let index = 0; index < config.num; index++) {
      let radius = circles[index].radius / 2
      let alpha = circles[index].alpha
      if (config.play) {
        // 圆环半径变化
        if (radius < width / 2) {
          circles[index].radius += config.speed
        } else {
          circles[index].radius = 0
        }
        // 圆环透明度变化
        if (radius > albumWidth / 2) {
          circles[index].alpha = ((width / 2 - radius) / (width / 2 - albumWidth / 2)).toFixed(1)
        } else {
          circles[index].alpha = 1
        }
        // 圆环上的点位置变化
        if (radius >= width / 2) {
          circles[index].angel = (360 / config.num) * (index + 1) + ~~(Math.random() * 360)
        } else {
          circles[index].angel -= config.speed
        }
      }
      let angel = (circles[index].angel / 360) * 2 * Math.PI
      this.paintRing(context, 0, 0, radius, mainColor, alpha)
      this.paintLittleCircle(context, 0, 0, radius, config.littleWidth, angel, mainColor, alpha)
    }
    context.restore()
    requestAnimationFrame(this.drawCircle.bind(this))
  }
  paintRing(ctx, x, y, radius, color, alpha = 1) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`
    ctx.stroke()
  }
  paintLittleCircle(ctx, x, y, radius, length, angel, color, alpha) {
    ctx.beginPath()
    ctx.arc(x + radius * Math.cos(angel), y + radius * Math.sin(angel), length, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`
    ctx.fill()
  }
}
export default Ring
