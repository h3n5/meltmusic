<template>
  <div class="menu-card">
    <div class="menu-bar-card-title" @click="show = !show">
      {{ title }}
      <a-icon :type="show ? 'down' : 'up'" />
    </div>
    <div class="cell-box" :class="{ 'cell-box-hidden': !show }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardList',
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    showList: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  data() {
    return {
      show: this.showList
    }
  },

  methods: {}
}
</script>

<style lang="less">
.menu-card {
  color: var(--font-color-grey);
  padding: 24px;
  background: var(--card-color);
  padding-bottom: 0;
  border-radius: 6px;
  .cell-box {
    transition: all 0.5s;
    overflow: auto;
    max-height: 1000px;
    > div {
      margin-bottom: 10px;
    }
    &-hidden {
      max-height: 0;
    }
  }
  .menu-bar-card-title {
    cursor: default;
    font-weight: bold;
    padding-bottom: 15px;
  }
  // &:first-child {
  //   border-radius: 7px 7px 0 0;
  // }
}
</style>
