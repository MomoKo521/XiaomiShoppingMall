<template>
  <div class="categorybox">
    <div class="categorycont">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>全部结果</el-breadcrumb-item>
        <el-breadcrumb-item style="color: #f78521">{{
          sortitem.cateName
        }}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 内容区 -->
      <div class="content">
        <div class="sort">
          <p>排序:</p>
          <p :class="{ item: !priceOrder }" @click="defaults">默认</p>
          <p @click="changeSort">
            <span :class="{ item: priceOrder }">价格</span>
            <span>
              <i :class="{ bordertop: priceOrder == 'asc' }"></i>
              <i :class="{ borderboot: priceOrder == 'desc' }"></i>
            </span>
          </p>
        </div>
        <div class="proList">
          <h2>{{ sortitem.cateName }}</h2>
          <productList :shopping="categoryList" ref="son"></productList>
        </div>
        <!-- 分页 -->
        <el-pagination
          v-if="categoryList.length > 0"
          style="margin-top: 20px"
          background
          layout="prev, pager, next"
          :total="totl"
          align="right"
          :current-page="page"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
        <!-- 没有数据 -->
        <div class="nodate" v-if="categoryList.length == 0">
          <img src="../../../static/image/noorder@2x.png" alt="" />
          <p>该分类暂时没有商品呢</p>
        </div>
      </div>
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
  name: "category",
  data() {
    return {
      categoryList: [], //存储商品分类
      sortitem: {}, //存储分类信息
      page: 1, //页码,默认为 1
      limit: 10, //必须 页大小,默认为 10
      priceOrder: "", //必须 价格排序（asc 升、desc 降）
      totl: 0, //总页码数
    };
  },
  methods: {
    //获取商品分类数据
    getcategoryList() {
      // 显示子组件加载动画
      this.$refs.son.loading = true;
      let params = {
        url: this.$api.getProducts,
        method: "get",
        payload: {
          limit: this.limit,
          page: this.page,
          priceOrder: this.priceOrder,
          sid: this.sortitem.id,
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        // 请求完成不管是否成功都关闭子组件动画
        setTimeout(() => {
          this.$refs.son.loading = false;
        }, 300);
        if (res.status == 200) {
          this.categoryList = res.data.content;
          this.totl = res.data.totalElements;
        }
      });
    },
    // page发送变化
    handleCurrentChange(newpage) {
      this.page = newpage;
      // 刷新数据
      this.getcategoryList();
    },
    // 默认排序
    defaults() {
      this.priceOrder = "";
      // 刷新数据
      this.getcategoryList();
    },
    // 商品排序切换
    changeSort() {
      //升叙或者降序
      if (this.priceOrder) {
        this.priceOrder = this.priceOrder == "asc" ? "desc" : "asc";
      } else {
        // 从默认排序切换到升叙或者降序
        this.priceOrder = "desc";
      }
      // 刷新数据
      this.getcategoryList();
    },
  },
  mounted() {
    //获取存储分类信息
    this.sortitem = JSON.parse(this.$route.query.classifDat);
    // 获取数据
    this.getcategoryList();
  },
};
</script>

<style lang="scss" scoped>
.categorybox {
  background-color: #f0f0f0;
  padding-bottom: 200px;
  .categorycont {
    width: 1250px;
    margin: 0 auto;

    // 面包屑
    ::v-deep .el-breadcrumb {
      padding: 30px 0;
      & .el-breadcrumb__item:nth-child(2) {
        span {
          color: #f78521;
        }
      }
    }
    // 内容区
    .content {
      background-color: white;
      padding: 0 50px 50px 50px;

      // 排序
      .sort {
        display: flex;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid rgb(228, 219, 219);
        color: #666666;
        p {
          margin-right: 30px;
        }
        p:nth-child(2) {
          cursor: pointer;
        }
        p:nth-child(3) {
          cursor: pointer;
          display: flex;
          span:nth-child(2) {
            margin-left: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            i:nth-child(1) {
              border: 6px solid transparent;
              border-bottom-color: #999999;
            }
            i:nth-child(2) {
              margin-top: 3px;
              border: 6px solid transparent;
              border-top-color: #999999;
            }
          }
        }
      }
      // 分类数据
      .proList {
        h2 {
          text-align: center;
          margin: 50px 0px 80px 0px;
        }
      }
      // 分页
      ::v-deep .el-pagination {
        .el-pager {
          li:not(.disabled):hover {
            color: #ff7800;
          }
          li:not(.disabled).active {
            background-color: #ff7800;
          }
          li:not(.disabled).active:hover {
            color: #f4f4f5;
          }
        }
      }
      //分类没有商品
      .nodate {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #66666666;
        img {
          height: 300px;
          width: 400px;
        }
      }
    }
  }
  //排序样式
  .item {
    color: #f78521;
  }
  // 升序样式
  .bordertop {
    border-bottom-color: #f78521 !important;
  }
  //降序样式
  .borderboot {
    border-top-color: #ff7800 !important;
  }
}
</style>