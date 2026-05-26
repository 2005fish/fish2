<template>
  <div class="loading-spinner">
    <van-loading size="24px" vertical>{{ text }}</van-loading>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ text?: string }>(), {
  text: '加载中...',
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}
</style>
