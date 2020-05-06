<template>
  <div class="flex-colomn MainPage">
    <h2>我的音乐</h2>
    <a-tabs v-model="defaultActiveKey">
      <a-tab-pane :tab="item.text" v-for="item in tabList" :key="item.key"></a-tab-pane>
    </a-tabs>
    <keep-alive>
      <component class="MainPage-component" :is="defaultActiveKey"></component>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: 'MainPage',
  components: {
    SongList: () => import('./components/SongList'),
    MySong: () => import('./components/MySong')
  },
  data() {
    return {
      defaultActiveKey: 'SongList',
      tabList: [
        {
          key: 'SongList',
          text: '我的歌单'
        },
        {
          key: 'MySong',
          text: '我喜欢的音乐'
        }
      ]
    }
  },
  created() {}
}
</script>
<style lang="less">
.MainPage {
  height: 100%;
  .MainPage-component {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
