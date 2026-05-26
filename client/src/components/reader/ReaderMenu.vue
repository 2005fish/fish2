<template>
  <div>
    <van-overlay :show="visible" @click="$emit('close')" />
    <div class="reader-menu" :class="{ hidden: !visible }">
      <div class="menu-tabs">
        <div class="menu-tab" :class="{ active: tab === 'chapters' }" @click="tab = 'chapters'">目录</div>
        <div class="menu-tab" :class="{ active: tab === 'settings' }" @click="tab = 'settings'">设置</div>
      </div>
      <div class="menu-body">
        <ChapterPanel
          v-if="tab === 'chapters'"
          :chapters="chapters"
          :current="currentChapter"
          :loading="loadingChapters"
          :finished="chaptersFinished"
          @select="onSelectChapter"
          @loadMore="$emit('loadMoreChapters')"
        />
        <ReaderSettings
          v-else
          :fontSize="fontSize"
          :lineHeight="lineHeight"
          :theme="theme"
          :mode="mode"
          @update:fontSize="v => $emit('update:fontSize', v)"
          @update:lineHeight="v => $emit('update:lineHeight', v)"
          @update:theme="v => $emit('update:theme', v)"
          @update:mode="v => $emit('update:mode', v)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChapterPanel from './ChapterPanel.vue'
import ReaderSettings from './ReaderSettings.vue'

defineProps<{
  visible: boolean
  chapters: any[]
  currentChapter: number
  loadingChapters: boolean
  chaptersFinished: boolean
  fontSize: number
  lineHeight: number
  theme: string
  mode: string
}>()

const emit = defineEmits<{
  close: []
  selectChapter: [ch: any]
  loadMoreChapters: []
  'update:fontSize': [v: number]
  'update:lineHeight': [v: number]
  'update:theme': [v: string]
  'update:mode': [v: string]
}>()

const tab = ref('chapters')

function onSelectChapter(ch: any) {
  emit('selectChapter', ch)
  emit('close')
}
</script>

<style scoped>
.reader-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  color: #333;
  z-index: 20;
  border-radius: 16px 16px 0 0;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}
.reader-menu.hidden {
  transform: translateY(100%);
}
.menu-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}
.menu-tab {
  flex: 1;
  text-align: center;
  padding: 14px;
  font-size: 15px;
  cursor: pointer;
  color: #666;
}
.menu-tab.active {
  color: #ff6b35;
  border-bottom: 2px solid #ff6b35;
  font-weight: 600;
}
.menu-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
</style>
