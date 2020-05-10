<template>
  <div class="playlist-detail">
    <DetailHeader :playlist="playlist" :songs="songs" />
    <div class="tabs-wrap">
      <a-tabs v-model="activeTab">
        <a-tab-pane :tab="item" v-for="(item, index) in tabs" :key="index"></a-tab-pane>
      </a-tabs>
      <input-search
        :class="getInputCls()"
        @blur="onInputBlur"
        @focus="onInputFocus"
        class="input"
        placeholder="搜索歌单音乐"
        v-model="searchValue"
        v-show="activeTab === SONG_IDX"
      />
    </div>
    <div class="empty" v-if="searchValue && !filteredSongs.length">
      未能找到和
      <span class="keyword">“{{ searchValue }}”</span>
      相关的任何音乐
    </div>
    <SongTable :songs="filteredSongs" class="table" v-show="activeTab === SONG_IDX" @click="jumpMusicDetail" />
    <div class="comments" v-show="activeTab === 1">
      <Comments :id="id" @update="onCommentsUpdate" type="playlist" />
    </div>
  </div>
</template>

<script>
import DetailHeader from './componetns/head'
import { Input } from 'ant-design-vue'
import SongTable from '@/components/SongTable'
import Comments from '@/components/Comments/index.vue'
import { getListDetail, getSongDetail } from '@/api'
import { mapMutations, mapActions } from 'vuex'
const MAX = 500
const SONG_IDX = 0
const COMMENT_IDX = 1
export default {
  name: 'Album',
  components: { DetailHeader, SongTable, Comments, InputSearch: Input.Search },
  async created() {
    this.SONG_IDX = SONG_IDX
    this.COMMENT_IDX = COMMENT_IDX
  },
  data() {
    return {
      tabs: ['歌曲列表', '评论'],
      activeTab: SONG_IDX,
      playlist: {
        creator: {},
        tags: []
      },
      songs: [],
      searchValue: '',
      inputFocus: false
    }
  },
  methods: {
    ...mapMutations(['setMusic']),
    ...mapActions(['playMusicById']),
    async jumpMusicDetail(v) {
      let res = await this.playMusicById(v)
      this.$music.play(res)
    },
    async init() {
      const { playlist } = await getListDetail({ id: this.id })
      this.playlist = playlist
      this.genSonglist(playlist)
    },
    async genSonglist(playlist) {
      const trackIds = playlist.trackIds.map(({ id }) => id)
      if (!trackIds.length) return
      const { songs = [] } = await getSongDetail(trackIds.slice(0, MAX))
      this.songs = songs
    },
    onCommentsUpdate({ total }) {
      this.tabs.splice(COMMENT_IDX, 1, `评论(${total})`)
    },
    onInputFocus() {
      this.inputFocus = true
    },
    onInputBlur() {
      this.inputFocus = false
    },
    getInputCls() {
      return !this.inputFocus ? 'inactive' : ''
    }
  },
  computed: {
    id() {
      return Number(this.$route.params.id)
    },
    filteredSongs() {
      return this.songs.filter(({ name, artistsText, albumName }) =>
        `${name}${artistsText}${albumName}`.toLowerCase().includes(this.searchValue.toLowerCase())
      )
    }
  },
  watch: {
    id: {
      handler() {
        this.searchValue = ''
        this.init()
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.playlist-detail {
  width: 100%;
  .tabs-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 24px;
    border-bottom: 1px solid var(--border);
    .input {
      width: 160px;
      &:not(:hover) {
        &.inactive {
          /deep/.ant-input {
            background: transparent !important;
          }
        }
      }
    }
  }
  .empty {
    .flex-center;
    height: 200px;
    .keyword {
      color: var(--font-color-blue);
    }
  }
  .comments {
    padding: 16px 32px;
  }
}
</style>
