<template>
  <div class="producbox" v-loading="loading">
    <div class="shoopingbox" v-for="item in shopping" :key="item.id">
      <img
        :src="$api.BASEURL + item.image"
        alt=""
        @click="goproductDetail(item)"
      />
      <p class="store marg">{{ item.storeName }}</p>
      <div class="price marg">
        <span>￥{{ item.price }}</span>
        <span>￥{{ item.otPrice }}</span>
      </div>
      <div class="line marg"></div>
      <div class="storeInfo marg">{{ item.storeInfo }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "productList",
  props: ["shopping"],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    // 跳转商品详情页面
    goproductDetail(item) {
      let data = {
        productId: item.id,
      };
      this.$router.push({
        name: "productDetail",
        query: { productid: JSON.stringify(data) },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.producbox {
  display: flex;
  flex-wrap: wrap;
  .shoopingbox {
    width: 275px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 12px;
    transition: all 0.5s;
    img {
      cursor: pointer;
      width: 100%;
      margin-bottom: 30px;
    }

    .store {
      text-align: center;
      width: 100%;
      font-size: 16px;
      font-weight: 600;
      overflow: hidden; //（文字长度超出限定宽度，则隐藏超出的内容）
      white-space: nowrap; //（设置文字在一行显示，不能换行）
      text-overflow: ellipsis; //（规定当文本溢出时，显示省略符号来代表被修剪的文本）
    }
    .price {
      span:nth-child(1) {
        font-size: 16px;
        font-weight: 600;
        color: #f78521;
      }
      span:nth-child(2) {
        font-size: 14px;
        margin-left: 20px;
        text-decoration: line-through;
      }
    }
    .line {
      width: 180px;
      border-bottom: 1px solid rgb(212, 196, 196);
    }
    .storeInfo {
      font-size: 16px;
      color: rgb(151, 146, 146);
    }
    .marg {
      margin-bottom: 10px;
    }
  }
  & .shoopingbox:hover {
    box-shadow: 0 0 20px gray;
  }
}
</style>