<template>
  <div class="category-novel-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadMore"
      >
        <div class="novel-grid">
          <div
            v-for="novel in novels"
            :key="novel.id"
            class="grid-item"
            @click="$router.push(`/novel/${novel.id}`)"
          >
            <div class="cover">
              <img :src="novel.cover_url" :alt="novel.title" />
            </div>
            <div class="title">{{ novel.title }}</div>
            <div class="author">{{ novel.author }}</div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getNovels } from '@/api/novels'

const props = defineProps<{ categoryId: number }>()

const novels = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
let page = 1

async function loadData(reset = false) {
  if (reset) {
    page = 1
    finished.value = false
    novels.value = []
  }
  loading.value = true
  try {
    const res: any = await getNovels({ page, pageSize: 12, category_id: props.categoryId })
    if (reset) {
      novels.value = res.data
    } else {
      novels.value.push(...res.data)
    }
    if (page >= res.totalPages) finished.value = true
    page++
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

function loadMore() {
  loadData()
}

function onRefresh() {
  loadData(true)
}

watch(() => props.categoryId, () => {
  loadData(true)
}, { immediate: true })
</script>

<style scoped>
.category-novel-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}
.novel-grid {
  display: flex;
  flex-wrap: wrap;
}
.grid-item {
  width: 33.33%;
  padding: 8px 4px;
  cursor: pointer;
}
.cover {
  aspect-ratio: 3/4;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.title {
  font-size: 13px;
  font-weight: 600;
  margin-top: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.author {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
</style>
