const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}

function noop() {}

export default class Lyric {
  constructor({ lrc = '', lrcCN = '', klrc = '', hanlder = noop }) {
    this.lrc = lrc
    this.lrcCN = lrcCN
    this.klrc = klrc
    this.tags = {}
    this.lines = []
    this.klines = []
    this.handler = hanlder
    this.hasCN = lrcCN !== ''
    this._init()
  }

  _init() {
    this._initTag()
    this._initLines()
    this._initKLines()
  }

  _initTag() {
    for (let tag in tagRegMap) {
      const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
      this.tags[tag] = (matches && matches[1]) || ''
    }
  }

  _initLines() {
    const lines = this.lrc.split('\n')
    const linesCN = this.lrcCN.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] || ''
      const lineCn = linesCN[i] || ''
      let result = timeExp.exec(line)
      if (result) {
        const txt = line.replace(timeExp, '').trim()
        const txtCN = lineCn.replace(timeExp, '').trim()
        if (txt) {
          this.lines.push({
            time: result[1] * 60 * 1000 + result[2] * 1000 + (~~result[3] || 0),
            txt,
            txtCN,
            show: false
          })
        }
      }
    }

    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }
  _initKLines() {
    const lines = this.klrc.split('\n')
    const totalStampReg = /\[\d+\,\d+\]/
    const timeStampReg = /\(\d+\,\d+\)/g
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] || ''

      let allStamp = line.match(totalStampReg)
      let timeStamp = line.match(timeStampReg)

      if (allStamp && timeStamp) {
        let txt = line
          .replace(totalStampReg, '')
          .replace(timeStampReg, '')
          .trim()
        let [time, duration] = JSON.parse(allStamp[0])
        let percent = timeStamp
          .map((_, i, arr) =>
            arr
              .slice(0, i + 1)
              .map(v => +v.match(/\d+(?=\))/)[0])
              .reduce((p, c) => p + c, 0)
          )
          .map(v => v / duration)
        this.klines.push({
          time: time,
          txt,
          show: false,
          percent,
          duration: duration
        })
      }
    }
  }
}
