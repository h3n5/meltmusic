<template>
  <div class="user-dropdown">
    <div class="routes-history">
      <a-icon type="left" @click.native="$router.go(-1)" />
      <a-icon type="right" @click.native="$router.go(1)" />
    </div>
    <Dropdown>
      <Avatar :size="40" :src="avatarUrl" icon="user" />
      <a-menu slot="overlay">
        <a-menu-item @click="goLogin(1)" v-if="!user">
          <span>登录</span>
        </a-menu-item>
        <a-menu-item @click="goLogin(0)" v-if="user">
          <span>注销</span>
        </a-menu-item>
      </a-menu>
    </Dropdown>
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
import { mapState } from 'vuex'
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
        user: '3384928538@qq.com',
        password: 'chenbinmind'
      }
    }
  },
  computed: {
    ...mapState(['user']),
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
.routes-history {
  .flex-center;
  > i {
    height: 100%;
    padding: 10px;
    .flex-center;
  }
}
</style>
