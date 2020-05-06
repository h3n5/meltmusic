import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import CssVariable from '@/utils/cssvariable'
import { getSongUrl, getLyric, getsongAlbum } from '@/api'
import Lyric from '@/utils/lyric'
import utils from '@/utils/index'
const Auplayer = utils.Auplayer
Vue.use(Vuex)
let cssFactory = new CssVariable()
const Store = new Vuex.Store({
  state: {
    css: {},
    user: null,
    music: null,
    musicUrl: '',
    paused: true,
    currentTime: 0,
    showPlayer: false,
    lyricObj: {},
    mode: 1,
    songList: [],
    currentIndex: 0
  },
  getters: {
    getMusic: state => {
      let music = state.music
      if (!music) return null
      return Object.assign(music, {
        album: music.album || music.al,
        artists: music.artists || music.ar
      })
    }
  },
  mutations: {
    setCurrentTime(state, value) {
      state.currentTime = value
      Auplayer.setcurrentTime(value)
    },
    setPaused(state, value) {
      state.paused = value
    },
    setAlbumUrl(state, value) {
      state.music.albumPic = value
    },
    _user: (state, value) => {
      state.user = value
    },
    setMusicUrl(state, value) {
      state.musicUrl = value
      Auplayer.setAudio(value)
    },
    setMusic: (state, value) => {
      state.music = value
    },
    setLayoutBg: (state, value) => {
      if (value) {
        let key = '--playbar-bgcolor'
        state.css[key] = value
        cssFactory.set(key, value)
      }
    },
    triggerPlayer: state => {
      state.showPlayer = !state.showPlayer
    },
    setLrcObj(state, value) {
      state.lyricObj = value
    },
    togglePlay() {
      Auplayer.toggle()
    },
    setisCurrentTime(state, value) {
      Auplayer.setsetcurrentTimeFlag(value)
    },
    /**
     * mode =  1,歌单循环;2,歌单随机;3,单曲循环
     */
    setSongNext(state, next = true) {
      const mode = state.mode

      if (mode === 1) {
        if (next) {
          this.currentIndex === this.songList.length - 1 ? (this.currentIndex = 0) : this.currentIndex++
        } else {
          this.currentIndex === 0 ? (this.currentIndex = this.songList.length - 1) : this.currentIndex--
        }
      }
      if (mode === 2) {
        var randomIndex = () => {
          var r = ~~((this.songList.length - 1) * Math.random())
          if (r === this.currentIndex) {
            r = randomIndex()
          }
          return r
        }
        this.currentIndex = randomIndex()
      }
      if (mode === 3) {
        Auplayer.setloop(true)
      } else {
        Auplayer.setloop(false)
        Auplayer.setAudio(this.songList[this.currentIndex])
      }
    }
  },
  actions: {
    async playMusicById({ commit, dispatch, state, getters }, song) {
      commit('setMusic', song)
      await Promise.all([
        dispatch('getSong', song.id),
        dispatch('getLrc', song.id),
        dispatch('getAlbum', getters.getMusic.album.id)
      ])
      return Promise.resolve(state.musicUrl)
    },
    async getSong({ commit }, id) {
      let {
        data: [song]
      } = await getSongUrl(id)
      let url = song.url
      commit('setMusicUrl', url)
    },
    async getLrc({ commit }, id) {
      let res = await getLyric(id)
      let lyricTxt = ''
      let lyricTxtCN = ''
      if (res.nolyric) {
        lyricTxt = '(⊙０⊙) 暂无歌词'
      } else {
        lyricTxt = res.lrc.lyric
      }
      if (!res.nolyric || (res.tlyric && res.tlyric.lyric)) {
        lyricTxtCN = res.tlyric.lyric
      } else {
        lyricTxtCN = ''
      }
      let lycObj = new Lyric(lyricTxt, lyricTxtCN)
      commit('setLrcObj', lycObj)
    },
    async getAlbum({ commit }, id) {
      let res = await getsongAlbum(id)
      let url = res.album.blurPicUrl
      commit('setAlbumUrl', url)
    }
  },
  modules: {},
  plugins: [createPersistedState()]
})
!(function init(Store) {
  const { state } = Store
  if (state.css) {
    Object.keys(Store.state.css).forEach(v => {
      cssFactory.set(v, Store.state.css[v])
    })
  }
  if (state.musicUrl) {
    Auplayer.setAudio(state.musicUrl)
  }
  if (state.currentTime) {
    Auplayer.setcurrentTime(state.currentTime)
  }

  Auplayer.on('changePlayState', e => {
    Store.commit('setPaused', e)
  })
  Auplayer.on('timeupdate', e => {
    Store.commit('setCurrentTime', e.target.currentTime)
  })
})(Store)
export default Store
