<template>
  <div class="productBox" v-loading="loading">
    <div class="ProDetail_top">
      <div class="swiperbox">
        <!-- 轮播图一 -->
        <swiper :options="swiperOption" ref="swiperTop" class="swiper1">
          <!-- slides -->
          <swiper-slide
            v-for="(item, index) of ProDetail.sliderImageArr"
            :key="index"
            :style="{ backgroundImage: 'url(' + $api.BASEURL + item + ')' }"
          >
          </swiper-slide>
        </swiper>
        <!-- 轮播图二 侧边轮播图 -->
        <div class="swiperThumbsLeft">
          <swiper :options="swiperOptionThumbs" ref="swiperThumbs">
            <swiper-slide
              v-for="(item, index) of ProDetail.sliderImageArr"
              :key="index"
              :style="{ backgroundImage: 'url(' + $api.BASEURL + item + ')' }"
            >
              <div
                style="height: 100%; width: 100%"
                @click="thumbsClick(index)"
              ></div>
            </swiper-slide>
          </swiper>
          <div
            class="swiper-button-prev swiper-button-white iconfont"
            slot="button-prev"
          >
            <i class="el-icon-arrow-up"></i>
          </div>
          <div
            class="swiper-button-next swiper-button-white iconfont"
            slot="button-next"
          >
            <i class="el-icon-arrow-down"></i>
          </div>
        </div>
      </div>
      <div class="proDuctInfo">
        <p class="stoname item">{{ ProDetail.storeName }}</p>
        <div class="storeInfo item">{{ ProDetail.storeInfo }}</div>
        <div class="Price item">
          <span>价格:</span><span>￥{{ skuInfo.price }}</span
          ><span>￥{{ skuInfo.otPrice }}</span>
        </div>
        <div class="attrValue">
          <ul v-for="item in specList" :key="item.id">
            <li>
              <p class="item">{{ item.attrName }}:</p>
              <div class="sku">
                <span
                  @click="attrValuechange(item, sku)"
                  v-for="(sku, index) in item.attrValue"
                  :key="index"
                  :class="{ active: sku.check }"
                  >{{ sku.attr }}</span
                >
              </div>
            </li>
          </ul>
        </div>
        <div class="itemplus">
          <p class="item">数量：</p>
          <!--  v-model="num"
            @change="handleChange" -->
          <el-input-number
            :min="1"
            :max="skuInfo.stock"
            v-model="productNumber"
          ></el-input-number>
          <span style="margin-left: 20px"
            >库存:<span style="color: #f78521">{{ skuInfo.stock }}</span
            >件</span
          >
        </div>
        <!-- 加入购物车 -->
        <div class="operation itemplus">
          <template v-if="skuInfo.stock > 0">
            <span @click="addshoppingcart" class="addcartInfo">加入购物车</span>
            <span @click="goplaceOrder" class="gomai">购买</span>
          </template>
          <!-- 没有库存了显示的按钮 -->
          <span v-else class="shortSale"> 以售空 </span>
          <!--收藏 -->
          <span @click="changeCollect" class="shouchang"
            ><i
              :class="
                favorite
                  ? 'el-icon-star-on operationactive'
                  : 'el-icon-star-off'
              "
            ></i>
            <div>收藏</div></span
          >
        </div>
      </div>
    </div>
    <div class="ProDetail_bot">
      <!-- tabs切换 -->
      <!--  @tab-click="handleClick" -->
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="宝贝详情" name="imagess"
          ><div
            class="imgbox"
            v-html="replaceImgSrc($api.BASEURL, ProDetail.description)"
          ></div
        ></el-tab-pane>
        <el-tab-pane label="宝贝评论" name="comment">
          <!-- 评价按钮  商品评论必须大于0才显示评论组件-->
          <div v-if="replyCount > 0">
            <evaluation :ProDetail="ProDetail"></evaluation>
          </div>
          <!-- 评论内容 -->
        </el-tab-pane>
        <div class="liek">
          <div class="liketitle">
            <div class="title">
              <i></i>
              <span>猜你喜欢</span>
              <i></i>
            </div>
            <span class="Guess">Guess you like it</span>
          </div>
          <!--猜你喜欢组件 -->
          <likeList :shopping="guessLike"></likeList>
        </div>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { listSearchMixin } from "../../config/mixin";
