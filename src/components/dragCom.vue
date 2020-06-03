<template>
  <div class="wrap" :class="randomClass">
    <div class="progress-bar-group" :class="mode">
      <div class="time-indicater">
        <span>{{ start }}</span>
      </div>
      <div class="progress">
        <div class="progress-line">
          <div v-if="buffStart" class="progress-buff pa" :style="buffPosition"></div>
          <div class="progress-bar pa" :style="progressPosition"></div>
          <div class="indicater" :style="indicatorPosition"></div>
        </div>
      </div>
      <div class="time-indicater" :style="indicaterStyle">
        <span>{{ end }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Drag from '@/utils/drag2.js'
export default {
  name: 'DiyProgress',
  props: {
    start: {
      type: Number,
      default: 50
    },
    end: {
      type: Number,
      default: 100
    },
    mode: {
      type: String,
      default: 'horizontal',
      validator: e => ['vertical', 'horizontal'].includes(e)
    },
    buffStart: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      drag: {}
    }
  },
  computed: {
    indicatorPosition() {
      let indicatorPosition = (this.start / this.end) * 100
      if (this.mode === 'horizontal') {
        return { left: indicatorPosition + '%' }
      } else {
        return { bottom: indicatorPosition + '%' }
      }
    },
    progressPosition() {
      let indicatorPosition = (1 - this.start / this.end) * 100
      if (this.mode === 'horizontal') {
        return { right: indicatorPosition + '%' }
      } else {
        return { top: indicatorPosition + '%' }
      }
    },
    buffPosition() {
      let indicatorPosition = (1 - this.buffStart / this.end) * 100
      if (this.mode === 'horizontal') {
        return { right: indicatorPosition + '%' }
      } else {
        return { top: indicatorPosition + '%' }
      }
    },
    indicaterStyle() {
      if (this.mode === 'horizontal') {
        return { paddingLeft: '20px' }
      } else {
        return { paddingBottom: '20px' }
      }
    },
    randomClass() {
      return (
        'random-' +
        Math.random()
          .toString()
          .slice(2, 14)
      )
    }
  },
  mounted() {
    this.drag = new Drag(`.${this.randomClass} .indicater`, `.${this.randomClass} .progress`, this.mode)
    let _this = this
    this.drag.on('move', percent => {
      _this.$emit('move', percent)
      _this.$emit('percent', percent)
    })
    this.drag.on('end', percent => {
      console.log('AutoConsole: mounted -> end')
      _this.$emit('end', percent)
      _this.$emit('percent', percent)
    })
    this.drag.on('click', percent => {
      console.log('AutoConsole: mounted -> click')
      _this.$emit('click', percent)
      _this.$emit('percent', percent)
    })
  },
  beforeDestroy() {
    this.drag.destory()
    this.drag = null
  }
}
</script>

<style lang="less" scoped>
.wrap {
  width: 300px;
  height: 300px;
  margin: auto;
}
.pa {
  position: absolute;
}
.progress {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50%;
  .progress-line {
    height: 2px;
    background: #f1f1f1;
    width: 100%;
    position: relative;
  }
  .progress-bar {
    background: #63d5b8;
  }
  .progress-buff {
    background: #c1c1c1;
  }
  .progress-bar,
  .progress-buff {
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
}
.vertical {
  height: 100%;
  width: 30px;
  display: flex;
  flex-flow: column-reverse nowrap;
  align-items: center;
  .time-indicater {
    font-size: 12px;
    span {
      cursor: default;
      padding: 0 10px;
    }
  }
  .progress {
    width: 50%;
    flex: 1 1 auto;
    position: relative;
    .progress-line {
      width: 2px;
      height: 100%;
    }
    .indicater {
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 16px;
      background: #f1f1f1;
      bottom: 0;
      left: -7px;
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
      cursor: default;
      padding: 0 10px;
    }
  }
  .progress {
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
