<template>
  <div class="chapter-list">
    <van-cell
      v-for="ch in chapters"
      :key="ch.id"
      :title="ch.title"
      :label="formatDate(ch.created_at)"
      is-link
      @click="$emit('select', ch)"
    >
      <template #icon v-if="!ch.is_free">
        <van-icon name="lock" color="#ccc" size="14" style="margin-right:4px" />
      </template>
    </van-cell>
    <div class="load-more" v-if="total > chapters.length">
      <van-button size="small" plain type="primary" @click="$emit('loadMore')">
        查看全部 {{ total }} 章
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/format'

defineProps<{
  chapters: any[]
  total: number
}>()

defineEmits<{
  select: [ch: any]
  loadMore: []
}>()
</script>

<style scoped>
.chapter-list {
  padding: 0 16px;
}
.load-more {
  text-align: center;
  padding: 16px 0;
}
</style>
