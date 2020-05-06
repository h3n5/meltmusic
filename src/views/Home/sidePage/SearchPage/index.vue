<template>
  <div class="search-page">
    <div class="search-input">
      <a-input-search v-model="search.keywords" @change="updatesearch" @pressEnter="searchClick" @click="searchClick" />
    </div>
    <div class="search-tab" v-show="list.length">
      <a-tabs v-model="defaultActiveKey">
        <a-tab-pane :tab="item.text" v-for="item in tabList" :key="item.key"></a-tab-pane>
      </a-tabs>
      <keep-alive>
        <component
          :is="defaultActiveKey"
          :list="list"
          :count="count"
          :search="search.keywords"
          :offset="search.offset"
          @offsetChangge="offsetChangge"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { Input } from 'ant-design-vue'
import Song from './components/Song'
import { searchMusic } from '@/api'
import utils from '@/utils'
export default {
  name: 'SearchPage',
  components: {
    AInputSearch: Input.Search,
    Song
  },
  data() {
    return {
      defaultActiveKey: 'Song',
      tabList: [{ text: '歌曲', key: 'Song' }],
      search: { keywords: 'and i am home', limit: 10, offset: 0 },
      count: 0,
      list: []
    }
  },
  created() {},
  methods: {
    updatesearch: utils.throttle(function(e) {
      this.searchClick()
      this.search.keywords = e.target.value
    }, 1000),
    async searchClick() {
      let res = await searchMusic(this.search)
      this.count = res.result.songCount
      this.list = res.result.songs
    },
    offsetChangge(e) {
      this.search.offset = e
      this.searchClick()
    }
  }
}
</script>
<style lang="less" scope>
.search-page {
  height: 100%;
  overflow-y: auto;
  .search-input {
    padding: 20px 30px;
  }
}
</style>
