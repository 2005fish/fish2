<template>
  <div class="home-page">
    <van-sticky>
      <div class="home-header">
        <div class="logo">番茄阅读</div>
        <van-icon name="search" size="22" @click="$router.push('/search')" />
      </div>
    </van-sticky>

    <van-pull-refresh v-model="refreshing" @refresh="loadData">
      <div class="home-content" v-if="!loading">
        <BannerCarousel :banners="data.banners" />

        <!-- Category quick nav -->
        <van-grid :column-num="4" :gutter="8" class="cat-grid">
          <van-grid-item
            v-for="cat in data.hotCategories"
            :key="cat.id"
            :text="cat.name"
            @click="$router.push('/categories')"
          >
            <template #icon>
              <span class="cat-icon">{{ cat.icon }}</span>
            </template>
          </van-grid-item>
        </van-grid>

        <RecommendSection title="热门推荐" :novels="data.hotNovels" layout="horizontal-scroll" />
        <RecommendSection title="新书上架" :novels="data.newNovels" layout="grid" />
        <RecommendSection title="完结精选" :novels="data.completedNovels" layout="horizontal-scroll" />
        <RecommendSection title="分类精选" :novels="data.categoryPicks" layout="grid" />
      </div>
      <LoadingSpinner v-else />
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getRecommend } from '@/api/novels'
import BannerCarousel from '@/components/home/BannerCarousel.vue'
import RecommendSection from '@/components/home/RecommendSection.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const loading = ref(true)
const refreshing = ref(false)
const data = reactive({
  banners: [] as any[],
  hotNovels: [] as any[],
  newNovels: [] as any[],
  completedNovels: [] as any[],
  hotCategories: [] as any[],
  categoryPicks: [] as any[],
})

async function loadData() {
  try {
    const res: any = await getRecommend()
    Object.assign(data, res)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 60px;
}
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
}
.logo {
  font-size: 20px;
  font-weight: 800;
  color: #ff6b35;
}
.home-content {
  padding: 16px;
}
.cat-grid {
  margin: 16px -8px;
}
.cat-icon {
  font-size: 24px;
}
</style>
