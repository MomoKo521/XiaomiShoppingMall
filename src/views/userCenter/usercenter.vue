<template>
  <div class="banner" style="margin-bottom: 140px">
    <div class="leftBox">
      <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        router
      >
        <el-menu-item index="userInfo">
          <span>个人管理</span>
        </el-menu-item>
        <el-menu-item index="myOrder">
          <span>我的订单</span>
        </el-menu-item>
        <el-menu-item index="rechargewallet">
          <span>钱包充值</span>
        </el-menu-item>
        <el-menu-item index="receiptAddress">
          <span>收货地址</span>
        </el-menu-item>
        <el-menu-item index="myCollection">
          <span>我的收藏</span>
        </el-menu-item>
        <el-menu-item index="browseRecords">
          <span>浏览足迹</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="rightBox">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Cookie from "js-cookie";
export default {
  name: "usercenter",
  created() {
    //访问个人中心有个前提 用户已登录
    if (!Cookie.get("token")) {
      this.$message.warning("请先登录");
      this.$store.commit("resetVuex");
      this.$router.push({ path: "/login" });
    }
  },
  computed: {
    defaultActive: function () {
      //let index = this.$route.path.replace("/", "");
      //获取当前路由地址
      //console.log('当前路由='+index);
      return this.$route.path.replace("/", "");
    },
  },
};
</script>

<style lang="scss" scoped>
.banner {
  width: 1250px;
  margin: 0 auto;
  display: flex;
  min-height: 500px;
  .leftBox {
    text-align: center;
    width: 200px;
    border: 1px solid #e6e6e6;
    .el-menu {
    }
    & .el-menu-item:hover {
      background-color: transparent;
    }
    .is-active {
      background-color: transparent;
      color: #f78521;
      border-left: 3px solid #f78521;
    }
  }
  .rightBox {
    margin-left: 20px;
    width: 100%;
  }
}
</style>