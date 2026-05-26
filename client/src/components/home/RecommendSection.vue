<template>
  <div class="recommend-section">
    <div class="section-header">
      <h3 class="section-title">{{ title }}</h3>
      <span class="section-more" v-if="moreLink" @click="$router.push(moreLink)">更多 &gt;</span>
    </div>
    <div v-if="layout === 'horizontal-scroll'" class="scroll-row">
      <NovelCard v-for="n in novels" :key="n.id" :novel="n" variant="horizontal" />
    </div>
    <div v-else class="grid-row">
      <NovelCard v-for="n in novels" :key="n.id" :novel="n" variant="vertical" />
    </div>
  </div>
</template>

<script setup lang="ts">
import NovelCard from './NovelCard.vue'

defineProps<{
  title: string
  novels: any[]
  layout?: 'horizontal-scroll' | 'grid'
  moreLink?: string
}>()
</script>

<style scoped>
.recommend-section {
  margin-bottom: 20px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.section-title {
  font-size: 17px;
  font-weight: 700;
  position: relative;
  padding-left: 10px;
}
.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background: #ff6b35;
  border-radius: 2px;
}
.section-more {
  font-size: 13px;
  color: #999;
  cursor: pointer;
}
.scroll-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.scroll-row::-webkit-scrollbar {
  display: none;
}
.grid-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6px;
}
</style>
