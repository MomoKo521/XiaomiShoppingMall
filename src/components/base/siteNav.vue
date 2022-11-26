<template>
  <div class="nav_box">
    <div class="nav_cont">
      <div class="nav_left">
        <p class="gologin" v-if="!userInfo.nickname">
          你好 请先<router-link to="/login?type=1">登陆</router-link>或
          <router-link to="/login?type=2">注册</router-link>
        </p>
        <div
          class="outlogin"
          v-else
          @mouseleave="isShowOut = false"
          @mouseover="isShowOut = true"
        >
          欢迎您 {{ userInfo.nickname }}
          <i
            style="color: #f78521; font-weight: 600"
            class="el-icon-arrow-down el-icon--right"
          ></i>
          <div class="outLogin" v-show="isShowOut" @click="outlogin = true">
            退出登录
          </div>
        </div>
      </div>
      <div class="nav_right">
        <div class="item">
          <router-link to="/myOrder" class="gorouter">我的订单</router-link>
        </div>
        <selectcar
          :shoppingCart="shoppingCart"
          :userInfo="userInfo"
        ></selectcar>
        <el-dropdown class="item">
          <span class="el-dropdown-link">
            我的<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/userInfo" class="gorouter"
                >个人信息</router-link
              ></el-dropdown-item
            >

            <el-dropdown-item>
              <router-link to="/myOrder" class="gorouter"
                >我的订单</router-link
              ></el-dropdown-item
            >
            <el-dropdown-item>
              <router-link to="/receiptAddress" class="gorouter"
                >收获地址</router-link
              ></el-dropdown-item
            >
            <el-dropdown-item>
              <router-link to="/rechargewallet" class="gorouter"
                >钱包充值</router-link
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 退出登陆对话框 -->
    <el-dialog title="提示" :visible.sync="outlogin" width="30%">
      <span>确定退出登陆吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outlogin = false">取 消</el-button>
        <el-button
          style="background-color: #f78521; border: none"
          type="primary"
          @click="toOutlogin"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
// 导入axios请求
import { listSearchMixin } from "@/config/mixin";
import Cookie from "js-cookie";
// 下拉组件
import selectcar from "./selectcar";
export default {
  name: "Nav",
  mixins: [listSearchMixin],
  components: {
    selectcar,
  },
  data() {
    return {
      isShowOut: false, //是否展示退出按钮
      outlogin: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "shoppingCart"]),
  },
  methods: {
    // 映射mutations
    ...mapMutations(["SET_SHOPPINGCART", "SET_CARTNUMBER", "ALL_REMOVE"]),
    // 获取购物车
    getcartInfo() {
      let params = {
        url: this.$api.getcartInfo,
        method: "get",
      };
      this.sendReq(params, (item) => {
        const d = item.data.valid;
        this.SET_SHOPPINGCART(d);
        this.SET_CARTNUMBER(item.data.valid.length);
      });
    },
    // 退出登陆
    toOutlogin() {
      this.outLoginDialog = false;
      Cookie.remove("token"); //删除token值
      // 重置vuex中有关用户的信息数据
      this.ALL_REMOVE();
      this.$router.push({ path: "/login", query: { type: 1 } }); //跳转到登陆
      this.$message.success("退出登陆成功");
    },
  },
  mounted() {
    // 用户登录才获取购物车信息
    if (Cookie.get("token")) {
      this.getcartInfo();
    }
  },
};
</script>

<style lang="scss" scoped>
.nav_box {
  width: 100%;
  background-color: #f1f2f7;
  height: 42px;
  line-height: 42px;
  // 内容盒子
  .nav_cont {
    display: flex;
    justify-content: space-between;
    width: 1250px;
    margin: 0 auto;
    font-size: 14px;
    // 左盒子
    .nav_left {
      .gologin {
        a {
          color: #f78521;
          text-decoration: none;
        }
      }
      .outlogin {
        position: relative;
        .outLogin {
          position: absolute;
          width: 100%;
          text-align: center;
          box-shadow: 0 0 20px #cccccc;
          cursor: pointer;
          z-index: 999;
          background-color: white;
        }
      }
    }
    //右盒子
    .nav_right {
      display: flex;
      .item {
        padding: 0 15px;
      }
      & .item:hover {
        background-color: white;
        color: #f78521;
      }
    }
  }
}
.gorouter {
  text-decoration: none;
  color: black;
}
.gorouter:hover {
  color: #f78521;
}
</style>