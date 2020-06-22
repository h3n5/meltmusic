<template>
  <div :class="[mini ? 'flex-row mini' : 'flex-column no-mini', 'playBar']" v-if="getMusic">
    <div class="play-left flex-row" v-show="mini">
      <div class="song-pic" @click="triggerPlayer">
        <img class="size-contain" v-lazy="getMusic.albumPic || getMusic.album.picUrl" />
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
      <Tooltip title="上一曲">
        <a-icon type="step-backward" @click="setSongNext(false)" />
      </Tooltip>
      <Tooltip :title="paused ? '播放' : '暂停'">
        <a-icon :type="type" @click="$music.toggle()" />
      </Tooltip>
      <Tooltip title="下一曲">
        <a-icon type="step-forward" @click="setSongNext(true)" />
      </Tooltip>
      <Tooltip title="单曲循环" v-show="mode === 3">
        <a-icon :component="repeat" @click="setMode(2)"></a-icon>
      </Tooltip>
      <Tooltip title="随机" v-show="mode === 2">
        <a-icon :component="random" @click="setMode(1)"></a-icon>
      </Tooltip>
      <Tooltip title="歌单循环" v-show="mode === 1">
        <a-icon type="redo" @click="setMode(3)" />
      </Tooltip>
      <Tooltip>
        <DiyProgress :start="start" mode="vertical" slot="title" @click="gosetVolume" />
        <a-icon type="sound" />
      </Tooltip>

      <a-icon v-if="!mini" type="menu-unfold" @click="$emit('triggerSongList')" />
    </div>
  </div>
</template>
<script>
import PlayProgress from './PlayProgress'
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import repeat from '@/assets/svg/repeat-one-line.svg'
import random from '@/assets/svg/random.svg'
import { Tooltip } from 'ant-design-vue'
import DiyProgress from '@/components/DiyProgress'
export default {
  name: 'PlayBar',
  components: {
    PlayProgress,
    Tooltip,
    DiyProgress
  },
  props: {
    mini: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      repeat,
      random
    }
  },
  computed: {
    ...mapState(['paused', 'mode', 'volume']),
    ...mapGetters(['getMusic']),
    type() {
      return this.paused ? 'caret-right' : 'pause'
    },
    start() {
      return Math.round(this.volume * 100)
    }
  },
  methods: {
    ...mapMutations(['triggerPlayer', 'setMode', 'setVolume']),
    ...mapActions(['setSongNext']),
    gosetVolume(v) {
      this.setVolume(Number(v.toFixed(2)))
    }
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
.playBar {
  // width: 100%;
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
      font-weight: bold;
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
      margin-right: 15px;
      border-radius: 50%;
      padding: 10px;

      &:hover {
        background-color: #2c3e50;
        color: #fff;
      }
    }
  }
}
.mini {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f6f9fb;
  margin: 0 55px;
  padding: 0 50px;
  &::before {
    content: '';
    position: absolute;
    height: 110px;
    width: 110px;
    left: -55px;
    background: #f6f9fb;
    border-radius: 50%;
  }
  &::after {
    content: '';
    position: absolute;
    height: 110px;
    width: 110px;
    right: -55px;
    background: #f6f9fb;
    border-radius: 50%;
  }
  .play-left {
    .song-pic {
      position: absolute;
      left: -45px;
      top: 10px;
      .img-wrap(90px);
      > img {
        border-radius: 50%;
      }
    }
  }
  .play-progress {
    .progress {
      background: #2c3e50;
      &::after {
        background: #f0f0f0;
      }
      .indicater {
        background: #2c3e50;
        &::after {
          background: #f0f0f0;
        }
      }
    }
  }
}
</style>
