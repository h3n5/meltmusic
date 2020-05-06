<template>
  <div class="playlist-cards flex-column ">
    <h3>我创建的歌单</h3>
    <div class="flex-row flex-wrap">
      <PlayListItem
        class="PlayListItem"
        v-for="item in create"
        :desc="`播放量：${item.playCount}`"
        :id="item.id"
        :img="item.coverImgUrl"
        :key="item.id"
        :name="item.name"
      />
    </div>
    <h3>我收藏的歌单</h3>
    <div class="flex-row flex-wrap">
      <PlayListItem
        class="PlayListItem"
        v-for="item in collect"
        :desc="`播放量：${item.playCount}`"
        :id="item.id"
        :img="item.coverImgUrl"
        :key="item.id"
        :name="item.name"
      />
    </div>
  </div>
</template>
<script>
import { userPlaylist } from '@/api'
import PlayListItem from '@/components/PlayListItem'
export default {
  name: 'SongList',
  components: {
    PlayListItem
  },
  data() {
    return {
      collect: [],
      create: []
    }
  },
  async created() {
    let user = this.$store.state.user
    if (user) {
      let { playlist = [] } = await userPlaylist({ uid: user.userId })
      this.create = playlist.filter(v => v.creator.userId === user.userId)
      this.collect = playlist.filter(v => v.creator.userId !== user.userId)
    }
  }
}
</script>
<style lang="less">
.playlist-cards {
  .PlayListItem {
    flex-basis: calc(90% / 7);
    margin-right: calc(10% / 7);
    overflow: hidden;
  }
}
</style>
