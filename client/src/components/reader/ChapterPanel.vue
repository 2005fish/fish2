<template>
  <div class="chapter-panel">
    <div
      v-for="ch in chapters"
      :key="ch.id"
      class="ch-item"
      :class="{ active: ch.chapter_number === current, locked: !ch.is_free }"
      @click="$emit('select', ch)"
    >
      <span class="ch-name">{{ ch.title }}</span>
      <van-icon v-if="!ch.is_free" name="lock" color="#ccc" size="12" />
    </div>
    <van-button
      v-if="!finished"
      size="small"
      plain
      block
      :loading="loading"
      @click="$emit('loadMore')"
      style="margin-top:12px"
    >
      加载更多
    </van-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  chapters: any[]
  current: number
  loading: boolean
  finished: boolean
}>()

defineEmits<{
  select: [ch: any]
  loadMore: []
}>()
</script>

<style scoped>
.chapter-panel { max-height: 50vh; overflow-y: auto; }
.ch-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 14px;
}
.ch-item.active { color: #ff6b35; font-weight: 600; }
.ch-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
