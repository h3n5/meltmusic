<template>
  <div class="music-cell" :class="{ 'music-cell-link': inLink, 'music-cell-hasavatar': avatar }">
    <img class="music-cell-avatar" v-lazy="avatar" alt="avatar" />
    <div class="music-cell-ctx flex-column">
      <div class="music-cell-ctx-title one-line">{{ title }}</div>
      <div class="music-cell-ctx-content">{{ content }}</div>
    </div>
    <a-icon class="music-cell-right" type="right" />
  </div>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    inLink: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  data() {
    return {}
  },

  methods: {}
}
</script>

<style lang="less" scoped>
.music-cell {
  position: relative;
  &-ctx {
    padding-right: 15px;
    &-title {
      font-weight: bold;
    }
  }
  &-hasavatar {
    padding-left: 50px;
  }
  &-avatar {
    position: absolute;
    left: 0;
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
  &-link {
    .music-cell-right {
      display: block;
    }
  }
  &-right {
    display: none;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
