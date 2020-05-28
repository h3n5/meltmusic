<template>
  <transition name="slide">
    <div class="player" :class="[isShow ? 'show' : 'hide']">
      <div class="back" @click="isShow = false">
        <a-icon type="arrow-left" />
      </div>
      <div class="player-wrap flex-column player-tg">
        <div class="play-content transiton-slide flex-row" :style="{ flex: showSongList ? 0 : 1 }">
          <PlayAnime />
          <PlayLyric />
        </div>
        <PlayBar class="player-PlayBar transiton-slide" :mini="false" @triggerSongList="setshowSongList" />
        <div class="play-content transiton-slide" :style="{ flex: showSongList ? 1 : 0 }">
          <SongTable size="small" :songs="songList" @click="playMusicById" />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import PlayBar from './PlayBar'
import SongTable from '@/components/SongTable'
import PlayLyric from './PlayLyric'
import PlayAnime from './PlayAnime'
export default {
  name: 'Player',
  components: {
    PlayBar,
    PlayLyric,
    PlayAnime,
    SongTable
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['showPlayer', 'showSongList', 'songList']),
    ...mapGetters(['getMusic']),
    isShow: {
      get() {
        return this.showPlayer
      },
      set() {
        this.$store.commit('triggerPlayer')
      }
    }
  },
  created() {},
  methods: {
    ...mapMutations(['setshowSongList']),
    ...mapActions(['playMusicById'])
  }
}
</script>
<style lang="less">
.player {
  position: fixed;
  z-index: 3;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: var(--playbar-bgcolor);
  background-size: cover;
  transition: transform 0.5s;
  color: #fff;
  .player-tg {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    .ant-table-placeholder {
      background-color: transparent;
      border-color: transparent;
    }
    .ant-table-thead > tr > th {
      color: var(--font-color-blue);
    }
  }
  .back {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    padding: 5px 15px;
    font-size: 16px;
    background: #007acc;
  }
  .play-content {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    > div {
      flex: 1;
    }
    .ant-table {
      color: #fff;
      .ant-table-row:hover {
        td {
          background: #000;
        }
      }
    }
  }
  .player-wrap {
    height: 100%;
  }
}
.hide {
  transform: translateY(105%);
}
.show {
  transform: none;
}
.transiton-slide {
  transition: all 0.2s ease-in-out;
}
</style>
