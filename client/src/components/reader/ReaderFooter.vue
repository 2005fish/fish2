<template>
  <div class="reader-footer" :class="{ hidden: !visible }">
    <van-progress :percentage="percentage" stroke-color="#ff6b35" :show-pivot="false" />
    <div class="footer-info">
      <span class="chapter-hint" v-if="prevHint" @click="$emit('prev')">上一章</span>
      <span class="chapter-label">第{{ current }}章 / 共{{ total }}章</span>
      <span class="chapter-hint" v-if="nextHint" @click="$emit('next')">下一章</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  percentage: number
  current: number
  total: number
  prevHint: boolean
  nextHint: boolean
}>()

defineEmits<{ prev: []; next: [] }>()
</script>

<style scoped>
.reader-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 8px 16px 12px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  transition: transform 0.3s ease;
}
.reader-footer.hidden {
  transform: translateY(100%);
}
.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  font-size: 12px;
  color: #aaa;
}
.chapter-hint {
  color: #ff6b35;
  cursor: pointer;
}
</style>
