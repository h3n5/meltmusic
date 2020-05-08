<template>
  <div class="progress-bar-group" :class="mode">
    <div class="time-indicater">
      <span>{{ start }}</span>
    </div>
    <div class="progress" :style="{ width: indicatorPosition + '%' }">
      <div class="indicater" :style="{ left: indicatorPosition + '%' }"></div>
    </div>
    <div class="time-indicater">
      <span>{{ end }}</span>
    </div>
  </div>
</template>

<script>
import Drag from '@/utils/drag.js'
export default {
  name: 'DiyProgress',
  props: {
    start: {
      type: Number,
      default: 0
    },
    end: {
      type: Number,
      default: 100
    },
    mode: {
      type: String,
      default: 'horizontal',
      validator: e => ['vertical', 'horizontal'].includes(e)
    }
  },
  data() {
    return {
      drag: {}
    }
  },
  computed: {
    indicatorPosition() {
      return (this.start / this.end) * 100
    }
  },
  mounted() {
    this.drag = new Drag('.indicater', '.progress')
    let _this = this
    this.drag.on('move', percent => {
      _this.$emit('move', percent)
    })
    this.drag.on('end', percent => {
      _this.$emit('end', percent)
    })
    this.drag.on('click', percent => {
      _this.$emit('click', percent)
    })
  },
  beforeDestroy() {
    this.drag = null
  }
}
</script>

<style lang="less" scoped>
.vertical {
  height: 150px;
  width: 100%;
  display: flex;
  flex-flow: column-reverse nowrap;
  align-items: center;
  .time-indicater {
    font-size: 12px;
    span {
      padding: 0 10px;
    }
  }
  .progress {
    width: 2px;
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
      bottom: 0;
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
.horizontal {
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
