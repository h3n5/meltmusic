class Drag {
  constructor(ball, bar) {
    this.target = document.querySelector(ball)
    this.limit = document.querySelector(bar)
    this.flag = false
    this.per = 0
    this.event = {}
    this.init()
  }
  init() {
    this.setMobile(this.target)
    this.setPC(this.target)
    this.limit.onclick = this.click.bind(this)
  }
  setPC(element) {
    const ele = element
    ele.onmousedown = e => {
      e.preventDefault() // 禁止同时触发click事件
      this.flag = true
      document.onmousemove = event => {
        event.preventDefault() // 解决拖动过快突然事件断掉的怪异bug
        if (this.flag) {
          var ele = event
          var left = this.limit.offsetLeft
          var width = this.limit.offsetWidth
          var targetWidth = this.target.offsetWidth
          var distance = ele.clientX - left - targetWidth / 2
          distance = distance > width - targetWidth / 2 ? width - targetWidth / 2 : distance
          distance = distance < 0 ? 0 : distance
          this.per = distance / width
          this.event.move && this.event.move.call(this, this.per)
        }
      }

      document.onmouseup = () => {
        this.flag = false
        this.event.end && this.event.end.call(this, this.per)
        document.onmouseup = null // 解除事件绑定
        document.onmousemove = null
      }
    }
  }

  setMobile(ele) {
    ele.ontouchstart = e => {
      this.flag = true
      e.preventDefault() // 禁止同时触发click事件
      const moveFn = event => {
        e.preventDefault() // 禁止在拖动时移动端窗口滚动问题
        if (this.flag) {
          var ele = event.touches[0]
          var left = this.limit.offsetLeft
          var width = this.limit.offsetWidth
          var targetWidth = this.target.offsetWidth
          var distance = ele.clientX - left - targetWidth / 2
          distance = distance > width - targetWidth / 2 ? width - targetWidth / 2 : distance
          distance = distance < 0 ? 0 : distance
          this.per = distance / width
          this.event.move && this.event.move.call(this, this.per)
        }
      }
      document.addEventListener('touchmove', moveFn, { passive: false })

      document.ontouchend = () => {
        this.flag = false
        this.event.end && this.event.end.call(this, this.per)
        document.ontouchend = null
        document.removeEventListener('touchmove', moveFn)
      }
    }
  }
  click(e) {
    var left = this.limit.offsetLeft
    var width = this.limit.offsetWidth
    var targetWidth = this.target.offsetWidth
    var distance = e.clientX - left - targetWidth / 2
    distance = distance > width - targetWidth / 2 ? width - targetWidth / 2 : distance
    distance = distance < 0 ? 0 : distance
    this.per = distance / width
    this.event.click.call(this, this.per)
  }
  on(event, callback) {
    this.event[event] = callback
  }
}
export default Drag
