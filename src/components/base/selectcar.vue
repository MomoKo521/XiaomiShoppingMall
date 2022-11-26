<template>
  <div class="selectbox">
    <div class="title">
      购物车<span v-if="userInfo.nickname"
        >（<span style="color: #f78521; font-weight: 700">{{
          shoppingCart.length
        }}</span
        >）
      </span>
      <!-- icon图标 -->
      <i style="font-weight: 600" class="el-icon-arrow-down"></i>
    </div>
    <div class="carinfo item" v-if="shoppingCart.length > 0">
      <div
        class="shopinginfo"
        v-for="(itme, index) in shoppingCart"
        :key="itme.id"
        v-show="index < 5"
      >
        <div class="info" @click="goshoppingcart">
          <div class="cartImgBox">
            <img :src="$api.BASEURL + itme.productInfo.image" />
          </div>
          <div>
            <h3>{{ itme.productInfo.keyword }}</h3>
            <span>{{ itme.productInfo.attrInfo.sku }}</span>
          </div>
        </div>
        <div class="shopingPrice">
          <p>￥{{ itme.productInfo.attrInfo.price }}</p>
          <span @click="removeCatr(itme)">删除</span>
        </div>
      </div>
      <div class="goallcart" v-if="shoppingCart.length > 5">
        <el-button type="primary">查看全部</el-button>
      </div>
    </div>
    <div
      class="nullcar item"
      v-else-if="userInfo.nickname && shoppingCart.length == 0"
    >
      购物车还没商品赶紧选购吧！
    </div>
  </div>
</template>

<script>
import { listSearchMixin } from "@/config/mixin/index.js";
export default {
  props: ["shoppingCart", "userInfo"],
  mixins: [listSearchMixin],
  methods: {
    // 删除购物车商品
    removeCatr(item) {
      let ids = [];
      ids.push(item.id);
      let params = {
        url: this.$api.removeCart,
        methods: "post",
        data: {
          ids,
        },
      };
      this.sendReq(params, (res) => {
        if (res.status == 200) {
          this.$message.success("删除成功");
          this.$parent.getcartInfo();
        }
      });
    },
    // 跳转购物车页面
    goshoppingcart() {
      this.$router.push({ path: "/shopping-cart" }, () => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.selectbox {
  position: relative;
  &:hover {
    .title {
      color: #f78521;
      background-color: white;
    }
    .item {
      display: block;
    }
  }
  .title {
    padding: 0 15px;
  }
  .carinfo {
    cursor: pointer;
    z-index: 999;
    background-color: white;
    display: none;
    line-height: initial;
    position: absolute;
    width: 348px;
    left: 50%;
    margin-left: -174px;
    box-shadow: 0 0 20px #eeeeee;
    .shopinginfo {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      .info {
        display: flex;
        .cartImgBox {
          width: 42px;
          height: 42px;
          margin-right: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        h3 {
          font-weight: 500;
          font-size: 14px;
        }
        span {
          font-size: 12px;
          color: rgb(151, 151, 156);
        }
      }
      .shopingPrice {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        p {
          font-size: 14px;
          color: #f78521;
        }
        span {
          cursor: pointer;
        }
      }
    }
    .goallcart {
      display: flex;
      justify-content: flex-end;
      pad: 10px;
      .el-button {
        background-color: #f78521;
        border: none;
        padding: 6px 15px;
        margin: 10px;
        font-size: 10px;
      }
    }
  }
  .nullcar {
    display: none;
    background-color: white;
    position: absolute;
    padding: 40px 10px;
    text-align: center;
    z-index: 999;
    width: 213px;
    left: 50%;
    margin-left: -110px;
    box-shadow: 0 0 20px #eeeeee;
  }
}
</style>