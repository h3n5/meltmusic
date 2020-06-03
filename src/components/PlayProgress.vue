<template>
  <DiyProgress :start="currentTime" :end="$music.durationTime" @click="click" @move="move" @end="end">
    <span slot="start">{{ currentTime | dateFormat }}</span>
    <span slot="end">{{ $music.durationTime | dateFormat }}</span>
  </DiyProgress>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import DiyProgress from '@/components/DiyProgress'
export default {
  name: 'PlayProgress',
  components: {
    DiyProgress
  },
  data() {
    return {}
  },
  computed: {
    ...mapState([
      'audio',
      'change',
      'playing',
      'loading',
      'songList',
      'playType',
      'currentTime',
      'currentIndex',
      'prBufferedTime',
      'tmpCurrentTime',
      'prCurrentTime'
    ])
  },
  filters: {
    dateFormat(value) {
      value = Math.round(value)
      let left = parseInt(value / 60) < 10 ? '0' + parseInt(value / 60) : parseInt(value / 60)
      let right = value % 60 < 10 ? '0' + (value % 60) : value % 60
      return left + ':' + right
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(['setCurrentTime', 'setisCurrentTime']),
    click(percent) {
      let time = Math.round(this.$music.durationTime * percent)
      this.setisCurrentTime(true)
      this.setCurrentTime(time)
      this.$music.setCurrentTime(time)
    },
    move(percent) {
      let time = Math.round(this.$music.durationTime * percent)
      this.setisCurrentTime(false)
      this.setCurrentTime(time)
    },
    end(percent) {
      let time = Math.round(this.$music.durationTime * percent)
      this.setisCurrentTime(true)
      this.setCurrentTime(time)
      this.$music.setCurrentTime(time)
    }
  },
  beforeDestroy() {
    this.drag = null
  }
}
</script>

<style lang="less" scoped>
.progress-bar-group {
  height: 30px;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  .time-indicater {
    line-height: 30px;
    height: 30px;
    font-size: 12px;
    flex-basis: 50px;
    // color: #fff;
    span {
      padding: 0 10px;
    }
  }
  .progress {
    height: 2px;
    background: #f1f1f1;
    flex: 1 1 auto;
    position: relative;
    box-sizing: border-box;
    .indicater {
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 16px;
      background: #f1f1f1;
      top: -7px;
      &::after {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 4px;
        background: #999;
        top: 6px;
        left: 6px;
        position: absolute;
      }
    }
  }
}
</style>
