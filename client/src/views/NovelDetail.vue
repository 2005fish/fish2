<template>
  <div class="detail-page">
    <van-nav-bar title="书籍详情" left-arrow @click-left="$router.back()" fixed placeholder />

    <div v-if="novel" class="detail-content">
      <NovelHeader :novel="novel" />

      <!-- Actions -->
      <div class="actions">
        <van-button
          type="primary"
          size="small"
          round
          block
          @click="startReading"
        >
          {{ lastReadLabel }}
        </van-button>
        <van-button
          :icon="inBookshelf ? 'success' : 'add-o'"
          size="small"
          round
          @click="toggleBookshelf"
        >
          {{ inBookshelf ? '已收藏' : '加入书架' }}
        </van-button>
      </div>

      <!-- Summary -->
      <div class="summary-section">
        <div class="section-title">简介</div>
        <p class="summary-text" :class="{ expanded: summaryExpanded }" @click="summaryExpanded = !summaryExpanded">
          {{ novel.summary }}
        </p>
      </div>

      <!-- Chapter list -->
      <div class="chapter-section">
        <div class="section-title">目录</div>
        <ChapterList
          :chapters="chapters"
          :total="chapterTotal"
          @select="goChapter"
          @loadMore="loadAllChapters"
        />
      </div>
    </div>

    <LoadingSpinner v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNovelDetail, getNovelChapters } from '@/api/novels'
import { useUserStore } from '@/stores/user'
import { useBookshelfStore } from '@/stores/bookshelf'
import NovelHeader from '@/components/detail/NovelHeader.vue'
import ChapterList from '@/components/detail/ChapterList.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const bookshelfStore = useBookshelfStore()

const novel = ref<any>(null)
const chapters = ref<any[]>([])
const chapterTotal = ref(0)
const inBookshelf = ref(false)
const summaryExpanded = ref(false)

const lastReadLabel = computed(() => {
  // Check if user has reading history for this novel
  return '开始阅读'
})

onMounted(async () => {
  const id = route.params.id as string
  const res: any = await getNovelDetail(id)
  novel.value = res
  document.title = res.title

  const chRes: any = await getNovelChapters(id, { page: 1, pageSize: 20 })
  chapters.value = chRes.data
  chapterTotal.value = chRes.total

  if (userStore.isLoggedIn) {
    inBookshelf.value = await bookshelfStore.check(Number(id))
  }
})

async function loadAllChapters() {
  const id = route.params.id as string
  const chRes: any = await getNovelChapters(id, { page: 1, pageSize: 500 })
  chapters.value = chRes.data
}

function startReading() {
  if (chapters.value.length > 0) {
    router.push(`/reader/${route.params.id}/${chapters.value[0].chapter_number}`)
  }
}

function goChapter(ch: any) {
  router.push(`/reader/${route.params.id}/${ch.chapter_number}`)
}

async function toggleBookshelf() {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  if (inBookshelf.value) {
    await bookshelfStore.remove(Number(route.params.id))
  } else {
    await bookshelfStore.add(Number(route.params.id))
  }
  inBookshelf.value = !inBookshelf.value
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 20px;
}
.detail-content {
  padding: 0;
}
.actions {
  display: flex;
  gap: 10px;
  padding: 0 16px 12px;
}
.actions .van-button {
  flex: 1;
}
.summary-section,
.chapter-section {
  padding: 12px 16px;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
  padding-left: 8px;
  border-left: 3px solid #ff6b35;
}
.summary-text {
  font-size: 14px;
  color: #666;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
}
.summary-text.expanded {
  display: block;
  -webkit-line-clamp: unset;
}
</style>
