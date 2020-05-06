<template>
  <transition name="slide">
    <div class="player" :class="[isShow ? 'show' : 'hide']">
      <div class="back" @click="isShow = false">
        <a-icon type="arrow-left" />
      </div>
      <div class="player-wrap flex-column">
        <div class="play-content">
          <PlayLyric />
        </div>
        <PlayBar class="player-PlayBar" :mini="false" />
      </div>
    </div>
  </transition>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import PlayBar from './PlayBar'
import PlayLyric from './PlayLyric'
export default {
  name: 'Player',
  components: {
    PlayBar,
    PlayLyric
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['showPlayer']),
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
  created() {}
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
  .back {
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px 15px;
    font-size: 16px;
    background: #007acc;
  }
  .play-content {
    flex: 1;
    overflow: hidden;
  }
  .player-wrap {
    height: 100%;
    .player-PlayBar {
      position: relative;
    }
  }
}
.hide {
  transform: translateY(105%);
}
.show {
  transform: none;
}
</style>
