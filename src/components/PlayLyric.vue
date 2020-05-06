<template>
  <div class="lrc">
    <scroll
      class="lrc-wrapper"
      ref="scroll"
      :pullDownRefresh="false"
      :pullUpLoad="false"
      @scroll-start="lyricScroll = false"
      @scroll-end="lyricScroll = true"
    >
      <div class="lrc-content content">
        <div class="lrc-box">
          <div class="lrc-list" :class="{ 'lrc-select': item.show }" v-for="(item, index) in lyric" :key="index">
            <p>{{ item.txt }}</p>
            <p v-if="lyric.hasCN">{{ item.txtCN }}</p>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import scroll from './Scroll/index.vue'
import { mapState } from 'vuex'
export default {
  name: 'PlayLrcic',
  components: {
    scroll
  },
  data() {
    return {
      lyric: {},
      lyricScroll: false
    }
  },
  computed: {
    ...mapState(['lyricObj', 'lyricTxt', 'lyricTxtCN', 'durationTime'])
  },
  watch: {
    lyricObj: {
      handler(v) {
        this.lyric = v.lines
          ? v.lines.map(v => {
              v.show = false
              return v
            })
          : []
      },
      immediate: true
    },
    currentTime(v) {
      let currentTime = v
      let duration = this.durationTime
      let percent = currentTime / duration
      if (percent >= 1) {
        percent = 0
        this.$refs.scroll.scrollTo(0, 0)
      }
      let Lyric = this.lyric
      for (let i = 0; i < Lyric.length - 1; i++) {
        this.lyric[i].show = false
        if (v * 1000 > Lyric[i].time && v * 1000 < Lyric[i + 1].time) {
          this.lyric[i].show = true
          if (this.lyricScroll && document.querySelector('.lrc-select')) {
            this.$refs.scroll.scrollToElement('.lrc-select', 200, true, true)
          }
        }
      }
    }
  },
  created() {}
}
</script>
<style lang="less" scope>
.lrc {
  font-size: 14px;
  padding: 20px 0;
  color: #fefefe;
  text-align: center;
  height: 100%;
  .wrapper {
    height: 100%;
    background: transparent;
  }
  .lrc-content {
    .lrc-box {
      .lrc-list {
        font-size: 14px;
        padding-bottom: 10px;
        color: hsla(0, 0%, 100%, 0.6);
      }
      .lrc-select {
        > p {
          font-size: 16px;
          color: #ff2d55;
        }
      }
      .lrc-now {
        font-size: 16px;
        color: #fefefe;
      }
    }
  }
}
</style>
