<template>
  <div class="bookshelf-grid">
    <div v-if="novels.length === 0" class="empty-wrap">
      <van-empty description="还没有收藏书籍" image="search">
        <van-button round type="primary" size="small" to="/home">去逛书城</van-button>
      </van-empty>
    </div>
    <div v-else class="grid">
      <div
        v-for="item in novels"
        :key="item.id"
        class="grid-item"
        :class="{ editing: isEditMode }"
        @click="onItemClick(item)"
      >
        <div class="cover">
          <img :src="item.cover_url" :alt="item.title" />
        </div>
        <div class="title">{{ item.title }}</div>
        <van-progress
          v-if="item.last_progress"
          :percentage="Math.round((item.last_progress || 0) * 100)"
          stroke-color="#ff6b35"
          :show-pivot="false"
          style="margin-top:4px"
        />
        <div v-if="isEditMode" class="delete-btn" @click.stop="$emit('remove', item)">
          <van-icon name="cross" size="14" color="#fff" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{ novels: any[]; isEditMode: boolean }>()
const emit = defineEmits<{ remove: [item: any] }>()
const router = useRouter()

function onItemClick(item: any) {
  const chNum = item.last_chapter || 1
  router.push(`/reader/${item.novel_id}/${chNum}`)
}
</script>

<style scoped>
.bookshelf-grid { padding: 16px; }
.grid { display: flex; flex-wrap: wrap; margin: 0 -8px; }
.grid-item {
  width: 33.33%;
  padding: 0 8px 20px;
  cursor: pointer;
  position: relative;
}
.grid-item.editing { animation: shake 0.3s ease infinite; }
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-2deg); }
  75% { transform: rotate(2deg); }
}
.cover {
  aspect-ratio: 3/4;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}
.cover img { width: 100%; height: 100%; object-fit: cover; }
.title {
  font-size: 13px;
  font-weight: 600;
  margin-top: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.delete-btn {
  position: absolute;
  top: -6px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: #ff4757;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-wrap { padding: 40px 0; }
</style>
