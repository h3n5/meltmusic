<template>
  <div @click="onClickCard" class="playlist-card">
    <div class="img-wrap">
      <img v-lazy="img" />
      <div class="desc-wrap" v-if="desc">
        <span class="desc">{{ desc }}</span>
      </div>
      <!-- <PlayIcon :size="36" class="play-icon" /> -->
    </div>
    <p class="name">{{ name }}</p>
  </div>
</template>

<script>
export default {
  props: ['id', 'img', 'name', 'desc'],
  methods: {
    onClickCard() {
      this.$router.push(`/PlayList/${this.id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.playlist-card {
  position: relative;
  margin-bottom: 20px;
  cursor: pointer;
  .img-wrap {
    position: relative;
    width: 100%;
    padding-top: 100%;
    margin-bottom: 8px;
    border-radius: 4px;
    overflow: hidden;

    img {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .desc-wrap {
      position: absolute;
      padding: 6px;
      left: 0;
      right: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.4);
      transform: translateY(-100%);
      transition: all 0.3s;

      .desc {
        color: #fff;
        font-size: 12px;
      }
    }

    .play-icon {
      opacity: 0;
      position: absolute;
      right: 4px;
      bottom: 4px;
      font-size: 24px;
      transition: all 0.3s;
      color: #fff;
    }

    &:hover {
      .desc-wrap {
        transform: translateY(0);
      }

      .play-icon {
        opacity: 1;
      }
    }
  }

  .name {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
}
</style>
