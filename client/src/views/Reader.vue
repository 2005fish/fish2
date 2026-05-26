<template>
  <div class="reader-page">
    <ReaderHeader :title="novel?.title || ''" :visible="controlsVisible" />

    <ReaderContent
      v-if="chapter"
      :mode="readerStore.settings.pageMode"
      :theme="readerStore.settings.theme"
      :fontSize="readerStore.settings.fontSize"
      :lineHeight="readerStore.settings.lineHeight"
      :chapterTitle="chapter.title"
      :content="chapter.content"
      :nextChapter="nextChapter"
      :prevChapter="prevChapter"
      @tap="toggleControls"
      @nextChapter="goNextChapter"
      @prevChapter="goPrevChapter"
      @scroll="onScrollProgress"
    />

    <ReaderFooter
      :visible="controlsVisible"
      :percentage="scrollProgress * 100"
      :current="chapter?.chapter_number || 0"
      :total="totalChapters"
      :prevHint="!!prevChapter"
      :nextHint="!!nextChapter"
      @prev="goPrevChapter"
      @next="goNextChapter"
      @click="toggleControls"
    />

    <ReaderMenu
      :visible="menuVisible"
      :chapters="chapters"
      :currentChapter="chapter?.chapter_number || 0"
      :loadingChapters="loadingChapters"
      :chaptersFinished="chaptersFinished"
      :fontSize="readerStore.settings.fontSize"
      :lineHeight="readerStore.settings.lineHeight"
      :theme="readerStore.settings.theme"
      :mode="readerStore.settings.pageMode"
      @close="menuVisible = false"
      @selectChapter="goToChapter"
      @loadMoreChapters="loadAllChapters"
      @update:fontSize="v => { readerStore.settings.fontSize = v; readerStore.saveSettings() }"
      @update:lineHeight="v => { readerStore.settings.lineHeight = v; readerStore.saveSettings() }"
      @update:theme="v => { readerStore.settings.theme = v; readerStore.saveSettings() }"
      @update:mode="v => { readerStore.settings.pageMode = v; readerStore.saveSettings() }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getChapter } from '@/api/chapters'
import { getNovelChapters } from '@/api/novels'
import { saveHistory } from '@/api/history'
import { useReaderStore } from '@/stores/reader'
import ReaderHeader from '@/components/reader/ReaderHeader.vue'
import ReaderContent from '@/components/reader/ReaderContent.vue'
import ReaderFooter from '@/components/reader/ReaderFooter.vue'
import ReaderMenu from '@/components/reader/ReaderMenu.vue'

const route = useRoute()
const router = useRouter()
const readerStore = useReaderStore()

const novel = ref<any>(null)
const chapter = ref<any>(null)
const totalChapters = ref(0)
const prevChapter = ref<any>(null)
const nextChapter = ref<any>(null)
const chapters = ref<any[]>([])
const loadingChapters = ref(false)
const chaptersFinished = ref(false)
const controlsVisible = ref(true)
const menuVisible = ref(false)
const scrollProgress = ref(0)
let hideTimer: ReturnType<typeof setTimeout> | null = null
let saveTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  const novelId = route.params.novelId as string
  const chapterNumber = Number(route.params.chapterNumber) || 1

  // Load novel chapters list
  const chList: any = await getNovelChapters(novelId, { pageSize: 500 })
  chapters.value = chList.data
  if (chList.totalPages <= 1) chaptersFinished.value = true

  // Find or load chapter
  let chapterId: number
  const found = chapters.value.find((c: any) => c.chapter_number === chapterNumber)
  if (found) {
    chapterId = found.id
  } else {
    // Load first chapter
    chapterId = chapters.value[0]?.id
  }

  if (chapterId) {
    await loadChapter(chapterId)
  }
})

onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
  if (saveTimer) clearInterval(saveTimer)
})

async function loadChapter(id: number) {
  const res: any = await getChapter(id)
  chapter.value = res.chapter
  novel.value = res.novel
  totalChapters.value = res.totalChapters
  prevChapter.value = res.prevChapter
  nextChapter.value = res.nextChapter
  scrollProgress.value = 0

  // Save reading progress
  saveHistory({
    novel_id: novel.value.id,
    chapter_id: res.chapter.id,
    chapter_number: res.chapter.chapter_number,
    progress: 0,
  })

  // Auto-hide controls
  resetAutoHide()
}

function toggleControls() {
  controlsVisible.value = !controlsVisible.value
  if (controlsVisible.value) {
    resetAutoHide()
  }
  if (menuVisible.value) {
    menuVisible.value = false
  }
}

function resetAutoHide() {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    controlsVisible.value = false
    menuVisible.value = false
  }, 3000)
}

function onScrollProgress(progress: number) {
  scrollProgress.value = progress
}

function goNextChapter() {
  if (nextChapter.value) {
    const chNum = nextChapter.value.chapter_number
    router.replace(`/reader/${novel.value.id}/${chNum}`)
    loadNextPrevChapter(chNum)
  }
}

function goPrevChapter() {
  if (prevChapter.value) {
    const chNum = prevChapter.value.chapter_number
    router.replace(`/reader/${novel.value.id}/${chNum}`)
    loadNextPrevChapter(chNum)
  }
}

async function loadNextPrevChapter(chapterNumber: number) {
  const found = chapters.value.find((c: any) => c.chapter_number === chapterNumber)
  if (found) {
    await loadChapter(found.id)
  }
}

function goToChapter(ch: any) {
  menuVisible.value = false
  router.replace(`/reader/${novel.value.id}/${ch.chapter_number}`)
  if (ch.id) loadChapter(ch.id)
}

async function loadAllChapters() {
  if (!novel.value) return
  loadingChapters.value = true
  const chList: any = await getNovelChapters(novel.value.id, { pageSize: 500 })
  chapters.value = chList.data
  chaptersFinished.value = true
  loadingChapters.value = false
}

// Watch route changes for chapter navigation
import { watch } from 'vue'
watch(() => route.params.chapterNumber, async (newNum) => {
  if (!newNum) return
  const found = chapters.value.find((c: any) => c.chapter_number === Number(newNum))
  if (found) {
    await loadChapter(found.id)
  }
})
</script>

<style>
.reader-page {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #f5f0e8;
}
</style>
