<template>
  <div
    class="reader-content"
    :class="[`theme-${theme}`, `mode-${mode}`]"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- Scroll mode -->
    <div
      v-if="mode === 'scroll'"
      class="scroll-area"
      ref="scrollRef"
      :style="{ fontSize: fontSize + 'px', lineHeight: lineHeight }"
      @scroll="onScroll"
    >
      <h2 class="ch-title">{{ chapterTitle }}</h2>
      <div class="ch-body" v-html="formattedContent"></div>
      <div class="scroll-end" v-if="nextChapter" @click="$emit('nextChapter')">
        — 下一章：{{ nextChapter.title }} —
      </div>
    </div>

    <!-- Slide mode -->
    <div v-else class="slide-area">
      <div class="slide-track" :style="{ transform: `translateX(${-currentPage * 100}vw)` }">
        <div
          v-for="(page, i) in pages"
          :key="i"
          class="slide-page"
          :style="{ fontSize: fontSize + 'px', lineHeight: lineHeight }"
        >
          <h2 v-if="i === 0" class="ch-title">{{ chapterTitle }}</h2>
          <div class="ch-body" v-html="page"></div>
        </div>
      </div>
      <div class="page-indicator">{{ currentPage + 1 }} / {{ pages.length }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useTouch } from '@/composables/useTouch'

const props = defineProps<{
  mode: string
  theme: string
  fontSize: number
  lineHeight: number
  chapterTitle: string
  content: string
  nextChapter: any
  prevChapter: any
}>()

const emit = defineEmits<{
  tap: []
  nextChapter: []
  prevChapter: []
  scroll: [progress: number]
}>()

const scrollRef = ref<HTMLElement>()
const currentPage = ref(0)

// Split content into pages for slide mode
const pages = computed(() => {
  if (props.mode !== 'slide') return []
  const content = props.content
  if (!content) return ['']

  const charsPerPage = Math.floor(300 / (props.fontSize / 18))
  const pages: string[] = []
  let remaining = content

  // Rough pagination: split by character count then rejoin paragraphs
  const paras = content.split('\n')
  let currentPageContent = props.chapterTitle ? '' : ''  // title handled by template

  for (const para of paras) {
    if (currentPageContent.length + para.length > charsPerPage && currentPageContent.length > 0) {
      // Add title to first page
      if (pages.length === 0 && props.chapterTitle) {
        // title is rendered in template
      }
      pages.push(currentPageContent)
      currentPageContent = ''
    }
    currentPageContent += (currentPageContent ? '\n' : '') + para
  }
  if (currentPageContent.trim()) {
    pages.push(currentPageContent)
  }
  if (pages.length === 0) pages.push('')

  return pages
})

// Reset page on chapter change
watch(() => props.content, () => {
  currentPage.value = 0
})

// Touch handling for slide mode
const { onTouchStart, onTouchMove, onTouchEnd } = useTouch({
  onSwipeLeft() {
    if (props.mode !== 'slide') return
    if (currentPage.value < pages.value.length - 1) {
      currentPage.value++
    } else if (props.nextChapter) {
      emit('nextChapter')
    }
  },
  onSwipeRight() {
    if (props.mode !== 'slide') return
    if (currentPage.value > 0) {
      currentPage.value--
    } else if (props.prevChapter) {
      emit('prevChapter')
    }
  },
  onTap() {
    emit('tap')
  },
  threshold: 50,
})

function onScroll() {
  if (!scrollRef.value) return
  const el = scrollRef.value
  const progress = el.scrollTop / (el.scrollHeight - el.clientHeight)
  emit('scroll', Math.min(progress, 1))
}

const formattedContent = computed(() => {
  if (!props.content) return ''
  return props.content.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('')
})
</script>

<style scoped>
.reader-content {
  position: fixed;
  inset: 0;
  user-select: none;
  -webkit-user-select: none;
}

/* Theme colors */
.theme-day { --bg: #f5f0e8; --text: #333; --secondary: #888; }
.theme-night { --bg: #1a1a2e; --text: #ccc; --secondary: #666; }
.theme-sepia { --bg: #f4ecd8; --text: #5b4636; --secondary: #8b7355; }

.reader-content {
  background: var(--bg);
  color: var(--text);
}

/* Scroll mode */
.mode-scroll .scroll-area {
  height: 100%;
  overflow-y: auto;
  padding: 40px 20px;
  -webkit-overflow-scrolling: touch;
}
.mode-scroll {
  touch-action: pan-y;
}
.ch-title {
  text-align: center;
  font-size: 1.3em;
  font-weight: 700;
  margin-bottom: 24px;
}
.ch-body p {
  text-indent: 2em;
  margin-bottom: 0.6em;
  text-align: justify;
}
.scroll-end {
  text-align: center;
  padding: 30px 0;
  color: var(--secondary);
  font-size: 13px;
  cursor: pointer;
}

/* Slide mode */
.mode-slide .slide-area {
  height: 100%;
  overflow: hidden;
  position: relative;
}
.mode-slide {
  touch-action: none;
}
.slide-track {
  display: flex;
  height: 100%;
  transition: transform 0.25s ease-out;
  will-change: transform;
}
.slide-page {
  min-width: 100vw;
  height: 100%;
  padding: 40px 24px;
  padding-bottom: 60px;
  overflow-y: auto;
  box-sizing: border-box;
}
.page-indicator {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  color: var(--secondary);
  background: rgba(0,0,0,0.05);
  padding: 2px 10px;
  border-radius: 10px;
}
</style>
