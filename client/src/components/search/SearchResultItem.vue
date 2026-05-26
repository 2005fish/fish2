<template>
  <div class="search-result-item" @click="$router.push(`/novel/${novel.id}`)">
    <div class="cover">
      <img :src="novel.cover_url" :alt="novel.title" />
    </div>
    <div class="info">
      <div class="title" v-html="highlight(novel.title, keyword)"></div>
      <div class="author">{{ novel.author }} · {{ novel.category_name }}</div>
      <div class="summary">{{ novel.summary?.slice(0, 60) }}...</div>
      <div class="meta">
        <span>{{ novel.status === 1 ? '完结' : '连载中' }}</span>
        <span>{{ formatReadCount(novel.read_count) }} 人在读</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatReadCount } from '@/utils/format'

defineProps<{ novel: any; keyword: string }>()

function highlight(text: string, kw: string) {
  if (!kw) return text
  const re = new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<em style="color:#ff6b35;font-style:normal">$1</em>')
}
</script>

<style scoped>
.search-result-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
}
.cover {
  width: 70px;
  height: 93px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.info {
  flex: 1;
  min-width: 0;
}
.title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}
.author {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.summary {
  font-size: 12px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 4px;
}
.meta {
  font-size: 11px;
  color: #999;
  display: flex;
  gap: 8px;
}
</style>
