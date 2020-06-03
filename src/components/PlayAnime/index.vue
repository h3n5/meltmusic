<template>
  <div class="play-anime">
    <canvas id="canvasgraph" class="fullfix" width="300" height="300"></canvas>
  </div>
</template>
<script>
import Circle from './mode/circle'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PlayAnime',
  data() {
    return {
      circle: null
    }
  },
  computed: {
    ...mapState(['paused', 'albumPic']),
    ...mapGetters(['getMusic'])
  },
  watch: {
    albumPic: 'changeAlubm'
  },
  mounted() {
    if (this.getMusic) {
      let { album } = this.getMusic
      this.init(album.picUrl)
      this.$watch('paused', () => {
        this.circle.switch(!this.paused)
      })
    }
  },
  methods: {
    init(v) {
      this.circle = new Circle({
        id: '#canvasgraph',
        width: 500,
        height: 500,
        albumWidth: 300,
        albumHeight: 300,
        album: v || require('@/assets/img/player-bar.png'),
        audio: this.$music.audio
      })
    },
    changeAlubm() {
      if (this.albumPic) {
        this.init(this.albumPic)
        this.circle.switch(true)
      }
    }
  }
}
</script>
<style lang="less">
.play-anime {
  position: relative;
}
.fullfix {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
