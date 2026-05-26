<template>
  <div class="reader-settings">
    <div class="setting-group">
      <div class="label">字号</div>
      <div class="control">
        <van-button size="small" icon="minus" @click="changeFont(-1)" />
        <span class="preview" :style="{ fontSize: fontSize + 'px' }">Aa</span>
        <van-button size="small" icon="plus" @click="changeFont(1)" />
      </div>
    </div>

    <div class="setting-group">
      <div class="label">行高</div>
      <van-slider v-model="localLineHeight" :min="1.4" :max="2.4" :step="0.1" @change="e => $emit('update:lineHeight', e as number)" />
    </div>

    <div class="setting-group">
      <div class="label">主题</div>
      <div class="theme-options">
        <div
          v-for="t in themes"
          :key="t.key"
          class="theme-dot"
          :class="{ active: theme === t.key }"
          :style="{ background: t.bg, color: t.color }"
          @click="$emit('update:theme', t.key)"
        >
          {{ t.label }}
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="label">翻页模式</div>
      <van-radio-group :model-value="mode" @change="e => $emit('update:mode', e as string)" direction="horizontal">
        <van-radio name="scroll">上下滚动</van-radio>
        <van-radio name="slide">左右翻页</van-radio>
      </van-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  fontSize: number
  lineHeight: number
  theme: string
  mode: string
}>()

const emit = defineEmits<{
  'update:fontSize': [v: number]
  'update:lineHeight': [v: number]
  'update:theme': [v: string]
  'update:mode': [v: string]
}>()

const localLineHeight = ref(props.lineHeight)

watch(() => props.lineHeight, v => localLineHeight.value = v)

const themes = [
  { key: 'day', label: '日', bg: '#f5f0e8', color: '#333' },
  { key: 'night', label: '夜', bg: '#1a1a2e', color: '#ccc' },
  { key: 'sepia', label: '护', bg: '#f4ecd8', color: '#5b4636' },
]

function changeFont(d: number) {
  const v = props.fontSize + d
  if (v >= 14 && v <= 28) emit('update:fontSize', v)
}
</script>

<style scoped>
.setting-group { margin-bottom: 20px; }
.label { font-size: 13px; color: #999; margin-bottom: 8px; }
.control { display: flex; align-items: center; gap: 12px; }
.preview { font-weight: 600; min-width: 30px; text-align: center; }
.theme-options { display: flex; gap: 12px; }
.theme-dot {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; cursor: pointer;
  border: 3px solid transparent;
  transition: border-color 0.2s;
}
.theme-dot.active { border-color: #ff6b35; }
</style>
