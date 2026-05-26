<template>
  <div class="login-prompt">
    <van-divider />
    <div class="prompt-content">
      <p>{{ message }}</p>
      <van-button size="small" round type="primary" to="/login">去登录</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: '登录后可查看更多内容',
})
</script>

<style scoped>
.login-prompt {
  padding: 0 16px;
}
.prompt-content {
  text-align: center;
  padding: 20px 0;
}
.prompt-content p {
  font-size: 14px;
  color: #999;
  margin-bottom: 12px;
}
</style>
