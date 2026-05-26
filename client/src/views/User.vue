<template>
  <div class="user-page">
    <div class="user-header">
      <div v-if="userStore.isLoggedIn" class="logged-in">
        <div class="avatar">
          <img :src="userStore.user?.avatar" alt="" />
        </div>
        <div class="name">{{ userStore.user?.nickname }}</div>
      </div>
      <div v-else class="not-logged-in" @click="$router.push('/login')">
        <van-icon name="user-o" size="40" />
        <span>点击登录</span>
      </div>
    </div>

    <van-cell-group inset>
      <van-cell title="书架" icon="bookmark-o" is-link to="/bookshelf" />
      <van-cell title="阅读历史" icon="clock-o" is-link to="/bookshelf" />
      <van-cell title="阅读设置" icon="setting-o" is-link />
      <van-cell title="关于我们" icon="info-o" is-link />
    </van-cell-group>

    <div class="logout-wrap" v-if="userStore.isLoggedIn">
      <van-button round block type="danger" @click="onLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

function onLogout() {
  userStore.logout()
  showToast('已退出')
  router.push('/home')
}
</script>

<style scoped>
.user-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
}
.user-header {
  background: linear-gradient(135deg, #ff6b35, #ff8c5a);
  padding: 40px 20px 30px;
  color: #fff;
}
.logged-in {
  display: flex;
  align-items: center;
  gap: 14px;
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.5);
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.name {
  font-size: 18px;
  font-weight: 600;
}
.not-logged-in {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 16px;
}
.van-cell-group {
  margin: 16px 0;
}
.logout-wrap {
  padding: 20px 16px;
}
</style>
