<template>
  <div class="layout flex-row">
    <LeftMenu class="layout-left" />
    <div class="layout-right flex-column">
      <UserInfo class="user-info" />
      <router-view></router-view>
    </div>
    <!-- <div class="layout-bottom">
      <PlayBar />
    </div> -->
  </div>
</template>
<script>
import UserInfo from './components/UserInfo'
// import PlayBar from '@/components/PlayBar'
import LeftMenu from './components/LeftMenu'
export default {
  name: 'Home',
  components: {
    UserInfo,
    // PlayBar,
    LeftMenu
  },
  data() {
    return {
      collapsed: false,
      menuList: [
        {
          text: '搜索',
          icon: 'search',
          component: 'SearchPage'
        },
        {
          text: '我的音乐',
          icon: 'user',
          component: 'MainPage'
        }
      ]
    }
  },
  methods: {
    showMenu(menu) {
      this.$router.push({ name: menu.key })
    }
  }
}
</script>
<style lang="less">
.layout {
  height: 100%;
  position: relative;
  padding: 20px;
  padding-left: 35px;
  padding-top: 0;
  .layout-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .layout-left {
    margin-right: 35px;
    width: 330px;
    height: 100%;
    overflow: auto;
  }
  .layout-right {
    flex: 1;
    overflow: hidden;
  }
  .layout-side {
    .ant-layout-sider-children {
      display: flex;
      flex-flow: column nowrap;
      .menu {
        flex: 1;
        border: none;
        background: #373b3e;
        color: #fff;
        .ant-menu-item {
          text-align: left;
        }
      }
    }
  }
  .user-info {
    display: flex;
    flex-flow: row nowrap;
    margin: 20px 0;
    margin-right: 20px;
  }
  .layout-ctx {
    overflow-y: auto;
    padding: 40px;
    padding-left: 40px;
    padding-top: 0;
    padding-bottom: 100px;
    box-sizing: border-box;
    position: relative;
    background: var(--theme-color);
    color: var(--font-color-white);
  }
}
</style>
