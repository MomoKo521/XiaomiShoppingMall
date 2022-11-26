<template>
  <div class="footrbox">
    <div class="conten">
      <div class="contenbox item">
        <p>客服电话</p>
        <p>400 111 2222</p>
        <p>08:00-22:00</p>
      </div>
      <div class="customerservice item">
        <p>服务支持</p>
        <p>7天无理由退货</p>
        <p>15免费换货</p>
        <p>预约维修服务</p>
      </div>
      <div class="About item">
        <p>关于我们</p>
        <p>了解我们</p>
        <p>合作咨询</p>
        <p>加入我们</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "foter",
};
</script>

<style lang="scss" scoped>
.footrbox {
  height: 200px;
  background-color: #f4f4f8;
  .conten {
    width: 1250px;
    margin: 0 auto;
    display: flex;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      & p:nth-child(1) {
        margin-bottom: 33px;
        margin-top: 20px;
      }
    }
    .contenbox {
      & p:nth-child(2) {
        margin-bottom: 10px;
        font-size: 40px;
        font-weight: 500;
      }
    }
    .customerservice {
      & p:nth-child(n + 2) {
        margin-bottom: 10px;
      }
    }
    .About {
      & p:nth-child(n + 2) {
        margin-bottom: 20px;
      }
    }
  }
}
</style>