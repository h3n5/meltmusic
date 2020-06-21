<script>
export default {
  name: 'Ticker',
  props: {
    text: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      default: 0,
      validator: (v) => (v >= 0 || v <= 100) && !Number.isNaN(v),
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
  computed: {
    style() {
      return {
        'background-position-x': `-${this.value}%`,
      }
    },
  },
  render(h) {
    return h(this.tag, { class: 'ticker', style: this.style }, this.text)
  },
}
</script>
<style lang="less">
.ticker {
  width: fit-content;
  background-clip: text;
  background-image: linear-gradient(to right, #fff, #fff 50%, red 50%, red 100%);
  background-size: 200%;
  -webkit-text-fill-color: transparent;
}
</style>
