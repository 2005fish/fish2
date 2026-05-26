<template>
  <div class="reader-header" :class="{ hidden: !visible }">
    <van-icon name="arrow-left" size="22" class="back-btn" @click="$router.back()" />
    <span class="title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; visible: boolean }>()
</script>

<style scoped>
.reader-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top, 0px));
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.3s ease;
}
.reader-header.hidden {
  transform: translateY(-100%);
}
.back-btn {
  cursor: pointer;
}
.title {
  font-size: 15px;
}
</style>
