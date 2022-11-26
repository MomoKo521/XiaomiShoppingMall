<template>
  <div class="shopOrderbox">
    <div class="cartBody item" v-for="item in cartInfList" :key="item.id">
      <div>
        <img :src="$api.BASEURL + item.productInfo.image" alt="" />
        <p>{{ item.productInfo.storeName }}</p>
      </div>
      <div>{{ item.productInfo.attrInfo.sku }}</div>
      <div>￥{{ item.productInfo.attrInfo.price }}</div>
      <div>{{ item.cartNum }}</div>
      <div>￥{{ item.productInfo.attrInfo.price * item.cartNum }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "shopOrder",
  props: ["cartInfList"],
};
</script>

<style lang='scss' scoped>
.shopOrderbox {
  .item {
    display: flex;
    align-items: center;
    > div {
      width: 20%;
      box-sizing: border-box;
    }
    // 从第二个div开始居中对齐
    & div:nth-child(n + 2) {
      text-align: center;
    }
    & div:nth-child(1) {
      width: 40%;
    }
  }
  .cartBody {
    display: flex;
    border: 1px solid rgb(219, 214, 214);
    border-collapse: collapse;
    height: 140px;
    & div:nth-child(1) {
      display: flex;
      align-items: center;
      padding-left: 50px;
      img {
        margin-right: 20px;
        width: 80px;
        height: 80px;
      }
    }
    & div:nth-child(5) {
      color: #f78521;
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>