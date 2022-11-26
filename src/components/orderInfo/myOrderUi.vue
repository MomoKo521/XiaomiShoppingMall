<template>
  <!-- 我的订单组件 -->
  <div class="order">
    <div v-if="orderList.length > 0">
      <div class="OrderUi" v-for="item in orderList" :key="item.id">
        <div class="title">
          <div>{{ item.createTime }}</div>
          <div>订单号:{{ item.orderId }}</div>
        </div>
        <div class="content" v-for="items in item.cartInfo" :key="items.id">
          <el-row class="orderRow">
            <el-col :span="6">
              <div class="imagebox">
                <img
                  :src="$api.BASEURL + items.productInfo.image"
                  style="height: 86px"
                />
              </div>
              <div class="iamgeInfo">
                <p>{{ items.productInfo.storeName }}</p>
                <p style="color: gray">
                  {{ items.productInfo.attrInfo.sku }}
                </p>
              </div>
            </el-col>
            <el-col :span="3">￥{{ items.productInfo.attrInfo.price }}</el-col>
            <el-col :span="3">{{ items.cartNum }}</el-col>
            <el-col :span="3">{{ item.realName }}</el-col>
            <el-col :span="3">
              <div>￥{{ item.totalPrice }}</div>
              <div>免邮费</div>
            </el-col>
            <el-col :span="3">
              <div style="color: #f78521">{{ item.statusDto.title }}</div>
              <div style="cursor: pointer" @click="goOrderDetail(item.unique)">
                订单详情
              </div>
            </el-col>
            <el-col :span="3" class="caoazuo">
              <!-- 操作 -->
              <div v-if="item.statusDto.type == 0">
                <div class="btn" @click="$emit('Payimmediately', item.orderId)">
                  立即支付
                </div>
                <div class="liane" @click="$emit('cancelorder', item.orderId)">
                  取消订单
                </div>
              </div>
              <div v-if="item.statusDto.type == 1">
                <div class="btn" @click="remind">提醒发货</div>
              </div>
              <div v-if="item.statusDto.type == 2">
                <div class="btn" @click="qrReceipt(item.orderId)">确认收货</div>
              </div>
              <div v-if="item.statusDto.type == 3">
                <div class="liane" @click="goevaluate(item)">评价</div>
              </div>
              <div v-if="item.statusDto.type == 4">
                <div class="liane" @click="$emit('deleteorder', item.orderId)">
                  删除订单
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 没有数据 -->
    <div class="nodata" v-else>
      <img src="../../../static/image/noorder@2x.png" />
      <p style="margin-bottom: 30px">你还没有订单哦~</p>
      <router-link to="/">去首页看看吧</router-link>
    </div>
    <!-- 确认收货对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <p>是否确认收货</p>
      <p>为了保证您的售后权益，请收到商品检查无误后在确认收货</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="qdbtn" @click="btnReceipt"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false" class="cancelbth"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "myOrderUi",
  props: ["orderList"],
  data() {
    return {
      dialogVisible: false, //是否展示确认收货对话框
      orderId: null, //存储订单id
    };
  },
  methods: {
    // 提醒发货
    remind() {
      this.$message.success("提醒发货成功");
    },
    // 跳转订单详情页
    goOrderDetail(unique) {
      //unique 订单 唯一key   unique：翻译 唯一
      this.$router.push({ name: "orderDetail", query: { orderId: unique } });
    },
    //用户点击确认收货
    qrReceipt(id) {
      this.dialogVisible = true;
      this.orderId = id;
    },
    // 用户点击dialo确定收货按钮
    btnReceipt() {
      this.dialogVisible = false;
      this.$emit("Receipt", this.orderId);
    },
    //跳转评价页面
    goevaluate(item) {
      this.$router.push({
        name: "evaluate",
        query: { product: JSON.stringify(item) },
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.order {
  .OrderUi {
    border: 1px solid #e4e7ed;
    margin-top: 20px;
    .title {
      display: flex;
      padding: 15px 30px;
      background-color: #f3f3f3;
      & div:nth-child(1) {
        margin-right: 30px;
      }
    }
    .content {
      padding: 20px;
      .orderRow {
        font-size: 13px;
        display: flex;
        align-items: center;
        & .el-col:nth-child(n + 2) {
          text-align: center;
        }
        & .el-col:nth-child(1) {
          display: flex;
          .imagebox {
            margin-right: 10px;
          }
          .iamgeInfo {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }
        .caoazuo {
          display: flex;
          justify-content: center;
          .btn {
            padding: 5px 15px;
            margin-bottom: 5px;
            cursor: pointer;
            border: 1px solid #f78521;
            color: #f78521;
          }
          .liane {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
    }
  }
  // 没有数据
  > .nodata {
    text-align: center;
    padding: 100px 0;
    .router-link-active {
      text-decoration: none;
      color: white;
      background-color: #f78521;
      padding: 10px 20px;
    }
  }
  //确认收货对话框
  ::v-deep .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__body {
        text-align: center;
        padding: 0;
        p {
          margin: 20px;
        }
      }
      .el-dialog__footer {
        text-align: center;
        .el-button {
          padding: 15px 45px;
        }
        .qdbtn {
          background-color: #f78521;
          border-color: #f78521;
        }
        .cancelbth {
          border-color: #f78521;
          color: #f78521;
        }
        & .cancelbth:hover {
          background-color: white;
        }
      }
    }
  }
}
</style>