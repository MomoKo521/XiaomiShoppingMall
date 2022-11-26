<template>
  <div class="banner">
    <div class="address">
      <p class="ziti">请选择收货地址</p>
      <div class="addressBox" v-if="itemaddress.length !== 0">
        <div class="addressmesage">
          <p>收件人信息</p>
          <span @click="showadddialog">新增地址</span>
        </div>
        <div class="addressInfo">
          <div
            class="Info"
            v-for="item in itemaddress"
            :key="item.id"
            @click="showaddresss(item)"
          >
            <span :class="{ active: item.isDefault == 1 }"
              >{{ item.realName }}
              <i v-if="item.isDefault == 1" class="iconfont">&#xe612;</i>
            </span>
            <span>{{
              item.province + item.city + item.district + item.detail
            }}</span>
            <span>{{ item.phone }}</span>
          </div>
          <span
            class="showaddress"
            v-if="!showaddress"
            @click="hcangeshowaddres"
          >
            展开更多<i class="el-icon-arrow-down"></i>
          </span>
          <span class="showaddress" @click="hcangeshowaddres" v-else>
            收起地址<i class="el-icon-arrow-up"></i>
          </span>
        </div>
      </div>
      <div class="nodata" @click="showadddialog" v-else>
        <p>+</p>
        <div>新增收货地址</div>
      </div>
    </div>
    <div class="orderInfo">
      <p class="ziti">请确认订单信息</p>
      <div class="cartHerad item">
        <div>商品</div>
        <div>商品属性</div>
        <div>单价</div>
        <div>数量</div>
        <div>小计</div>
      </div>
      <shopOrder :cartInfList="cartInfList"></shopOrder>
    </div>
    <div class="remarks">
      <el-input
        type="textarea"
        rows="4"
        placeholder="如有其他要求,请备注"
        v-model="remarks"
      ></el-input>
    </div>
    <div class="payment">
      <div class="paymentType">
        <p>选址支付方式</p>
        <div class="Type">
          <div class="ico"><i class="iconfont green">&#xe616; </i>钱包支付</div>
          <i class="iconfont boot">&#xe612;</i>
        </div>
      </div>
      <div class="paymentbth">
        <div>
          运费：
          {{
            orderNmMoney.payPostage > 0
              ? "￥" + orderNmMoney.payPostage
              : "免运费"
          }}
        </div>
        <div>
          需付款：<span>￥{{ orderNmMoney.totalPrice }}</span>
        </div>
        <div>
          <el-button type="primary" @click="PaymentOrder">提交订单</el-button>
        </div>
      </div>
    </div>
    <!-- 新增地址对话框 -->
    <el-dialog title="新增收货地址" :visible.sync="dialogVisible" width="30%">
      <addressui @cancel="cancel" @quedingbtn="quedingbtn"></addressui>
    </el-dialog>
  </div>
</template>

