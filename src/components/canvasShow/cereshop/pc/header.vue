<template>
  <div class="heared">
    <router-link to="/"
      ><img src="@/assets/images/cereshop/home/eshop.png" alt=""
    /></router-link>
    <div class="serch" v-if="$route.meta.searchVisible">
      <i class="el-icon-search"></i>
      <el-input
        placeholder="请输入搜索商品"
        v-model="keywrod"
        @keyup.enter.native="goSearch"
      ></el-input
      ><el-button type="primary" @click="goSearch">搜索</el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "herads",
  data() {
    return {
      keywrod: "",
    };
  },
  methods: {
    // 跳转搜索组件
    ...mapMutations(["SET_SEARCHKEWORD"]),
    goSearch() {
      this.SET_SEARCHKEWORD(this.keywrod);
      if (this.$route.name != "search") {
        this.$router.push({ name: "search" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.heared {
  width: 1250px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  .router-link-active {
    img {
      margin: 32px 15px 32px -60px;
    }
  }
  .serch {
    margin: 25px 0;
    display: flex;
    height: 46px;
    align-items: center;
    border: 1px solid #f78521;
    border-radius: 5px;
    i {
      margin-left: 10px;
    }
    ::v-deep .el-input__inner {
      height: 46px;
      line-height: 46px;
      border: none;
      width: 350px;
    }
    .el-button {
      height: 46px;
      border-radius: 0;
      background-color: #f78521;
      border: none;
    }
  }
}
</style>