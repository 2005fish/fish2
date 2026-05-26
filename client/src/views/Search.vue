<template>
  <div class="search-page">
    <van-nav-bar left-arrow @click-left="$router.back()" fixed placeholder>
      <template #title>
        <form @submit.prevent="doSearch">
          <van-search
            v-model="keyword"
            placeholder="搜索书名、作者"
            shape="round"
            @search="doSearch"
            autofocus
          />
        </form>
      </template>
    </van-nav-bar>

    <!-- Hot tags when no search -->
    <div v-if="!searched" class="hot-section">
      <div class="section-title">热门搜索</div>
      <div class="tag-cloud">
        <van-tag
          v-for="tag in hotTags"
          :key="tag.tag_name"
          plain
          type="primary"
          size="medium"
          @click="searchTag(tag.tag_name)"
        >
          {{ tag.tag_name }}
        </van-tag>
      </div>
    </div>

    <!-- Search results -->
    <div v-else>
      <div class="result-header">
        找到 <strong>{{ total }}</strong> 个结果
      </div>
      <SearchResultItem
        v-for="item in results"
        :key="item.id"
        :novel="item"
        :keyword="keyword"
      />
      <EmptyState v-if="results.length === 0 && !loading" description="没有找到相关小说" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { searchNovels } from '@/api/novels'
import SearchResultItem from '@/components/search/SearchResultItem.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const keyword = ref('')
const searched = ref(false)
const loading = ref(false)
const results = ref<any[]>([])
const total = ref(0)
const hotTags = ref<any[]>([])

onMounted(async () => {
  const res: any = await searchNovels('')
  if (res.type === 'tags') {
    hotTags.value = res.data
  }
})

async function doSearch() {
  if (!keyword.value.trim()) return
  loading.value = true
  searched.value = true
  try {
    const res: any = await searchNovels(keyword.value.trim())
    results.value = res.data
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function searchTag(tag: string) {
  keyword.value = tag
  doSearch()
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #fff;
}
.hot-section {
  padding: 20px 16px;
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tag-cloud .van-tag {
  cursor: pointer;
}
.result-header {
  padding: 12px 16px;
  font-size: 13px;
  color: #999;
  border-bottom: 1px solid #f5f5f5;
}
</style>
