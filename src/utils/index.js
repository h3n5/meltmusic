import moment from 'moment'
import Auplayer from './audio'
const utils = {
  setSizeImgUrl: function(url, h, w) {
    if (!h) {
      h = w
    }
    url += `?param=${w}y${h}`
    return url
  },
  formatDate: function(date) {
    return moment(date).format()
  },
  debounce: (callback, delay = 1000) => {
    let time
    return function() {
      clearTimeout(time)
      time = setTimeout(() => {
        callback.apply(this, arguments)
      }, delay)
    }
  },
  throttle: (callback, delay = 1000, immediate = false) => {
    let time
    return function() {
      if (!time) {
        immediate && callback.apply(this, arguments)
        time = setTimeout(() => {
          time = null
          callback.apply(this, arguments)
        }, delay)
      }
    }
  },
  Auplayer: new Auplayer()
}

export default utils
