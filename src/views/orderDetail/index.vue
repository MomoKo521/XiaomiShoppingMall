<template>
  <div class="banner">
    <div class="content">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/myOrder' }"
          >我的订单</el-breadcrumb-item
        >
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 订单状态 -->
      <div class="state" v-loading="loading">
        <div class="left">
          <p>订单号:{{ orderDetail.orderId }}</p>
          <!-- 五种情况 -->
          <div
            class="nofukuan"
            v-if="orderDetail.statusDto && orderDetail.statusDto.type == 0"
          >
            <div class="lvse">等待付款</div>
            <div
              class="cancel"
              style="cursor: pointer"
              @click="dialogVisible = true"
            >
              取消订单
            </div>
            <div class="orange fukuan" @click="Payimmediately">付款</div>
          </div>
          <div
            class="item"
            v-if="orderDetail.statusDto && orderDetail.statusDto.type == 1"
          >
            <div class="orange">代发货</div>
          </div>
          <div
            class="item"
            v-if="orderDetail.statusDto && orderDetail.statusDto.type == 2"
          >
            <div class="orange">待收货</div>
          </div>
          <div
            class="item"
            v-if="orderDetail.statusDto && orderDetail.statusDto.type == 3"
          >
            <div class="lvse">待评价</div>
          </div>
          <div
            class="item"
            v-if="orderDetail.statusDto && orderDetail.statusDto.type == 4"
          >
            <div class="lvse">已完成</div>
          </div>
        </div>
        <div class="right">
          <status
            v-if="orderDetail.statusDto"
            :type="orderDetail.statusDto.type"
            :createTime="orderDetail.createTime"
          ></status>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="infoBox">
        <!--收货信息 -->
        <div class="order">
          <div class="title">收货信息</div>
          <div class="orderInfo">
            <div>收货地址: {{ orderDetail.userAddress }}</div>
            <div>收货人:{{ orderDetail.realName }}</div>
            <div>收货电话:{{ orderDetail.userPhone }}</div>
          </div>
        </div>
        <!-- 订单信息 -->
        <div class="order">
          <div class="title">订单信息</div>
          <div class="orderInfo">
            <div>订单号: {{ orderDetail.orderId }}</div>
            <div>创建时间:{{ orderDetail.createTime }}</div>
            <div>备注:{{ orderDetail.mark }}</div>
          </div>
        </div>
        <!-- 商品信息 -->
        <div class="shoping">
          <div class="top item">
            <div>宝贝</div>
            <div>宝贝属性</div>
            <div>状态</div>
            <div>数量</div>
            <div>单价</div>
          </div>
          <div
            class="bottom item"
            v-for="item in orderDetail.cartInfo"
            :key="item.id"
          >
            <div>
              <img
                :src="$api.BASEURL + item.productInfo.image"
                height="80px"
                width="80px"
              />
              <p>{{ item.productInfo.storeName }}</p>
            </div>
            <div>
              <p>{{ item.productInfo.attrInfo.sku }}</p>
            </div>
            <div>
              <p v-if="orderDetail.statusDto.type == 0">待付款</p>
              <p v-if="orderDetail.statusDto.type == 1">待发货</p>
              <p v-if="orderDetail.statusDto.type == 2">待收货</p>
              <p v-if="orderDetail.statusDto.type == 3">待评价</p>
              <p v-if="orderDetail.statusDto.type == 4">已完成</p>
            </div>
            <div>
              <p>{{ orderDetail.totalNum }}</p>
            </div>
            <div>
              <p>{{ item.productInfo.attrInfo.price }}</p>
            </div>
          </div>
        </div>
        <!-- 金额 -->
        <div class="price">
          <div>
            <span>商品总价:</span><span>￥{{ orderDetail.totalPrice }}</span>
          </div>
          <div>
            <span>运费:</span><span>￥{{ orderDetail.totalPostage }}</span>
          </div>
          <div>
            <span>需要付款:</span><span>￥{{ orderDetail.payPrice }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 取消对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <div>是否真的取消这个订单</div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cancelorder">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSearchMixin } from "@/config/mixin";
import status from "@/components/status/status.vue";
export default {
  name: "orderDetail",
  mixins: [listSearchMixin],
  components: {
    status,
  },
  data() {
    return {
      orderDetail: {}, //存储订单详情
      dialogVisible: false, //是否展示取消订单对话框
    };
  },
  created() {
    this.getorderDetail();
  },
  methods: {
    // 获取订单详情数据
    getorderDetail() {
      if (this.$route.query.orderId) {
        // 开启加载动画
        this.loading = true;
        let params = {
          url: this.$api.getorderDetail + this.$route.query.orderId,
          method: "get",
        };
        this.sendReq(params, (res) => {
          // 开启加载动画
          this.loading = false;
          console.log(res);
          if (res.status == 200) {
            this.orderDetail = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    // 支付订单
    Payimmediately() {
      let params = {
        url: this.$api.payorder,
        method: "post",
        data: {
          uni: this.orderDetail.orderId,
          from: "h5",
          paytype: "yue",
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.$message.success("支付成功");
          this.getorderDetail();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 取消订单
    cancelorder() {
      let params = {
        url: this.$api.cancelorder,
        method: "post",
        data: {
          id: this.orderDetail.orderId,
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.$message.success("取消订单成功");
          this.$router.push("/myOrder");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.banner {
  width: 1250px;
  margin: 0 auto;
  margin-bottom: 100px;
  .el-breadcrumb {
    margin: 20px 0;
  }
  .state {
    height: 300px;
    border: 1px solid #e5e5e5;
    padding: 20px 0;
    display: flex;
    .left {
      flex: 1;
      border-right: 1px solid #e5e5e5;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      > P {
        margin: 10px 0 50px 0;
      }
      > div {
        & div:nth-child(1) {
          font-size: 25px;
          font-weight: 600;
        }
        .lvse {
          color: #71b247;
        }
        .orange {
          color: #ff7800;
        }
      }
      .nofukuan {
        > div {
          margin-bottom: 15px;
        }
        .fukuan {
          cursor: pointer;
          padding: 5px 10px;
        }
        & .fukuan:hover {
          background-color: #ffd6b2;
        }
        & .cancel:hover {
          color: #ff7800;
        }
      }
      .item {
        > div {
          margin-top: 40px;
        }
      }
    }
    .right {
      flex: 3;
    }
  }
  .infoBox {
    margin-top: 20px;
    border: 1px solid #e5e5e5;
    .order {
      padding: 30px;
      border-bottom: 1px solid #e5e5e5;
      .title {
        margin-bottom: 30px;
      }
      .orderInfo {
        display: flex;
        margin-left: 70px;
        > div {
          flex: 1;
        }
      }
    }
    .shoping {
      .top {
        background-color: #ededed;
        > div {
          padding: 10px 0;
        }
      }
      .bottom {
        border-bottom: 1px solid #ededed;
        padding: 20px 0;
        align-items: center;
        & div:nth-child(1) {
          display: flex;
          align-items: center;
          > img {
            margin: 0 20px;
          }
        }
        & div:nth-child(5) {
          font-size: 15px;
          font-weight: 700;
          color: #ff7800;
        }
      }
      .item {
        display: flex;
        text-align: center;
        font-size: 12px;

        & div:nth-child(1) {
          flex: 2;
        }
        & div:nth-child(n + 2) {
          flex: 1;
        }
      }
    }
    .price {
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      > div {
        color: #666666;
        width: 250px;
        display: flex;
        justify-content: space-between;
      }
      & div:nth-child(1),
      div:nth-child(3) {
        font-size: 20px;
        & span:nth-child(2) {
          color: #ff7800;
        }
      }
      & div:nth-child(3) {
        margin-top: 20px;
      }
    }
  }
}
</style>