class Drag {
  constructor(ball, bar, mode = 'vertical') {
    this.target = document.querySelector(ball)
    this.limit = document.querySelector(bar)
    this.isVertical = mode === 'vertical'
    this.flag = false
    this.per = 0
    this.event = {}
    this.init()
  }
  init() {
    this.setMobile(this.target)
    this.setPC(this.target)
    this.limit.addEventListener('click', this.click.bind(this))
  }
  getPosition() {
    this.target.position = this.target.getBoundingClientRect()
    this.limit.position = this.limit.getBoundingClientRect()
    this.limit_position = this.isVertical ? this.limit.position.y : this.limit.position.x
    this.limit_size = this.isVertical ? this.limit.offsetHeight : this.limit.offsetWidth
    this.target_size = this.isVertical ? this.target.offsetHeight : this.target.offsetWidth
  }
  setPC(element) {
    // const ele = element
    element.onmousedown = e => {
      e.preventDefault() // 禁止同时触发click事件
      this.flag = true
      document.onmousemove = event => {
        // event.preventDefault() // 解决拖动过快突然事件断掉的怪异bug
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
    this.getPosition()
    var distance = (this.isVertical ? e.clientY : e.clientX) - this.limit_position
    //  - this.target_size / 2

    distance = distance > this.limit_size ? this.limit_size : distance

    distance = distance < 0 ? 0 : distance

    this.per = this.isVertical ? 1 - distance / this.limit_size : distance / this.limit_size

    this.event.click.call(this, this.per)
  }
  on(event, callback) {
    this.event[event] = callback
  }
}
export default Drag
