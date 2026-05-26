<template>
  <div class="novel-card" :class="variant" @click="$router.push(`/novel/${novel.id}`)">
    <div class="cover-wrapper">
      <img :src="novel.cover_url" :alt="novel.title" />
    </div>
    <div class="info" v-if="variant === 'vertical'">
      <div class="title">{{ novel.title }}</div>
      <div class="author">{{ novel.author }}</div>
      <div class="meta">
        <van-tag v-if="novel.status === 1" type="success" size="small">完结</van-tag>
        <van-tag v-else type="warning" size="small">连载</van-tag>
      </div>
    </div>
    <div class="info" v-else>
      <div class="title">{{ novel.title }}</div>
      <div class="desc">{{ novel.summary?.slice(0, 40) }}...</div>
      <div class="meta-row">
        <span class="author">{{ novel.author }}</span>
        <span class="tag" v-if="novel.category_name">{{ novel.category_name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  novel: any
  variant?: 'vertical' | 'horizontal'
}>()
</script>

<style scoped>
.novel-card {
  cursor: pointer;
}
.novel-card.vertical {
  width: 33.33%;
  padding: 0 6px 16px;
}
.novel-card.vertical .cover-wrapper {
  aspect-ratio: 3/4;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.novel-card.vertical .cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.novel-card.vertical .info {
  padding: 6px 2px 0;
}
.novel-card.vertical .title {
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.novel-card.vertical .author {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
.novel-card.vertical .meta {
  margin-top: 4px;
}

/* Horizontal variant */
.novel-card.horizontal {
  display: flex;
  gap: 10px;
  min-width: 140px;
  max-width: 180px;
  flex-shrink: 0;
}
.novel-card.horizontal .cover-wrapper {
  width: 70px;
  height: 93px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}
.novel-card.horizontal .cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.novel-card.horizontal .info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}
.novel-card.horizontal .title {
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.novel-card.horizontal .desc {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.novel-card.horizontal .meta-row {
  margin-top: 6px;
  font-size: 11px;
  color: #999;
  display: flex;
  gap: 6px;
  align-items: center;
}
.novel-card.horizontal .tag {
  background: #fff3ed;
  color: #ff6b35;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
}
</style>
