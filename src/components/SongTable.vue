<template>
  <a-table
    class="SongTable"
    :dataSource="list"
    :pagination="false"
    :showHeader="true"
    rowKey="index"
    :customRow="customRow"
  >
    <a-table-column title="" dataIndex="index" align="center" />
    <a-table-column title="" dataIndex="album" :width="100" align="center">
      <template slot-scope="item">
        <span class="img-wrap">
          <img v-lazy="item.picUrl" />
        </span>
      </template>
    </a-table-column>
    <a-table-column title="歌名" dataIndex="name" />
    <a-table-column title="歌手" dataIndex="ar_name" />
    <a-table-column title="专辑" dataIndex="al_name" />
    <a-table-column title="时长" dataIndex="duration" />
  </a-table>
</template>
<script>
import { Table } from 'ant-design-vue'
import moment from 'moment'
const defaultFormat = function(v, i) {
  v.index = i + 1
  v.album = v.al
  v.al_name = v.al.name
  v.ar_name = v.ar.map(v => v.name).join(',')
  v.duration = `${moment(v.dt).minutes() < 9 ? '0' + moment(v.dt).minutes() : moment(v.dt).minutes()}:${
    moment(v.dt).seconds() < 9 ? '0' + moment(v.dt).seconds() : moment(v.dt).seconds()
  }`
  return v
}
export default {
  name: 'SongTable',
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    format: {
      type: Function,
      default: defaultFormat
    }
  },
  computed: {
    list() {
      return this.songs.map(this.format)
    }
  },
  components: {
    ATable: Table,
    ATableColumn: Table.Column
  },
  methods: {
    customRow(record) {
      return {
        on: {
          click: () => this.$emit('click', record)
        }
      }
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
