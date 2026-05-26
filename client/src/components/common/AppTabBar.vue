<template>
  <van-tabbar v-model="active" :safe-area-inset-bottom="true" route>
    <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
    <van-tabbar-item icon="apps-o" to="/categories">分类</van-tabbar-item>
    <van-tabbar-item icon="bookmark-o" to="/bookshelf">书架</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = computed(() => (route.meta.tabIndex as number) ?? 0)
</script>
