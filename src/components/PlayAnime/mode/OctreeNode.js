class OctreeNode {
  constructor(level = 0) {
    this.isLeaf = false
    this.pixelCount = 0
    this.red = 0
    this.green = 0
    this.blue = 0
    this.leafNum = 0
    this.reducible = Array.from({ length: 8 })
    this.children = Array.from({ length: 8 })
    this.level = level
    this.reduceCount = 0
    // 这里的 next 不是指兄弟链中的 next 指针
    // 而是在 reducible 链表中的下一个节点
    this.next = null
  }
  createNode(level) {
    let node = new OctreeNode(level)
    if (level === 7) {
      node.isLeaf = true
      this.leafNum++
    } else {
      // 将其丢到第 level 层的 reducible 链表中
      node.next = this.reducible[level]
      this.reducible[level] = node
    }

    return node
  }
  addColor(node, color, level) {
    if (node.isLeaf) {
      node.pixelCount++
      node.red += color.r
      node.green += color.g
      node.blue += color.b
    } else {
      let str = ''
      let r = color.r.toString(2).padStart(8, 0)
      let g = color.g.toString(2).padStart(8, 0)
      let b = color.b.toString(2).padStart(8, 0)

      str += r[level]
      str += g[level]
      str += b[level]
      let idx = parseInt(str, 2)

      if (undefined === node.children[idx]) {
        node.children[idx] = this.createNode(level + 1)
      }

      this.addColor(node.children[idx], color, level + 1)
    }
  }
  reduceTree() {
    if (this.reduceCount > 2000) {
      throw Error('合并次数超过2000次')
    }
    // 找到最深层次的并且有可合并节点的链表
    let level = 6
    while (undefined === this.reducible[level]) level--

    // 取出链表头并将其从链表中移除
    let node = this.reducible[level]
    this.reducible[level] = node.next

    // 合并子节点
    let r = 0
    let g = 0
    let b = 0
    let count = 0
    for (let i = 0; i < 8; i++) {
      if (undefined === node.children[i]) continue
      r += node.children[i].red
      g += node.children[i].green
      b += node.children[i].blue
      count += node.children[i].pixelCount
      this.leafNum--
    }
    this.reduceCount++
    // 赋值
    node.isLeaf = true
    node.children = null
    node.red = r
    node.green = g
    node.blue = b
    node.pixelCount = count
    this.leafNum++
  }
  buildOctree(data, maxColors = 8) {
    let pixels = []
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]
      pixels.push({ r: r, g: g, b: b })
    }
    for (let i = 0; i < pixels.length; i++) {
      // 添加颜色
      this.addColor(this, pixels[i], 0)
      // 合并叶子节点
      while (this.leafNum > maxColors) {
        this.reduceTree()
      }
    }
  }
  colorsStats(node, object) {
    if (node.isLeaf) {
      let r = parseInt(node.red / node.pixelCount).toString(16)
      let g = parseInt(node.green / node.pixelCount).toString(16)
      let b = parseInt(node.blue / node.pixelCount).toString(16)
      if (r.length === 1) r = '0' + r
      if (g.length === 1) g = '0' + g
      if (b.length === 1) b = '0' + b

      let color = r + g + b
      let temp = object.get(color) || 0

      object.set(color, temp + node.pixelCount)

      object.length++
      return
    }

    for (let i = 0; i < 8; i++) {
      if (undefined !== node.children[i]) {
        this.colorsStats(node.children[i], object)
      }
    }
  }
}

export default OctreeNode
// getPixels(resolve('./3.png'), function (err, pixels) {
//   if (err) return
//   let data = pixels.data
//   let array = []
//   for (let i = 0; i < data.length; i += 4) {
//     let r = data[i]
//     let g = data[i + 1]
//     let b = data[i + 2]
//     array.push({ r: r, g: g, b: b })
//   }

//   let octree = new OctreeNode(0)

//   octree.buildOctree(array, 8)

//   let res = new Map()

//   octree.colorsStats(octree, res)

//   console.log(octree.reduceCount, res.size)

//   for (let [key, value] of res.entries()) {
//     console.log(key, value)
//   }
// })
