<template>
  <div class="myOrder">
    <!-- table栏目切换 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 公共样式title栏 -->
      <el-row class="rowbox">
        <el-col :span="6">宝贝</el-col>
        <el-col :span="3">单价</el-col>
        <el-col :span="3">数量</el-col>
        <el-col :span="3">收货人</el-col>
        <el-col :span="3">实付款</el-col>
        <el-col :span="3">状态</el-col>
        <el-col :span="3">操作</el-col>
      </el-row>
      <el-tab-pane label="待付款" name="0" v-loading="loading">
        <myOrderUi
          :orderList="myOrderList"
          @Payimmediately="Payimmediately"
          @cancelorder="cancelorder"
        >
        </myOrderUi>
      </el-tab-pane>
      <el-tab-pane label="代发货" name="1" v-loading="loading">
        <myOrderUi :orderList="myOrderList"></myOrderUi>
      </el-tab-pane>
      <el-tab-pane label="待收货" name="2" v-loading="loading">
        <myOrderUi :orderList="myOrderList" @Receipt="Receipt"></myOrderUi>
      </el-tab-pane>
      <el-tab-pane label="待评价" name="3" v-loading="loading">
        <myOrderUi :orderList="myOrderList"></myOrderUi>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="4" v-loading="loading">
        <myOrderUi
          :orderList="myOrderList"
          @deleteorder="deleteorder"
        ></myOrderUi>
      </el-tab-pane>
    </el-tabs>
    <!--  分页器-->

    <el-pagination
      v-if="myOrderList.length > 0"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-size="5"
      layout="prev, pager, next"
      :total="total"
      align="right"
    >
    </el-pagination>
  </div>
</template>


<script>
import { listSearchMixin } from "@/config/mixin";
// 导入组件
import myOrderUi from "@/components/orderInfo/myOrderUi.vue";
export default {
  name: "myOrder",
  mixins: [listSearchMixin],
  components: {
    myOrderUi,
  },
  data() {
    return {
      activeName: "0", //tagbs数值
      myOrderList: [], //存储所有我的订单信息数据
      total: 0, //总页码
      page: 1, //分页
    };
  },
  created() {
    this.getmyOrderList();
  },
  methods: {
    // 获取所有我的订单数据
    getmyOrderList() {
      // 开启加载动画
      this.loading = true;
      let params = {
        url: this.$api.getmyOrder,
        method: "get",
        payload: {
          page: this.page,
          limit: 5,
          type: this.activeName,
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        // 关闭加载动画
        this.loading = false;
        if (res.status == 200) {
          this.myOrderList = res.data.content;
          this.total = res.data.totalElements;
        }
      });
    },
    // 用户点击切换tabs栏
    handleClick() {
      // 获取当前选中tabs栏中的数据
      this.getmyOrderList();
    },
    // page发生改变
    handleCurrentChange(newpage) {
      this.page = newpage;
      this.getmyOrderList();
    },
    // 待付款页码用户点击立即支付按钮
    Payimmediately(id) {
      let params = {
        url: this.$api.payorder,
        method: "post",
        data: {
          uni: id,
          from: "h5",
          paytype: "yue",
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.$message.success("支付成功");
          this.getmyOrderList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // D待付款页码用户点击取消订单
    cancelorder(id) {
      let params = {
        url: this.$api.cancelorder,
        method: "post",
        data: {
          id,
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.$message.success("取消订单成功");
          this.getmyOrderList();
        }
      });
    },
    // 待收货页码用户点击确认收货
    Receipt(id) {
      let params = {
        url: this.$api.Receipt,
        method: "post",
        data: {
          uni: id,
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.$message.success("以确认收货");
          this.getmyOrderList();
        }
      });
    },
    // 已完成页码 用户点击删除订单
    deleteorder(id) {
      let params = {
        url: this.$api.delorder,
        method: "post",
        data: {
          uni: id,
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.$message.success("删除订单成功");
          this.getmyOrderList();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs {
  .el-tabs__header {
    border: 1px solid #e4e7ed;
    .el-tabs__nav-wrap {
      padding: 0 20px;
      .el-tabs__nav {
        padding: 10px 0;
        .el-tabs__active-bar {
          background-color: #f78521;
        }
        .is-active {
          color: #f78521;
        }
        & .el-tabs__item:hover {
          color: #f78521;
        }
      }
    }
  }
  .el-tabs__content {
    .rowbox {
      padding: 0 20px;
      background-color: #f1f2f7;
      .el-col {
        padding: 14px 0;
        text-align: center;
      }
    }
  }
}
// 分页器
::v-deep .el-pagination {
  margin-top: 50px;
  button {
    background-color: #f4f4f5;
  }
  .btn-prev,
  .btn-next {
    padding-right: 0;
    padding-left: 0;
  }
  .el-pager {
    margin: 0 10px;
    .number {
      background-color: #f4f4f5;
      margin-right: 10px;
    }
    .active {
      background-color: #f78521;
      color: white;
    }
  }
}
</style>