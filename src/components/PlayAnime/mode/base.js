import OctreeNode from './OctreeNode'
class Base {
  constructor({ id, width, height, albumWidth, albumHeight, alubm = true }) {
    this.ratio = window.devicePixelRatio || 1
    this.play = false
    this.alubm = alubm
    this.requestAnimationFrame = (e, use = true) => {
      use ? window.requestAnimationFrame(e) : setTimeout(e, 1000)
    }
    this.setElement(id, width, height)
    this.mainColor = [22, 173, 230]
    if (alubm) this.setImgElement(albumWidth, albumHeight)
  }
  baseSwitch(v) {
    this.play = v
  }
  setElement(id, width, height) {
    /**
     * @type HTMLElement
     */
    this.element = document.querySelector(id)
    this.element.style.width = width + 'px'
    this.element.style.height = height + 'px'
    this.element.width = this.width = width * this.ratio
    this.element.height = this.height = height * this.ratio
    /**
     * @type CanvasRenderingContext2D
     */
    this.context = this.element.getContext('2d')
  }
  setImgElement(albumWidth, albumHeight) {
    this.imgElement = this.element.cloneNode()
    this.imgElement.setAttribute('id', 'imgElement')
    this.imgElement.style.width = albumWidth + 'px'
    this.imgElement.style.height = albumHeight + 'px'
    this.imgElement.width = this.albumWidth = albumWidth * this.ratio
    this.imgElement.height = this.albumHeight = albumHeight * this.ratio
    this.element.parentElement.append(this.imgElement)
    /**
     * @type CanvasRenderingContext2D
     */
    this.imgContext = this.imgElement.getContext('2d')
  }
  drawAlubm(image) {
    let context = this.imgContext
    let { albumWidth, albumHeight } = this
    context.translate(albumWidth / 2, albumHeight / 2)
    context.arc(0, 0, albumWidth / 2, 0, 2 * Math.PI)
    context.clip()
    this.drawPic(image)
    if (this.alubm) {
      let imgData = context.getImageData(-albumWidth / 2, -albumHeight / 2, albumWidth, albumHeight)
      this.getMainColor(imgData.data)
    }
  }
  getMainColor(imgData) {
    let octree = new OctreeNode(0)
    octree.buildOctree(imgData, 8)
    let res = new Map()
    octree.colorsStats(octree, res)
    let max = 0
    let result = '16ade6'
    for (const [key, value] of res.entries()) {
      max = Math.max(max, value)
      if (max === value) {
        result = key
      }
    }
    let mainColor = []
    for (let i = 0; i < result.length; i += 2) {
      let tmp = parseInt('0x' + result.slice(i, i + 2))
      mainColor.push(tmp)
    }
    this.mainColor = mainColor
    return result
  }
  async drawPic(image) {
    let { albumWidth, albumHeight, play } = this
    this.requestAnimationFrame(this.drawPic.bind(this, image))
    let context = this.imgContext
    if (!play) {
      context.drawImage(image, -albumWidth / 2, -albumHeight / 2, albumWidth, albumHeight)

      return false
    }
    context.clearRect(-albumWidth / 2, -albumHeight / 2, albumWidth, albumHeight)
    context.drawImage(image, -albumWidth / 2, -albumHeight / 2, albumWidth, albumHeight)
    context.rotate((0.3 * Math.PI) / 180)
  }
  loadImg(url) {
    return new Promise((resolve, reject) => {
      let image = new Image()
      image.crossOrigin = ''
      image.src = url
      image.onload = function() {
        resolve(image)
      }
      image.onerror = function(e) {
        reject(e)
      }
    })
  }
}

export default Base
