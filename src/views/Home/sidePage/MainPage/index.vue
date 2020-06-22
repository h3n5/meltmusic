<template>
  <div class="flex-column main-page">
    <div class="menu-card flex-row">
      <div class="recomment-list" v-for="(item, index) in reComment" :key="index">
        <div>
          <img class="img-block" v-lazy="item.picUrl" alt="reComment" />
        </div>
        <div class="img-info one-line">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="flex-row main-page-ctx">
      <div class="flex-right menu-card">
        <Cell
          v-for="(item, index) in reCommentSongs.slice(9, 23)"
          :key="index"
          :inLink="false"
          :avatar="item.album.picUrl"
          :title="item.name"
          :content="`${item.reason}`"
        />
      </div>
      <div class="flex-left">
        <div class="flex-row">
          <div class="a-col" v-for="(item, index) in reCommentSongs.slice(0, 9)" :key="index">
            <img class="all100" v-lazy="item.album.picUrl" />
            <div class="desc-wrap">
              <span class="desc">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PlayBar />
    <!-- <h2 class="font-color">我的音乐</h2>
    <a-tabs v-model="defaultActiveKey">
      <a-tab-pane :tab="item.text" v-for="item in tabList" :key="item.key"></a-tab-pane>
    </a-tabs>
    <keep-alive>
      <component class="MainPage-component" :is="defaultActiveKey"></component>
    </keep-alive> -->
  </div>
</template>
<script>
import { getRecommentList, recommendSongs } from '@/api'
import PlayBar from '@/components/PlayBar'
import Cell from '@/components/Cell'
export default {
  name: 'MainPage',
  components: {
    PlayBar,
    Cell
    // SongList: () => import('./components/SongList'),
    // MySong: () => import('./components/MySong')
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
      ],
      reComment: [],
      reCommentSongs: []
    }
  },
  created() {
    getRecommentList().then(res => {
      if (res.code === 200) {
        this.reComment = res.recommend
      }
    })
    recommendSongs().then(res => {
      if (res.code === 200) {
        this.reCommentSongs = res.recommend
      }
    })
  }
}
</script>
<style lang="less">
.main-page {
  flex: 1;
  margin-right: 20px;
  position: relative;
  .MainPage-component {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 100px;
  }
  .menu-card {
    overflow-y: hidden;
    .recomment-list {
      width: 150px;
      margin-right: 15px;
    }
    .img-block {
      height: 150px;
      width: 150px;
      border-radius: 7px;
    }
    .img-info {
      padding: 10px 0;
    }
  }
  .main-page-ctx {
    flex: 1;
    padding-top: 20px;
    padding-bottom: 120px;
    .flex-left {
      width: 450px;
      margin-left: 20px;
      .flex-row {
        flex-wrap: wrap;
      }
    }
    .flex-right {
      flex: 2;
      padding: 10px;
      display: flex;
      flex-flow: row wrap;
      > div.music-cell {
        margin-bottom: 10px;
        width: 50%;
      }
    }
    .a-col {
      position: relative;
      overflow: hidden;
      width: 150px;
      .desc-wrap {
        position: absolute;
        padding: 6px;
        left: 0;
        right: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.4);
        transform: translateY(-100%);
        transition: all 0.3s;
        .desc {
          color: #fff;
          font-size: 12px;
        }
      }
      &:hover {
        > .desc-wrap {
          transform: translateY(0);
        }
      }
    }
  }
}
</style>
