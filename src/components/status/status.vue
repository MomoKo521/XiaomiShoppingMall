<template>
  <!-- 订单状态详情组件 -->
  <!-- 不同订单状态展示不同样式  根据type判断 -->
  <div class="status">
    <div class="box">
      <img src="../../../static/image/submit@2x.png" />
      <p>提交订单</p>
      <p>{{ createTime }}</p>
    </div>
    <div class="line">
      <div v-if="type == 0" :class="{ active: type == 0 }">
        <p style="color: #ff7800">等待付款</p>
        <img src="../../../static/image/xzdiandian@2x.png" />
      </div>
      <div v-else>
        <img src="../../../static/image/line@2x.png" alt="" />
      </div>
    </div>
    <div class="box">
      <div>
        <img v-if="type >= 1" src="../../../static/image/payment@2x.png" />
        <img v-else src="../../../static/image/payment_grey@2x.png" />
        <p>付款成功</p>
      </div>
    </div>
    <div class="line">
      <div v-if="type == 1" :class="{ active: type == 1 }">
        <p style="color: #ff7800">等待发货</p>
        <img src="../../../static/image/xzdiandian@2x.png" />
      </div>
      <div v-if="type > 1">
        <img src="../../../static/image/line@2x.png" />
      </div>
      <div v-if="type != 1 && type < 1">
        <img src="../../../static/image/huidiandian@2x.png" />
      </div>
    </div>
    <div class="box">
      <div>
        <img
          v-if="type == 2"
          src="../../../static/image/transport_orange@2x.png"
        />
        <img v-if="type > 2" src="../../../static/image/transport@2x.png" />
        <img
          v-if="type < 2"
          src="../../../static/image/transport_grey@2x.png"
        />
        <p>等待收货</p>
      </div>
    </div>
    <div class="line">
      <div>
        <img v-if="type >= 3" src="../../../static/image/line@2x.png" />
        <img v-else src="../../../static/image/huidiandian@2x.png" />
      </div>
    </div>
    <div class="box">
      <img v-if="type >= 3" src="../../../static/image/complete@2x.png" />
      <img v-else src="../../../static/image/complete_grey@2x.png" />
      <p>完成</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "status",
  props: ["type", "createTime"],
};
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  margin-top: 110px;
  font-size: 13px;
  .box {
    flex: 1;
    text-align: center;
    p {
      margin: 10px 0;
    }
  }
  .line {
    text-align: center;
    img {
      width: 130px;
    }
    .active {
      margin-top: -20px;
    }
  }
}
</style>