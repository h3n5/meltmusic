<template>
  <div class="left-menu">
    <div class="menu-logo">
      <img class="menu-logo-img" src="@/assets/img/icon.png" alt="logo" />
      <span class="menu-logo-text">Music</span>
      <div class="routes-history">
        <a-icon type="left" @click.native="$router.go(-1)" />
        <a-icon type="right" @click.native="$router.go(1)" />
      </div>
    </div>
    <div class="menu-bar">
      <div class="menu-card">
        <CardList title="我创建的歌单">
          <Cell
            v-for="(item, index) in create"
            :key="index"
            :avatar="item.coverImgUrl"
            :title="item.name"
            :content="`${item.trackCount}首歌曲`"
          />
        </CardList>
      </div>
      <div class="menu-card">
        <CardList title="我收藏的歌单">
          <Cell
            v-for="(item, index) in collect"
            :key="index"
            :avatar="item.coverImgUrl"
            :title="item.name"
            :content="`${item.trackCount}首歌曲`"
          />
        </CardList>
      </div>
    </div>
  </div>
</template>

<script>
import Cell from '@/components/Cell'
import { mapState } from 'vuex'
import { userPlaylist } from '@/api'
import CardList from './child/CardList'
export default {
  name: 'LeftMenu',
  components: {
    Cell,
    CardList
  },
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      collect: [],
      create: [],
      showCreate: true
    }
  },
  async created() {
    let user = this.user
    if (user) {
      let { playlist = [] } = await userPlaylist({ uid: user.userId })
      this.create = playlist.filter(v => v.creator.userId === user.userId)
      this.collect = playlist.filter(v => v.creator.userId !== user.userId)
    }
  }
}
</script>

<style lang="less">
.left-menu {
  .menu-logo {
    position: relative;
    padding: 20px 0 20px 50px;
    box-sizing: content-box;
    &-img {
      height: 50px;
      width: 50px;
      position: absolute;
      left: 0;
    }
    &-text {
      font-weight: bold;
      font-size: 20px;
      line-height: 50px;
      color: #76c2af;
      padding-left: 10px;
    }
  }
  .routes-history {
    padding-left: 20px;
    .flex-center;
    display: inline-flex;
    > i {
      height: 100%;
      padding: 10px;
      color: #76c2af;
      .flex-center;
    }
  }
  .menu-bar {
  }
}
</style>
