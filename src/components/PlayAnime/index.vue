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
    ...mapState(['paused']),
    ...mapGetters(['getMusic'])
  },
  mounted() {
    let { album } = this.getMusic
    this.circle = new Circle({
      id: '#canvasgraph',
      width: 300,
      height: 300,
      albumWidth: 150,
      albumHeight: 150,
      album: album.picUrl || require('@/assets/img/player-bar.png'),
      audio: this.$music.audio
    })
    this.$watch('paused', () => {
      this.circle.switch(!this.paused)
    })
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