import likeList from "./likeList"; //猜你喜欢
import evaluation from "./evaluation"; //用户评论
import cooKie from "js-cookie";
// 导入Swiper组件
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
export default {
  mixins: [listSearchMixin],
  name: "productDetail",
  components: {
    swiper,
    swiperSlide,
    likeList,
    evaluation,
  },
  data() {
    return {
      // 轮播图一参数
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        // ...
        spaceBetween: 10,

        loopedSlides: 20,
      },
      // 轮播图二参数
      swiperOptionThumbs: {
        // 设置前进后退按钮
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        direction: "vertical", //轮播图竖直排列
        spaceBetween: 10,
        slidesPerView: 3,
        //loop: true, //循环
        freeMode: true,
        loopedSlides: 20, // looped slides should be the same
        centeredSlides: true,
        watchSlidesVisibility: true,
      },
      swiperTop: null, //存储侧边栏轮播图
      swiperThumbs: null, //存储大轮播图
      //============
      ProDetail: {}, //存储商品详细数据
      specList: [], // 规格列表
      skuList: [], // sku列表（不同商品规格参数的信息）
      skuInfo: {}, // sku信息
      specSelected: [], // 选中的规格
      replyCount: 0, //用户评论数量
      favorite: false, //是否已经收藏当前商品
      productNumber: 1, //商品数量

      activeName: "imagess", //tabs组件

      guessLike: [], //猜你喜欢
    };
  },
  methods: {
    //获取当前商品详情数据
    getProDetail() {
      this.loading = true;
      //获取route中queryid参数
      let id = JSON.parse(this.$route.query.productid);
      let params = {
        url: this.$api.getProDetail + id.productId,
        method: "get",
      };
      this.sendReq(params, (res) => {
        this.loading = false;
        // console.log(res);
        if (res.status == 200) {
          this.ProDetail = res.data.storeInfo;
          this.specList = res.data.productAttr;
          this.favorite = this.ProDetail.userCollect;
          this.skuList = res.data.productValue;
          this.replyCount = res.data.replyCount;
          //规格 默认选中第一条
          this.specList.forEach((element) => {
            element.attrValue[0].check = true;
            // 存储被选中的参数数据
            this.specSelected.push(element.attrValue[0]);
          });
        }
      });
    },
    // 用户点击轮播图侧边栏
    thumbsClick(index) {
      this.swiperThumbs.slideTo(index, 300, false);
      this.swiperTop.slideTo(index, 300, false);
    },
    // 用户点击切换商品规格
    attrValuechange(item, sku) {
      // 排他  先把点击的这一回商品规则取消选中
      item.attrValue.forEach((data) => {
        data.check = false;
      });
      sku.check = true;

      //规格 获取当前被勾选的规格
      let attr = [];
      this.specList.forEach((element) => {
        // 存储被选中的参数数据
        element.attrValue.forEach((item) => {
          //console.log(element);
          if (item.check) {
            // 规格被勾选
            attr.push(item);
          }
        });
      });
      //赋值
      this.specSelected = attr;
    },
    //商品大图是带标签的 我们要把其中的img 已有的src图片地址添加上地址前缀
    replaceImgSrc(basePrefix, questionContent) {
      if (questionContent) {
        questionContent = questionContent.replace(
          new RegExp(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi),
          function (match, capture) {
            match = match.replace(
              new RegExp(capture, "g"),
              basePrefix + capture
            );
            return match;
          }
        );
        return questionContent;
      }
    },
    // 获取猜你喜欢数据
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
    // 加入购物车
    addshoppingcart() {
      let params = {
        url: this.$api.addshoppingcart,
        method: "post",
        data: {
          cartNum: this.productNumber, // 必须 购物车数量
          new: 0, //  是否新购买
          productId: this.ProDetail.id, // 产品 ID
          uniqueId: this.skuInfo.unique, // 唯一的 ID的 当前商品规格unique
        },
      };
      //  发生添加购物车请求
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.$message.success("加入购物车成功");
          // 派发获取购物车请求刷新数据
          this.$store.dispatch("getshopingcart");
        }
      });
    },
    // 取消收藏和添加收藏
    changeCollect() {
      let params = {
        method: "post",
        data: {
          category: "collect",
          id: this.ProDetail.id,
        },
      };
      if (this.favorite) {
        // 当前为收藏状态  执行取消收藏
        params.url = this.$api.cancelCollect;
        this.sendReq(params, (res) => {
          if (res.status == 200) {
            // 执行成功改变为取消收藏样式
            this.$message.success("取消收藏成功");
            this.favorite = false;
          }
        });
      } else {
        // 当前为为收藏状态 执行添加收藏
        params.url = this.$api.addCollect;
        this.sendReq(params, (res) => {
          if (res.status == 200) {
            // 执行成功改变为收藏样式
            this.$message.success("添加收藏成功");
            this.favorite = true;
          }
        });
      }
    },
    // 跳转购买界面
    goplaceOrder() {
      // 当前商品规格库存是否足够
      if (this.skuInfo.stock > 0) {
        // 当前是否已经登陆
        if (!cooKie.get("token")) {
          this.$message.warning("还未登陆请先登录后，再来购买");
          this.$store.commit("resetVuex");
          this.$router.push({ path: "/login" });
        } else {
          // 发送添加购物车请求  但new为1  new为1表示立即购买此商品
          let params = {
            url: this.$api.addshoppingcart,
            method: "post",
            data: {
              cartNum: this.productNumber, // 必须 购物车数量
              new: 1, //  是否新购买
              productId: this.ProDetail.id, // 产品 ID
              uniqueId: this.skuInfo.unique, // 唯一的 ID的 当前商品规格unique
            },
          };
          this.sendReq(params, (res) => {
            if (res.status == 200) {
              //cartId 为当前购买商品订单标识
              let cartId = res.data.cartId;
              this.$router.push({
                name: "placeOrder",
                query: { cartId },
              });
            }
          });
        }
      } else {
        this.$message.warning("库存不够，去请查看其他规格");
      }
    },
  },
  created() {
    this.getProDetail();
    this.getIndexLike();
  },
  mounted() {
    // 两个轮播图联动
    this.$nextTick(() => {
      this.swiperTop = this.$refs.swiperTop.swiper;
      this.swiperThumbs = this.$refs.swiperThumbs.swiper;
      // =====
      this.swiperTop.controller.control = this.swiperThumbs;
      this.swiperThumbs.controller.control = this.swiperTop;
    });
  },
  watch: {
    // 监听规格参数变化
    specSelected(e) {
      let sku = "";
      e.forEach((item, sindex) => {
        // 拼接被选中规格参数
        sku += item.attr + ",";
      });
      // 去掉最后一次添加末尾的逗号
      sku = sku.substring(0, sku.length - 1);
      let s = this.skuList;
      this.skuInfo = s[sku];
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
}
.productBox {
  width: 1250px;
  margin: 0 auto;
  margin-top: 40px;
  // 商品规格
  .ProDetail_top {
    display: flex;
    // 轮播图
    .swiperbox {
      margin-right: 50px;
      height: 560px;
      width: 580px;
      position: relative;
      // 轮播图一
      .swiper1 {
        width: 440px;
        height: 100%;
        position: absolute;
        right: 0;
        .swiper-slide {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
        }
      }
      //轮播图二
      .swiperThumbsLeft {
        width: 120px;
        height: 80%;
        position: absolute;
        padding: 10px 0;
        left: 0;
        top: 10%;
        .swiper-container {
          height: 100%;
        }
        .swiper-button-prev,
        .swiper-button-next {
          position: absolute;
          left: 45px;
          background: none;
          width: 32px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          background: #999999;
          color: #ffffff;
        }
        .swiper-button-prev {
          position: absolute;
          top: -30px;
        }
        .swiper-button-next {
          position: absolute;
          top: initial;
          bottom: -30px;
        }
        .swiper-slide {
          height: 136px !important;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
        }
        .swiper-slide-active {
          border: 1px solid #f78521;
          box-sizing: border-box;
        }
      }
    }
    // 商品参数
    .proDuctInfo {
      width: 578px;
      // 下边距
      .item {
        margin-bottom: 15px;
      }
      .stoname {
        font-size: 23px;
        font-weight: 400;
      }
      .storeInfo,
      .Price span:nth-child(1) {
        color: rgb(160, 155, 155);
      }
      .Price {
        padding: 20px;
        background-color: #fff8f2;
        span {
          margin-right: 5px;
        }
        & span:nth-child(2) {
          font-size: 18px;
          color: #f78521;
        }
        & span:nth-child(3) {
          text-decoration: line-through;
        }
      }
      .attrValue {
        ul {
          li {
            margin-bottom: 20px;
            .sku {
              span {
                padding: 5px 15px;
                background-color: rgb(230, 227, 227);
                margin-right: 12px;
                cursor: pointer;
              }
              .active {
                background-color: #f78521;
                color: white;
              }
            }
          }
        }
      }
      .itemplus {
        margin-top: 30px;
      }
      .operation {
        display: flex;
        span {
          cursor: pointer;
          margin-right: 10px;
        }
        // 以售空样式
        .shortSale {
          color: white;
          background-color: gray;
          padding: 10px 0;
          width: 180px;
          text-align: center;
        }
        .addcartInfo,
        .gomai {
          width: 140px;
          text-align: center;
          padding: 10px 0;
        }
        .addcartInfo {
          border: 1px solid #f78521;
          color: #f78521;
        }
        .gomai {
          background-color: #f78521;
          color: white;
        }
        .shouchang {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          align-items: center;
          justify-content: center;
          width: 50px;
          border: 1px solid rgb(204, 196, 196);
          i {
            font-size: 25px;
          }
          div {
            font-size: 10px;
            color: gray;
          }
          .operationactive {
            color: #f78521;
          }
        }
      }
    }
  }
  // 商品信息
  .ProDetail_bot {
    margin-bottom: 100px;
    .el-tabs {
      margin-top: 80px;
      border: none;
      box-shadow: 0 0px 0px #ccc;
      ::v-deep .el-tabs__header {
        margin-bottom: 30px;
        border: 1px solid #dfdddd;
        background-color: #f6f6f6;
        .el-tabs__item {
          height: 50px;
          line-height: 50px;
        }
        & .el-tabs__item:hover {
          color: #909399;
        }
        .is-active {
          color: #909399;
        }
      }
      ::v-deep .el-tabs__content {
        padding: 0;
        display: flex;
        justify-content: space-between;
        .el-tab-pane {
          width: 890px;
          min-height: 1200px;
          border-right: 1px solid #cacaca;
          //宝贝详情内容样式
          .imgbox {
            margin-top: 30px;
            margin-bottom: 100px;
          }
        }
        .liek {
          width: 280px;
          margin-right: 40px;
          display: flex;
          flex-direction: column;
          .liketitle {
            margin-bottom: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .title {
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              i {
                height: 2px;
                width: 50px;
                background-color: gray;
              }
              span {
                margin: 0 15px;
              }
            }
            .Guess {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>