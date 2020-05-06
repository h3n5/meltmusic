<template>
  <div class="comment" v-if="comment">
    <div class="avatar">
      <img v-lazy="$utils.setSizeImgUrl(comment.user.avatarUrl, 80)" />
    </div>
    <div :class="{ border }" class="content">
      <p class="comment-text">
        <span class="username">{{ comment.user.nickname }}:</span>
        <span class="text">{{ comment.content }}</span>
      </p>
      <div class="replied" v-if="comment.beReplied.length">
        <p class="comment-text">
          <span class="username">{{ comment.beReplied[0].user.nickname }}:</span>
          <span class="text">{{ comment.beReplied[0].content }}</span>
        </p>
      </div>
      <div class="bottom">
        <span class="date">{{ $utils.formatDate(comment.time) }}</span>
        <div class="actions">
          <a-icon type="like" style="fontSize:12px" />
          {{ comment.likedCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['comment', 'border']
}
</script>

<style lang="less" scoped>
.img-wrap(@size:60px) {
  width: @size;
  height: @size;
  > img {
    height: 100%;
    width: 100%;
  }
}
.comment {
  display: flex;
  padding-top: 20px;
  .avatar {
    .img-wrap(40px);
    margin-right: 12px;
    img {
      border-radius: 50%;
    }
  }
  .content {
    padding-bottom: 20px;
    width: 100%;
    font-size: 12px;
    &.border {
      border-bottom: 1px solid var(--border);
    }
    .replied {
      padding: 8px;
      margin-top: 8px;
      background: var(--grey);
      border-radius: 4px;
    }
    .comment-text {
      .username {
        display: inline-block;
        margin-right: 4px;
        color: var(--font-color-blue);
      }
      .text {
        line-height: 1.5;
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      .date {
        color: var(--font-color-grey);
      }
      .actions {
        color: var(--font-color-grey);
      }
    }
  }
}
</style>
