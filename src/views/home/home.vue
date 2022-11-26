<template>
  <div class="main">
    <!-- 头部 -->
    <div class="top">
      <!-- 菜单栏 -->
      <div class="menu_bar">
        <ul>
          <li v-for="item in menubarList" :key="item.id">
            <p>{{ item.cateName }}</p>
            <div>
              <a
                @click="gocategory(bar)"
                v-for="bar in item.children"
                :key="bar.id"
                href="javascript:;"
                >{{ bar.cateName }}</a
              >
            </div>
          </li>
        </ul>
      </div>
      <!-- 轮播图 -->
      <div class="banner">
        <el-carousel height="460px">
          <el-carousel-item v-for="(item, index) in bannerListL" :key="index">
            <img
              style="height: 100%; width: 100%"
              :src="$api.BASEURL + item.pic"
              alt=""
            />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <!-- 精品推荐 -->
    <div class="goodsItem">
      <p>精品 推荐</p>
      <productList :shopping="recommendation"></productList>
    </div>
    <!-- 猜你喜欢 -->
    <div class="goodsItem">
      <p>猜你喜欢</p>
      <productList :shopping="guessLike"></productList>
    </div>
  </div>
</template>

<script>
import { listSearchMixin } from "@/config/mixin";
import productList from "@/components/base/productList.vue";
export default {
  mixins: [listSearchMixin],
  components: {
    productList,
  },
  name: "home",
  data() {
    return {
      menubarList: [], //存储菜单分类
      bannerListL: [], //存储轮播图
      recommendation: [], //存储精品推荐
      guessLike: [], //猜你喜欢
    };
  },
  methods: {
    //获取菜单栏
    getmenubar() {
      let params = {
        url: this.$api.getCategory,
        method: "get",
      };

      this.sendReq(params, (res) => {
        if (res.status == 200) {
          this.menubarList = res.data;
        }
      });
    },
    //获取轮播图
    getbanner() {
      let params = {
        url: this.$api.getIndexBanner,
        method: "get",
      };

      this.sendReq(params, (res) => {
        if (res.status == 200) {
          this.bannerListL = res.data;
        }
      });
    },
    // 获取精品推荐
    getIndexBast() {
      let params = {
        url: this.$api.getIndexBast,
        method: "get",
      };
      this.sendReq(params, (res) => {
        if ((res.status = 200)) {
          // 只要四份数据
          this.recommendation = res.data.splice(0, 4);
        }
      });
    },
    //获取猜你喜欢
    getIndexLike() {
      let params = {
        url: this.$api.getIndexLike,
        method: "get",
      };
      this.sendReq(params, (res) => {
        if ((res.status = 200)) {
          // 只要四份数据
          this.guessLike = res.data.splice(0, 4);
        }
      });
    },
    // 点击侧边栏分类跳转分类商品
    gocategory(item) {
      this.$router.push({
        name: "category",
        query: { classifDat: JSON.stringify(item) },
      });
    },
  },
  mounted() {
    //菜单栏
    this.getmenubar();
    //轮播图
    this.getbanner();
    //精品推荐
    this.getIndexBast();
    //猜你喜欢
    this.getIndexLike();
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 1250px;
  margin: 0 auto;
  margin-bottom: 100px;
  // 头部
  .top {
    display: flex;
    // 菜单栏
    .menu_bar {
      width: 260px;
      background-color: #303133;
      ul {
        list-style: none;
        padding: 10px 30px;
        li {
          p {
            color: white;
            font-size: 15px;
          }
          div {
            margin: 20px 0px;
            a {
              text-decoration: none;
              color: gray;
              margin-left: 20px;
            }
            & a:hover {
              color: #f78521;
            }
          }
        }
      }
    }
    // 轮播图
    .banner {
      margin-left: 20px;
      width: 980px;
    }
  }
  // 精品推荐
  .goodsItem {
    margin-top: 20px;
    p {
      font-size: 30px;
      font-weight: 600;
      margin: 30px 0;
    }
  }
}
</style>
