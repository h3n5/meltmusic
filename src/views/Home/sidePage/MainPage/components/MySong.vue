<template>
  <SongTable :songs="songs" @click="jumpRouter" />
</template>
<script>
import { apilikelist, getsongDetail } from '@/api'
import SongTable from '@/components/SongTable'
export default {
  name: 'MySong',
  components: {
    SongTable
  },
  data() {
    return {
      songs: []
    }
  },
  async created() {
    let user = this.$store.state.user
    if (user) {
      let { ids = [] } = await apilikelist(user.userId)
      let { songs = [] } = await getsongDetail(ids.join(','))
      this.songs = songs
    }
  },
  methods: {
    jumpRouter(v) {
      console.log('AutoConsole: jumpRouter -> v', v)
    }
  }
}
</script>
<style lang="less">
.SongTable {
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 4px;
    background: none;
  }
  .img-wrap {
    position: relative;
    height: 60px;
    width: 60px;
    display: inline-block;
    img {
      border-radius: 4px;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
