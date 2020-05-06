<template>
  <div class="search-song-list">
    <h3 class="ssl-tilte">
      <span class="keywords">{{ search }}</span>
      找到{{ count }}个结果
    </h3>
    <SongTable class="ssl-table" :songs="list" :format="format" @click="goPlay" />
    <a-pagination class="ssl-pagination" v-model="current" :total="count" showLessItems :defaultCurrent="0" />
  </div>
</template>
<script>
import SongTable from '@/components/SongTable'
import moment from 'moment'
import { Pagination } from 'ant-design-vue'
import { mapActions } from 'vuex'
export default {
  name: 'Song',
  components: {
    SongTable,
    APagination: Pagination
  },
  props: {
    list: Array,
    count: Number,
    search: String,
    offset: Number
  },
  computed: {
    current: {
      get() {
        return this.offset
      },
      set(v) {
        this.$emit('offsetChangge', v)
      }
    }
  },
  methods: {
    ...mapActions(['playMusicById']),
    format(v, i) {
      v.index = i + 1
      v.album.picUrl = v.album.artist.img1v1Url
      v.al_name = v.album.name
      v.ar_name = v.artists.map(v => v.name).join(',')
      let duration = `${
        moment(v.duration).minutes() < 9 ? '0' + moment(v.duration).minutes() : moment(v.duration).minutes()
      }:${moment(v.duration).seconds() < 9 ? '0' + moment(v.duration).seconds() : moment(v.duration).seconds()}`
      v.duration = duration
      return v
    },
    async goPlay(v) {
      let res = await this.playMusicById(v)
      this.$music.play(res)
    }
  }
}
</script>
<style lang="less" scope>
.search-song-list {
  .ssl-tilte {
    margin-bottom: 10px;
    .keywords {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .ssl-table {
    padding: 10px;
  }
  .ssl-pagination {
    text-align: right;
    padding: 0 10px;
  }
}
</style>
