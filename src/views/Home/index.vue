<template>
  <a-layout class="layout">
    <a-layout-sider
      :value="$route.name"
      class="layout-side"
      collapsible
      v-model="collapsed"
      :collapsedWidth="0"
      width="120"
    >
      <a-menu class="menu" mode="inline" :inlineIndent="16">
        <a-menu-item v-for="item in menuList" :key="item.component" @click="showMenu">
          <a-icon :type="item.icon" />
          <span>{{ item.text }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <UserInfo class="user-info" />
      <a-layout-content class="layout-ctx">
        <router-view></router-view>
        <PlayBar />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import UserInfo from './components/UserInfo'
import PlayBar from '@/components/PlayBar'
export default {
  name: 'Home',
  components: {
    UserInfo,
    PlayBar
  },
  data() {
    return {
      collapsed: true,
      menuList: [
        {
          text: '搜索',
          icon: 'search',
          component: 'SearchPage'
        },
        {
          text: '我的音乐',
          icon: 'search',
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
  .ant-layout {
    overflow: hidden;
    background: var(--main-bgcolor);
  }
  .layout-side {
    .ant-layout-sider-children {
      display: flex;
      flex-flow: column nowrap;
      .menu {
        flex: 1;
        .ant-menu-item {
          text-align: left;
        }
      }
    }
  }
  .user-info {
    display: flex;
    flex-flow: row nowrap;
    padding: 0 40px;
    justify-content: space-between;
  }
  .layout-ctx {
    overflow-y: auto;
    padding: 40px;
    padding-left: 40px;
    padding-top: 0;
    padding-bottom: 100px;
    box-sizing: border-box;
    position: relative;
  }
}
</style>
