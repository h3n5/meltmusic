<template>
  <div :class="[mini ? 'flex-row mini' : 'flex-column no-mini', 'playBar']" v-if="getMusic">
    <div class="play-left flex-row">
      <div class="song-pic" @click="triggerPlayer">
        <img class="size-contain" v-lazy="getMusic.albumPic" />
      </div>
      <div class="song-info flex-column flex-center">
        <p class="song-al flex-column flex-1 flex-center">
          {{ getMusic.name }}
        </p>
        <p class="song-name flex-1 flex-center">
          {{ getMusic.album.name }}
        </p>
      </div>
    </div>
    <div class="play-middle">
      <PlayProgress class="play-progress" />
    </div>
    <div class="play-right">
      <a-icon type="step-backward" @setSongNext="setSongNext(false)" />
      <a-icon :type="type" @click="$music.toggle()" />
      <a-icon type="step-forward" @setSongNext="setSongNext(true)" />
      <a-icon type="swap" />
      <a-icon type="redo" />
      <a-icon type="sound" />
      <a-icon v-if="!mini" type="menu-unfold" @click="$emit('triggerSongList')" />
    </div>
  </div>
</template>
<script>
import PlayProgress from './PlayProgress'
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  name: 'PlayBar',
  components: {
    PlayProgress
  },
  props: {
    mini: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['paused']),
    ...mapGetters(['getMusic']),
    type() {
      return this.paused ? 'caret-right' : 'pause'
    }
  },
  methods: {
    ...mapMutations(['triggerPlayer', 'setSongNext'])
  }
}
</script>
<style lang="less">
.no-mini {
  position: relative;
  padding: 20px;
  .song-pic {
    .img-wrap(100px);
  }
}

.mini {
  position: fixed;
  bottom: 0;
  left: 0;
  .play-left {
    .song-pic {
      .img-wrap(62px);
    }
  }
}
.playBar {
  width: 100%;
  background: var(--playbar-bgcolor);
  background-size: cover;
  p {
    margin: 0;
  }

  .play-left {
    .song-info {
      padding: 10px;
    }
    .song-al {
      width: 100%;
      font-size: 20px;
      align-items: flex-start;
    }
    .song-name {
      font-size: 12px;
    }
  }
  .play-middle {
    .flex-center;
    flex: 1;
    padding: 10px;
  }
  .play-right {
    .flex-center;
    > i {
      font-size: 26px;
      margin-right: 30px;
    }
  }
}
</style>
