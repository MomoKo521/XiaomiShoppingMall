<template>
  <div>
    <!-- 导航栏组件 -->
    <siteNav></siteNav>
    <!-- 搜索栏组件 -->
    <cereHeader></cereHeader>
    <router-view></router-view>
    <!-- footer组件 -->
    <foter></foter>
  </div>
</template>

<script>
//导航栏组件
import siteNav from "@/components/base/siteNav.vue";
// 搜索栏组件
import cereHeader from "@/components/canvasShow/cereshop/pc/header.vue";
// 底部组件
import foter from "@/components/base/foter.vue";
export default {
  name: "layout",
  components: {
    siteNav,
    cereHeader,
    foter,
  },
};
</script>

<style>
</style>