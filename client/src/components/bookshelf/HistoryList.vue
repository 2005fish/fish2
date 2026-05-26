<template>
  <div class="history-list">
    <div v-if="history.length === 0">
      <van-empty description="暂无阅读记录" />
    </div>
    <van-cell
      v-for="item in history"
      :key="item.id"
      @click="$router.push(`/reader/${item.novel_id}/${item.chapter_number}`)"
    >
      <template #icon>
        <img :src="item.cover_url" style="width:48px;height:64px;border-radius:4px;object-fit:cover;margin-right:12px" />
      </template>
      <template #title>
        <span style="font-size:15px;font-weight:500">{{ item.title }}</span>
      </template>
      <template #label>
        <span style="font-size:12px;color:#999">读到第{{ item.chapter_number }}章 · {{ formatDate(item.read_at) }}</span>
      </template>
    </van-cell>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/format'

defineProps<{ history: any[] }>()
</script>
