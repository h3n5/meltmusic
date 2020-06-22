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
    currentIndex: 0,
    currentTimeFlag: true,
    showSongList: false,
    volume: 0,
    albumPic: ''
  },
  getters: {
    getMusic: state => {
      let music = state.music || { album: {}, artists: [] }
      return Object.assign(
        {
          album: music.album || music.al,
          artists: music.artists || music.ar
        },
        music
      )
    },
    getUser: state => {
      return state.user ? state.user : { nickname: '未登录', signature: '需要登陆' }
    }
  },
  mutations: {
    setCurrentIndex(state, value) {
      state.currentIndex = value
    },
    setVolume(state, value) {
      state.volume = value
      Auplayer.setVolume(value)
    },
    setMode(state, value) {
      state.mode = value
      Auplayer.setloop(value === 3)
    },
    clearSongList(state) {
      state.songList = []
    },
    setSongList(state, value) {
      let list = Array.from(state.songList)
      let list_ids = list.map(v => v.id)
      value.forEach(v => {
        if (!list_ids.includes(v.id)) {
          list.push(v)
        }
      })
      state.songList = list
    },
    setshowSongList(state) {
      state.showSongList = !state.showSongList
    },
    setCurrentTime(state, value) {
      state.currentTime = value
      // if (state.currentTimeFlag) Auplayer.setCurrentTime(value)
    },
    setPaused(state, value) {
      state.paused = value
    },
    setAlbumUrl(state, value) {
      state.music.albumPic = value
      state.albumPic = value
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
    setisCurrentTime(state, value) {
      state.currentTimeFlag = value
    }
  },
  actions: {
    /**
     * mode =  1,歌单循环;2,歌单随机;3,单曲循环
     */
    async setSongNext({ dispatch, commit, state }, next = true) {
      const mode = state.mode
      console.log('mode: ', mode)
      let currentIndex = state.currentIndex
      if (mode === 1 || mode === 3) {
        if (next) {
          currentIndex === state.songList.length - 1 ? (currentIndex = 0) : currentIndex++
        } else {
          currentIndex === 0 ? (currentIndex = state.songList.length - 1) : currentIndex--
        }
      }
      if (mode === 2) {
        var randomIndex = () => {
          var r = ~~((state.songList.length - 1) * Math.random())
          if (r === currentIndex) {
            r = randomIndex()
          }
          return r
        }
        currentIndex = randomIndex()
      }
      if (mode === 3) {
        Auplayer.setloop(true)
      } else {
        Auplayer.setloop(false)
      }
      let selectd = state.songList[currentIndex]
      if (selectd) {
        commit('setCurrentIndex', currentIndex)
        let res = await dispatch('playMusicById', selectd)
        Auplayer.play(res)
      } else {
        console.log('从歌单中获取歌曲失败')
      }
    },
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
      try {
        let {
          data: [song]
        } = await getSongUrl(id)
        let url = song.url || ''
        console.log('url: ', url)
        if (!url) return console.error('获取地址失败')
        commit('setMusicUrl', url)
        return await url
      } catch (error) {
        commit('setMusicUrl', '')
        console.error('获取地址失败', error)
      }
    },
    async getLrc({ commit }, id) {
      try {
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
      } catch (error) {
        console.log(error)
      }
    },
    async getAlbum({ commit }, id) {
      console.log('getAlbum: ', id)
      try {
        let res = await getsongAlbum(id)
        let url = res.album.blurPicUrl
        commit('setAlbumUrl', url)
        commit('setLayoutBg', `url(${url}) no-repeat`)
      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {},
  plugins: [createPersistedState()]
})
!(function init(Store) {
  const { state, dispatch, commit } = Store
  if (state.css) {
    Object.keys(Store.state.css).forEach(v => {
      cssFactory.set(v, Store.state.css[v])
    })
  }
  if (state.currentTime) {
    Auplayer.setCurrentTime(state.currentTime)
  }
  // reset music url because will be block
  if (state.music && state.music.id) {
    dispatch('getSong', state.music.id).then(() => {
      if (state.musicUrl) {
        Auplayer.setAudio(state.musicUrl)
      }
    })
    dispatch('getLrc', state.music.id)
  }
  if (state.volume) {
    Auplayer.setVolume(state.volume)
  }
  if (state.music && state.music.albumPic) {
    commit('setLayoutBg', `url(${state.music.albumPic}) no-repeat`)
  }
  Auplayer.setloop(state.mode === 3)
  Auplayer.on('changePlayState', e => {
    Store.commit('setPaused', e)
  })
  Auplayer.on('timeupdate', e => {
    if (state.currentTimeFlag) Store.commit('setCurrentTime', e.target.currentTime)
  })
  Auplayer.on('next', () => {
    Store.dispatch('setSongNext', true)
  })
})(Store)
export default Store
