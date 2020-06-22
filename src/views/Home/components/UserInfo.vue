<template>
  <div class="top-menu flex-row">
    <div class="top-search flex-row">
      <input type="text" class="top-search-input" />
      <a-button type="danger">Search</a-button>
    </div>
    <div class="top-user-name flex-center">
      BLOCK
    </div>
    <div class="top-avatar flex-center">
      <div class="flex-row">
        <div class="flex-column">
          <span style="font-weight:bold;">{{ getUser.nickname }}</span>
          <span>{{ getUser.signature }}</span>
        </div>
        <Dropdown>
          <Avatar class="user-avatar" :size="40" :src="avatarUrl" icon="user" />
          <a-menu slot="overlay">
            <a-menu-item @click="goLogin(1)">
              <span>登录</span>
            </a-menu-item>
            <a-menu-item @click="goLogin(0)" v-if="user">
              <span>注销</span>
            </a-menu-item>
          </a-menu>
        </Dropdown>
      </div>
    </div>
    <a-modal :title="title" v-model="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="visible = false">
      <a-form-model>
        <a-form-model-item>
          <a-input v-model="form.user" placeholder="Username">
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="form.password" type="password" placeholder="Password">
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { Avatar, Dropdown, Modal, Input, FormModel } from 'ant-design-vue'
import { mapState, mapGetters } from 'vuex'
import { loginEmail, loginCellphone, logout } from '@/api'
export default {
  name: 'UserInfo',
  components: {
    Avatar,
    Dropdown,
    AModal: Modal,
    AInput: Input,
    AFormModel: FormModel,
    AFormModelItem: FormModel.Item
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: {
        user: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['getUser']),
    title() {
      return this.user ? '注销' : '登录'
    },
    loginByPhone() {
      return /\d{11}/.test(this.form.user)
    },
    avatarUrl() {
      if (this.user) {
        return this.user.avatarUrl
      } else {
        return ''
      }
    }
  },
  methods: {
    goLogin(type) {
      if (type) {
        this.visible = true
      } else {
        logout().then(() => {
          this.$message.success('注销成功')
          this.$store.commit('_user', null)
        })
      }
    },
    async handleOk() {
      this.confirmLoading = true
      let method = this.loginByPhone ? loginCellphone : loginEmail
      try {
        let login = await method(this.form)
        if (login.code === 200) {
          this.$store.commit('_user', login.profile)
          this.$store.commit('setLayoutBg', `url(${login.profile.backgroundUrl}) no-repeat`)
          this.visible = false
        }
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.confirmLoading = false
      }
    }
  },
  created() {}
}
</script>
<style lang="less" scope>
.top-menu {
  .top-search {
    flex: 3;
    margin-right: 10px;
    padding: 10px;
    background: var(--card-color) !important;
    color: var(--font-color-grey) !important;
    border-radius: 7px;
    &-input {
      display: inline-block;
      list-style: none;
      position: relative;
      width: 100%;
      height: 32px;
      padding: 4px 11px;
      font-size: 14px;
      line-height: 1.5;
      background-color: var(--theme-color);
      background-image: none;
      border: none;
      border-radius: 4px;
      transition: all 0.3s;
      appearance: none;
      outline: none;
    }
  }
  .top-user-name {
    flex: 1;
    background: var(--card-color) !important;
    color: var(--font-color-grey) !important;
    border-radius: 7px;
    margin-right: 10px;
  }
  .top-avatar {
    width: 220px;
    background: var(--card-color) !important;
    color: var(--font-color-grey) !important;
    border-radius: 7px;
  }
  .user-avatar {
    padding: 5px;
    margin-left: 10px;
    > img {
      border-radius: 50%;
    }
  }
}
</style>
