<template>
  <div class="shoppingCartBannr">
    <div class="title">全部商品 {{ cartInfoList.length }}</div>
    <div class="orderInfoBox">
      <div class="cartHerad item">
        <div>
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
            >全选</el-checkbox
          >
        </div>
        <div>商品名称</div>
        <div>商品属性</div>
        <div>单价</div>
        <div>数量</div>
        <div>小计</div>
        <div>操作</div>
      </div>
      <div class="cartBody item" v-for="item in cartInfoList" :key="item.id">
        <div>
          <el-checkbox
            v-model="item.ischeck"
            @change="CheckChange"
          ></el-checkbox>
        </div>
        <div>
          <img :src="$api.BASEURL + item.productInfo.image" alt="" />
          <p>{{ item.productInfo.storeName }}</p>
        </div>
        <div>{{ item.productInfo.attrInfo.sku }}</div>
        <div>￥{{ item.productInfo.attrInfo.price }}</div>
        <div>
          <el-input-number
            v-model="item.cartNum"
            :min="1"
            :max="item.productInfo.attrInfo.stock"
            @change="handleChange(item)"
            label="描述文字"
          ></el-input-number>
        </div>
        <div>￥{{ item.productInfo.attrInfo.price * item.cartNum }}</div>
        <div class="deletecart" @click="deletecart(item.id)">删除</div>
      </div>
      <!-- 没有数据时展示的盒子 -->
      <div class="nodate" v-if="cartInfoList.length == 0">
        <img src="../../../static/image/nothing@2x.png" alt="" />
        <p>你的购物车暂时没有商品呢</p>
      </div>
    </div>
    <div class="settlement">
      <div style="cursor: pointer" @click="deleteAll">删除</div>
      <div>已选商品 {{ changeorder.length }} 件</div>
      <div class="js">
        合计(不含运费):<span>￥{{ sumprice }}</span>
        <span @click="settlement">结算</span>
      </div>
    </div>
    <!-- 是否删除对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="25%"
      :before-close="handleClose"
    >
      <p>确定要删除此商品嘛？</p>
      <p>删除后购物车将不存在该商品,确定要删除嘛？</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="qdbtn" @click="deletecartInfo"
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
import { listSearchMixin } from "@/config/mixin";
import { mapMutations } from "vuex";
export default {
  name: "shoppingCart",
  mixins: [listSearchMixin],
  data() {
    return {
      cartInfoList: [], //存储订单数据
      checkAll: false, //是否全选
      dialogVisible: false, //是否展示对话框
      changeorder: [], //已选择商品数量
      arrId: [], //存储删除购物车的ID
    };
  },
  created() {
    this.getcartInfo();
  },
  computed: {
    // 合计价钱
    sumprice() {
      let sum = 0;
      // 过滤出被选中的值
      this.changeorder = this.cartInfoList.filter((item) => item.ischeck);
      this.changeorder.forEach((item) => {
        sum += item.productInfo.attrInfo.price * item.cartNum;
      });
      return sum;
    },
  },
  methods: {
    ...mapMutations(["SET_SHOPPINGCART"]),
    // 获取购物车
    getcartInfo() {
      let params = {
        url: this.$api.getcartInfo,
        method: "get",
      };
      this.sendReq(params, (item) => {
        // console.log(item);
        this.cartInfoList = item.data.valid;
        // 更新vuex中的数据
        this.SET_SHOPPINGCART(this.cartInfoList);
        // 给每个添加一个双向绑定是否选中属性
        this.cartInfoList.forEach((item) => {
          this.$set(item, "ischeck", false); //默认全部未选中
        });
      });
    },
    // 订单全选按钮发生改变
    handleCheckAllChange() {
      // console.log(this.checkAll);
      // 全选
      if (this.checkAll) {
        // 获取全部订单信息的值
        // 订单全部选中
        this.cartInfoList.forEach((item) => {
          item.ischeck = true;
        });
      } else {
        // 不全选
        this.cartInfoList.forEach((item) => {
          item.ischeck = false;
        });
      }
    },
    //订单每项多选框发生变化
    CheckChange() {
      let falg = this.cartInfoList.every((item) => {
        return item.ischeck;
      });
      if (falg) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    // 订单信息数量发生改变
    handleChange(item) {
      let params = {
        url: this.$api.shoppingcartNumchange,
        method: "post",
        data: {
          number: item.cartNum,
          id: item.id,
        },
      };
      this.sendReq(params, (res) => {
        if (res.status == 200) {
          this.$message.success("修改成功");
          // this.getcartInfo();
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    // 对话框关闭
    handleClose() {
      this.dialogVisible = false;
    },
    // 用户点击删除单个购物车
    deletecart(id) {
      // 重置数据
      this.arrId = [];
      // 关闭对话框
      this.dialogVisible = true;
      this.arrId.push(id);
    },
    // 用户点击删除全部以勾选的商品
    deleteAll() {
      // 重置数据
      this.arrId = [];
      this.changeorder.forEach((element) => {
        this.arrId.push(element.id);
      });
      //展示对话框
      this.dialogVisible = true;
    },
    // 删除购物车
    deletecartInfo() {
      this.dialogVisible = false;

      if (this.arrId.length > 0) {
        // 发生删除请求
        let params = {
          url: this.$api.deleteCart,
          method: "post",
          data: {
            ids: this.arrId,
          },
        };
        this.sendReq(params, (res) => {
          res;
          if (res.status == 200) {
            this.$message.success("删除成功");
            //刷新购物车数据
            this.getcartInfo();
          }
        });
      } else {
        this.$message("前至少选择一个要删除的商品");
      }
    },
    // 结算
    settlement() {
      //获取被选中的id
      this.arrId = [];
      this.changeorder.forEach((element) => {
        this.arrId.push(element.id);
      });
      if (this.arrId.length > 0) {
        let cartId = this.arrId.join(",");
        //跳转结算页面把 购物车id传递过去
        this.$router.push({ name: "placeOrder", query: { cartId: cartId } });
      } else {
        this.$message("请至少选择一个要结算的商品");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// 版心
.shoppingCartBannr {
  width: 1250px;

  margin: 0 auto;
  .title {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 600;
    color: #f78521;
  }
  .orderInfoBox {
    .cartHerad {
      height: 50px;
      line-height: 50px;
      border: 1px solid rgb(219, 214, 214);
      background-color: #f1f2f7;
      & div:nth-child(2) {
        padding-left: 45px;
        width: 20%;
      }
    }
    .item {
      display: flex;
      align-items: center;
      > div {
        width: 15%;
        box-sizing: border-box;
      }
      .deletecart {
        cursor: pointer;
      }
      // 从第二个div开始居中对齐
      & div:nth-child(n + 3) {
        text-align: center;
      }
      & div:nth-child(1) {
        text-align: center;
      }
      & div:nth-child(2) {
        width: 20%;
      }
    }
    .cartBody {
      display: flex;
      border: 1px solid rgb(219, 214, 214);
      border-collapse: collapse;
      height: 140px;
      & div:nth-child(1) {
        .el-checkbox-group {
          margin: 0 auto;
        }
      }
      & div:nth-child(2) {
        display: flex;
        align-items: center;
        img {
          margin-right: 20px;
          width: 80px;
          height: 80px;
        }
      }
      & div:nth-child(6) {
        color: #f78521;
      }
    }
    // 没有数据
    .nodate {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #66666666;
      justify-content: center;
      height: 500px;
      img {
        height: 300px;
        width: 300px;
      }
    }
  }
  .settlement {
    margin-top: 30px;
    margin-bottom: 60px;
    display: flex;
    justify-content: space-between;
    height: 80px;
    line-height: 80px;
    background-color: #f4f4f8;
    & div:nth-child(1) {
      margin-left: 50px;
    }
    .js {
      & span:nth-child(1) {
        color: #f78521;
        margin: 0 15px;
      }
      & span:nth-child(2) {
        display: inline-block;
        width: 150px;
        height: 100%;
        text-align: center;
        color: white;
        background-color: #f78521;
        cursor: pointer;
      }
    }
  }
  //删除购物车对话框
  ::v-deep .el-dialog__wrapper {
    .el-dialog {
      padding-bottom: 30px;
      .el-dialog__body {
        text-align: center;
        padding: 0;
        p {
          margin: 40px;
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