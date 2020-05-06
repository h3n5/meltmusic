<template>
  <div class="comment">
    <a-empty v-if="!shouldHotCommentShow && !shouldCommentShow">还没有评论哦~</a-empty>
    <template v-else>
      <div class="block" v-if="shouldHotCommentShow">
        <p class="title">精彩评论</p>
        <Comment border :comment="comment" :key="comment.id" v-for="comment in hotComments" />
      </div>
      <div class="block" v-if="shouldCommentShow">
        <p class="title" ref="commentTitle">
          最新评论
          <span class="count">({{ total }})</span>
        </p>
        <Comment border :comment="comment" :key="comment.id" v-for="comment in comments" />
      </div>
      <Pagination class="pagination" v-model="pageIndex" :pageSize="PAGE_SIZE" :total="total" @change="onPageChange" />
    </template>
  </div>
</template>

<script>
import { Pagination } from 'ant-design-vue'
import Comment from './comment'
import { getSongComment, getPlaylistComment, getHotComment, getMvComment } from '@/api'
const SONG_TYPE = 'song'
const PLAYLIST_TYPE = 'playlist'
const MV_TYPE = 'mv'
export default {
  name: 'Comments',
  components: {
    Comment,
    Pagination
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: SONG_TYPE
    }
  },
  data() {
    return {
      pageIndex: 0,
      PAGE_SIZE: 20,
      loading: false,
      hotComments: [],
      comments: [],
      total: 0
    }
  },
  watch: {
    id: {
      handler(newId) {
        if (newId) {
          this.pageIndex = 0
          this.getComment()
        }
      },
      immediate: true
    }
  },
  computed: {
    shouldHotCommentShow() {
      return this.hotComments.length > 0 && this.currentPage === 1
    },
    shouldCommentShow() {
      return this.comments.length > 0
    }
  },
  methods: {
    async getComment() {
      this.loading = true
      const commentRequestMap = {
        [PLAYLIST_TYPE]: getPlaylistComment,
        [SONG_TYPE]: getSongComment,
        [MV_TYPE]: getMvComment
      }
      const commentRequest = commentRequestMap[this.type]
      const { hotComments = [], comments = [], total } = await commentRequest({
        id: this.id,
        pageSize: this.PAGE_SIZE,
        offset: this.pageIndex
      })
      // 歌单的热评需要单独请求接口获取
      if (this.type === PLAYLIST_TYPE && this.currentPage === 1) {
        const { hotComments: exactHotComments = [] } = await getHotComment({
          id: this.id,
          type: 2 // 歌单type
        })
        this.hotComments = exactHotComments
      } else {
        this.hotComments = hotComments
      }
      this.comments = comments
      this.total = total
      this.$emit('update', { comments, hotComments, total })
    },
    async onPageChange() {
      await this.getComment()
    }
  }
}
</script>

<style lang="less" scoped>
.block {
  margin-bottom: 48px;
  .title {
    font-size: 14px;
    margin-bottom: 4px;
    .count {
      font-size: 12px;
    }
  }
}
.pagination {
  text-align: right;
}
</style>
