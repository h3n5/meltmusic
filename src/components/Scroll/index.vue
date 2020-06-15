<template>
  <div class="scroll-wrapper" ref="wrapper">
    <div class="scroll-content">
      <div ref="scroll-content">
        <slot>
          <div class="no-result-body">
            <slot name="nodata">
              <div class="no-result">
                <a-empty />
              </div>
            </slot>
          </div>
        </slot>
      </div>
      <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span class="no-more" v-if="!noData">{{ pullUpTxt }}</span>
          </div>
          <div class="after-trigger" v-else>
            <img class="scroll-loading" :src="require('@/assets/loading.gif')" />
          </div>
        </div>
      </slot>
    </div>
    <slot
      name="pulldown"
      :pullDownRefresh="pullDownRefresh"
      :pullDownStyle="pullDownStyle"
      :beforePullDown="beforePullDown"
      :pulling="pulling"
      :bubbleY="bubbleY"
    >
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble v-show="!noData && isOverFlow" :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="pulling" class="loading">
            <img class="scroll-loading" :src="require('@/assets/loading.gif')" />
          </div>
          <div v-else>
            <span>{{ refreshTxt }}</span>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Bubble from './scroll-bubble'
import { Empty } from 'ant-design-vue'
export default {
  name: 'vue-better-scroll',
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    listenBeforeScroll: {
      type: Boolean,
      default: false
    },
    scrollbar: {
      type: null,
      default: false
    },
    pullDownRefresh: {
      type: null,
      default: () => ({
        threshold: 90,
        stop: 40
      })
    },
    pullUpLoad: {
      type: null,
      default: () => ({
        threshold: 40,
        txt: {
          more: '加载更多',
          noMore: '没有更多数据了'
        }
      })
    },
    startY: {
      type: Number,
      default: 0
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    freeScroll: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: { Bubble, AEmpty: Empty },
  data() {
    return {
      beforePullDown: true,
      isRebounding: false,
      isPullingDown: false,
      pulling: false,
      isPullUpLoad: false,
      pullUpDirty: true, // 此变量用来检查是否加载到了最后一页
      pullDownStyle: '',
      bubbleY: 0,
      reboundPullDownTimer: null,
      afterPullDownTimer: null
    }
  },
  computed: {
    isOverFlow() {
      let wrap = this.$refs['scroll-content'] || {}
      let ctx = this.$refs['wrapper'] || {}
      return wrap.clientHeight >= ctx.clientHeight
    },
    noData() {
      return !!document.querySelector('.scroll-wrapper .no-result')
    },
    pullUpTxt() {
      const moreTxt = (this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more) || '加载更多'
      const noMoreTxt = (this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore) || '没有更多数据了'
      return this.pullUpDirty ? moreTxt : noMoreTxt
    },
    refreshTxt() {
      return (this.pullDownRefresh && this.pullDownRefresh.txt) || '刷新成功'
    }
  },
  created() {
    this.pullDownInitTop = -50
  },
  mounted() {
    const thisWrapper = this.$refs.wrapper
    thisWrapper.firstElementChild.firstElementChild.style.minHeight = thisWrapper.offsetHeight + 'px'
    this.$nextTick(() => {
      this.initScroll()
    })
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      const options = Object.assign({}, this.options, {
        probeType: this.probeType,
        click: this.click,
        scrollY: true, // 下拉刷新组件 只能纵向 不能横向
        scrollX: false,
        scrollbar: this.scrollbar,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad,
        startY: this.startY,
        freeScroll: this.freeScroll
      })
      this.scroll = new BScroll(this.$refs.wrapper, options)
      if (this.listenScroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })
      }
      if (this.listenBeforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('before-scroll-start')
        })
      }

      this.scroll.on('scrollStart', () => {
        this.$emit('scroll-start')
      })
      this.scroll.on('scrollEnd', () => {
        this.$emit('scroll-end')
      })
      if (this.pullDownRefresh) {
        this._initPullDownRefresh()
      }
      if (this.pullUpLoad) {
        this._initPullUpLoad()
      }
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    destroy() {
      this.scroll && this.scroll.destroy()
    },
    // 加载数据后更新
    forceUpdate(dirty) {
      this.$nextTick(() => {
        this.pullUpDirty = dirty
        if (this.pullDownRefresh && this.isPullingDown) {
          this.pulling = false
          this._reboundPullDown().then(() => {
            this._afterPullDown()
          })
        } else if (this.pullUpLoad) {
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.refresh()
        } else {
          this.refresh()
        }
      })
    },
    _initPullDownRefresh() {
      this.scroll.on('pullingDown', () => {
        this.beforePullDown = false
        this.isPullingDown = true
        this.pulling = true
        this.$emit('pulling-down')
      })
      this.scroll.on('scroll', pos => {
        if (this.beforePullDown) {
          this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
          this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
        } else {
          this.bubbleY = 0
        }
        if (this.isRebounding) {
          this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
        }
      })
    },
    _initPullUpLoad() {
      this.scroll.on('pullingUp', e => {
        if (this.pullUpDirty) {
          this.isPullUpLoad = true
          this.$emit('pulling-up', e)
        }
      })
    },
    _reboundPullDown() {
      const { stopTime = 600 } = this.pullDownRefresh
      return new Promise(resolve => {
        this.reboundPullDownTimer = setTimeout(() => {
          this.isRebounding = true
          this.isPullingDown = false
          this.scroll.finishPullUp()
          this.scroll.finishPullDown()
          resolve()
        }, stopTime)
      })
    },
    _afterPullDown() {
      this.afterPullDownTimer = setTimeout(() => {
        this.pullDownStyle = `top:${this.pullDownInitTop}px`
        this.beforePullDown = true
        this.isRebounding = false
        this.refresh()
      }, this.scroll.options.bounceTime)
    }
  },
  destroyed() {
    this.scroll && this.scroll.destroy()
    this.scroll = null
    this.reboundPullDownTimer && clearTimeout(this.reboundPullDownTimer)
    this.reboundPullDownTimer = null
    this.afterPullDownTimer && clearTimeout(this.afterPullDownTimer)
    this.afterPullDownTimer = null
  }
}
</script>

<style lang="less" scoped>
.scroll-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .scroll-content {
    height: calc(~'100% + 1px');
  }
  .no-more {
    text-align: center;
    color: #a3a5a7;
    font-size: 0.88rem;
  }

  .no-more::before {
    content: '';
    height: 1/12.5rem;
    width: 4.8rem;
    background: #d7d7d7;
    display: inline-block;
    vertical-align: middle;
    margin-right: 1.2rem;
  }

  .no-more::after {
    content: '';
    height: 1/12.5rem;
    width: 4.8rem;
    background: #d7d7d7;
    display: inline-block;
    vertical-align: middle;
    margin-left: 1.2rem;
  }
  .no-result-body {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;

    > .no-result {
      width: 22rem;

      > .img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.scroll-loading {
  width: 20px;
  height: 20px;
}
.pulldown-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
}
.pulldown-wrapper .after-trigger {
  margin-top: 10px;
}
.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}
</style>
