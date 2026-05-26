<template>
  <div class="novel-header">
    <div class="cover-wrap">
      <img :src="novel.cover_url" :alt="novel.title" />
    </div>
    <div class="header-info">
      <h1 class="title">{{ novel.title }}</h1>
      <div class="author">{{ novel.author }}</div>
      <div class="tags-row">
        <van-tag type="primary" size="small">{{ novel.category_name }}</van-tag>
        <van-tag :type="novel.status === 1 ? 'success' : 'warning'" size="small">
          {{ novel.status === 1 ? '已完结' : '连载中' }}
        </van-tag>
        <span class="word-count">{{ formatWordCount(novel.total_words) }}</span>
      </div>
      <div class="stats">
        <span>{{ formatReadCount(novel.read_count) }} 人在读</span>
        <van-rate v-model="rating" readonly :size="14" :gutter="2" />
      </div>
      <div class="tag-list" v-if="novel.tags?.length">
        <van-tag v-for="t in novel.tags" :key="t" plain type="primary" size="small">{{ t }}</van-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatWordCount, formatReadCount } from '@/utils/format'

const props = defineProps<{ novel: any }>()
const rating = computed(() => (props.novel.rating || 0) / 2)
</script>

<style scoped>
.novel-header {
  display: flex;
  gap: 14px;
  padding: 16px;
}
.cover-wrap {
  width: 100px;
  height: 133px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.cover-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.header-info {
  flex: 1;
  min-width: 0;
}
.title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}
.author {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}
.tags-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.word-count {
  font-size: 12px;
  color: #999;
}
.stats {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
