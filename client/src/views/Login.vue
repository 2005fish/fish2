<template>
  <div class="login-page">
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()" />

    <div class="login-content">
      <div class="logo-area">
        <div class="app-logo">📚</div>
        <h2>番茄阅读</h2>
        <p>登录后享受个性化推荐和书架同步</p>
      </div>

      <van-tabs v-model:active="mode" class="form-tabs">
        <van-tab title="登录">
          <van-form @submit="onLogin" class="form">
            <van-cell-group inset>
              <van-field v-model="loginForm.username" label="用户名" placeholder="请输入用户名" :rules="[{ required: true }]" />
              <van-field v-model="loginForm.password" label="密码" type="password" placeholder="请输入密码" :rules="[{ required: true }]" />
            </van-cell-group>
            <div class="submit-wrap">
              <van-button round block type="primary" native-type="submit" :loading="loading">登录</van-button>
            </div>
          </van-form>
        </van-tab>

        <van-tab title="注册">
          <van-form @submit="onRegister" class="form">
            <van-cell-group inset>
              <van-field v-model="regForm.nickname" label="昵称" placeholder="请输入昵称" :rules="[{ required: true }]" />
              <van-field v-model="regForm.username" label="用户名" placeholder="请输入用户名" :rules="[{ required: true }]" />
              <van-field v-model="regForm.password" label="密码" type="password" placeholder="至少6位密码" :rules="[{ required: true, validator: (v: string) => v.length >= 6, message: '密码至少6位' }]" />
            </van-cell-group>
            <div class="submit-wrap">
              <van-button round block type="primary" native-type="submit" :loading="loading">注册</van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>

      <div class="demo-hint">
        <van-divider>演示账号</van-divider>
        <p>用户名: testuser / 密码: 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const mode = ref(0)
const loading = ref(false)

const loginForm = reactive({ username: '', password: '' })
const regForm = reactive({ username: '', password: '', nickname: '' })

async function onLogin() {
  loading.value = true
  try {
    await userStore.login(loginForm.username, loginForm.password)
    showToast('登录成功')
    router.back()
  } catch {
    // Error handled by interceptor
  } finally {
    loading.value = false
  }
}

async function onRegister() {
  loading.value = true
  try {
    await userStore.register(regForm.username, regForm.password, regForm.nickname)
    showToast('注册成功')
    router.back()
  } catch {
    // Error handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #fff;
}
.login-content {
  padding: 20px 16px;
}
.logo-area {
  text-align: center;
  padding: 30px 0 20px;
}
.app-logo {
  font-size: 48px;
}
.logo-area h2 {
  font-size: 22px;
  margin: 10px 0 6px;
}
.logo-area p {
  font-size: 13px;
  color: #999;
}
.form-tabs {
  margin-top: 20px;
}
.form {
  padding-top: 16px;
}
.submit-wrap {
  padding: 20px 16px;
}
.demo-hint {
  text-align: center;
  margin-top: 30px;
}
.demo-hint p {
  font-size: 13px;
  color: #999;
}
</style>
