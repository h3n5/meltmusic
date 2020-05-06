<template>
  <div class="logo">
    <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="$emit('trigger')" />
  </div>
</template>
<script>
export default {
  name: 'trigger',
  props: {
    collapsed: Boolean
  },
  data() {
    return {}
  },
  created() {}
}
</script>