<script>
import { listSearchMixin } from "@/config/mixin";
// 导入商品订单组件
import shopOrder from "@/components/orderInfo/shopOrder.vue";
//导入新增地址组件
import addressui from "@/components/orderInfo/addressui.vue";
import { mapMutations, mapState } from "vuex";
export default {
  mixins: [listSearchMixin],
  components: {
    shopOrder,
    addressui,
  },

  name: "placeOrder",
  data() {
    return {
      addressList: [], // 存储用户地址列表
      showaddress: false, //是否展开地址 默认不展开
      addressId: "", //被选中的地址id
      cartId: "", //存储商品订单ID
      cartInfList: [], //存储订单信息
      remarks: "", //备注
      key: "", //订单唯一的 key
      orderNmMoney: {}, //订单金额
      dialogVisible: false, //是否展示新增地址对话框
    };
  },
  created() {
    if (this.$route.query.cartId) {
      this.cartId = this.$route.query.cartId;
    }
  },
  mounted() {
    this.getAddress();
    this.getOrderInfo();
  },
  computed: {
    ...mapState(["newAddress"]),
    // 如果showaddress为false 默认展示一条数据  为true展示全部数据
    itemaddress() {
      //slice 返回一个新数组
      return this.showaddress ? this.addressList : this.addressList.slice(0, 1);
    },
  },
  methods: {
    ...mapMutations(["RESE_ADDRESS"]),
    // 获取地址信息
    getAddress() {
      let params = {
        url: this.$api.getAddressList,
        method: "get",
        payload: {
          limit: 100,
          page: 1,
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.addressList = res.data;
          //如果存在默认地址哪么存储默认地址id
          this.addressList.forEach((item) => {
            if (item.isDefault == 1) {
              this.addressId = item.id;
            }
          });
        }
      });
    },
    // 切换是否展示地址
    hcangeshowaddres() {
      if (this.showaddress) {
        this.showaddress = false;
      } else {
        this.showaddress = true;
      }
      //console.log(this.itemaddress);
    },
    // 切换收货地址
    showaddresss(item) {
      // 排他
      this.addressList.forEach((element) => {
        element.isDefault = 0;
      });
      item.isDefault = 1;
      this.addressId = item.id;
    },
    // 用户点击新增地址
    showadddialog() {
      this.dialogVisible = true;
      // 用户点击新增 要清除vuex中的newAddress和areaCode数据
      this.RESE_ADDRESS();
    },
    // 用户点击新增地址对话框取消按钮
    cancel() {
      this.dialogVisible = false;
    },
    //用户点击新增地址对话框确定按钮
    quedingbtn(addres) {
      let list = addres.split("-");
      let params = {
        url: this.$api.editAddress,
        method: "post",
        data: {
          real_name: this.newAddress.realName,
          phone: this.newAddress.phone,
          detail: this.newAddress.detail,
          is_default: this.newAddress.isDefault || false,
          address: {
            province: list[0],
            city: list[1],
            district: list[2],
          },
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.$message.success("新增地址成功！");
          this.dialogVisible = false;
          // 刷新收货地址数据
          this.getAddress();
        }
      });
    },

    // 获取订单信息
    getOrderInfo() {
      let params = {
        url: this.$api.getOrderInfo,
        method: "post",
        data: {
          cartId: this.cartId,
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.cartInfList = res.data.cartInfo;
          this.key = res.data.orderKey;
          // 如果有订单那么就计算订单金额
          this.orderprice();
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    // 计算订单金额
    orderprice() {
      let params = {
        url: this.$api.orderprice + this.key,
        method: "post",
        data: {
          addressId: this.addressId,
          payType: "yue",
          shipping_type: 1,
        },
      };
      this.sendReq(params, (res) => {
        // console.log(res);
        if (res.status == 200) {
          this.orderNmMoney = res.data.result;
        }
      });
    },
    // 支付订单
    PaymentOrder() {
      if (this.addressId == "") {
        this.$message.warning("请选择收货地址");
        return;
      }
      let subData = {
        addressId: this.addressId,
        couponId: 0,
        from: "h5",
        mark: this.remarks,
        payType: "yue",
        shippingType: 1,
        pinkId: 0,
      };
      let params = {
        url: this.$api.orderCreat + this.key,
        method: "post",
        data: subData,
      };

      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.$message.success(res.msg);
          // 重新获取购物车数据并更改vuex购物车数据值
          this.$store.dispatch("getshopingcart");
          // 跳转我的订单
          setTimeout(() => {
            this.$router.push({ path: "/myOrder" });
          }, 1000);
        } else if (res.msg === "余额不足") {
          this.$message.warning("余额不足");
          this.$router.push({ path: "/myOrder" });
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
  .ziti {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 20px;
  }
  // 地址
  .address {
    .addressBox {
      border: 1px solid rgb(216, 210, 210);
      padding: 20px;
      .addressmesage {
        display: flex;
        margin-bottom: 20px;
        justify-content: space-between;
        span {
          cursor: pointer;
          color: #375ab7;
        }
      }
      .addressInfo {
        margin-left: 50px;
        .Info {
          display: flex;
          margin-bottom: 10px;
          height: 30px;
          line-height: 30px;
          span {
            margin-right: 20px;
          }
          & span:nth-child(1) {
            cursor: pointer;
            text-align: center;
            width: 180px;
            border: 1px solid rgb(216, 210, 210);
            position: relative;
            // 字体图标
            .iconfont {
              position: absolute;
              right: 0;
              bottom: -1px;
              height: 14px;
              line-height: 14px;
              color: #f78521;
            }
          }
          .active {
            border: 1px solid #f78521 !important;
          }
        }
        //
        .showaddress {
          cursor: pointer;
        }
      }
    }
    .nodata {
      cursor: pointer;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: 300px;
      height: 150px;
      border: 1px solid #dbd6d6;
      color: #9c9595;
      > p {
        font-size: 40px;
      }
    }
  }
  // 订单信息
  .orderInfo {
    margin-top: 40px;
    margin-bottom: 60px;
    .cartHerad {
      margin-bottom: 30px;
      height: 50px;
      line-height: 50px;
      border: 1px solid rgb(219, 214, 214);
      background-color: #fcfcfc;
      & div:nth-child(1) {
        padding-left: 120px;
      }
    }
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
  }
  // 备注
  .remarks {
    margin-bottom: 20px;
    padding: 30px;
    background-color: #f7f7f7;
    ::v-deep .el-textarea {
      .el-textarea__inner {
        resize: none;
      }
      & .el-textarea__inner:focus {
        border-color: #f78521;
      }
    }
  }
  //支付方式
  .payment {
    margin-bottom: 20px;
    .paymentType {
      .Type {
        margin: 20px 0;
        position: relative;
        width: 150px;
        margin-left: 50px;
        line-height: 40px;
        height: 40px;
        text-align: center;
        border: 1px solid #f78521;
        .ico {
          .green {
            color: #add9a5;
          }
        }
        .boot {
          height: 15px;
          line-height: 15px;
          position: absolute;
          bottom: -1px;
          right: 0;
          color: #f78521;
        }
      }
    }
    .paymentbth {
      height: 180px;
      padding-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      background-color: #f7f7f7;
      div {
        margin: 10px;
        .el-button--primary {
          background-color: #f78521;
          border-color: #f78521;
        }
      }
      & div:nth-child(2) {
        span {
          font-weight: 550;
        }
      }
    }
  }
  // 新增地址对话框
  ::v-deep .el-dialog {
    .el-dialog__header {
      text-align: center;
      font-weight: 600;
    }
    .el-dialog__body {
      background-color: #f3f3f3;
      padding: 30px 30px;
    }
    .el-dialog__footer {
      text-align: center;
      .el-button--primary {
        background-color: #f78521;
        border: 1px solid #f78521;
      }
      & .el-button--default:hover {
        background-color: #fff2e6;
        border: 1px solid #fff2e6;
        color: #f78521;
      }
    }
  }
}
</style>