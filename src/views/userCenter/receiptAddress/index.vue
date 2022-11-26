<template>
  <div class="addressBox">
    <div class="title" @click="showaddDialog">新增收货地址</div>
    <div class="contentBox" v-if="flag">
      <div class="content" v-for="item in addresList" :key="item.id">
        <div class="addressInfo">
          <div class="setup">
            设置为收货地址
            <el-switch
              @change="wsitchaddress(item)"
              v-model="item.isDefault"
              :active-value="1"
              :inactive-value="0"
              active-color="#f78521"
              inactive-color="lightgray"
            >
            </el-switch>
          </div>
          <div>收货人：{{ item.realName }}</div>
          <div>所在地址：{{ item.province + item.city + item.district }}</div>
          <div>详细地址：{{ item.detail }}</div>
          <div>手机号：{{ item.phone }}</div>
        </div>
        <div class="btn">
          <div @click="showdeltedialog(item)">
            <i class="el-icon-delete"></i>删除
          </div>
          <div class="updatebtn" @click="showUpdateDialog(item)">
            <i class="el-icon-edit-outline"></i>修改
            <div v-if="item.isDefault">
              <img src="../../../../static/image/bianjiao2@2x.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 没有数据的盒子 -->
    <div class="nodata" v-else>
      <img src="../../../../static/image/nothing@2x.png" />
      <p>你还没有收货地址~</p>
    </div>
    <!-- 新增地址对话框 -->
    <el-dialog
      :title="isaddOrupdate == 1 ? '新增地址' : '修改地址'"
      :visible.sync="addshow"
      width="40%"
    >
      <addressui @cancel="cancel" @quedingbtn="quedingbtn"></addressui>
    </el-dialog>
    <!-- 删除地址对话框 -->
    <el-dialog
      title="是否删除地址"
      class="deletedialog"
      :visible.sync="deleteshow"
      width="40%"
    >
      <div>收货人：{{ deleteaddres.realName }}</div>
      <div>手机号：{{ deleteaddres.phone }}</div>
      <div>
        收货人地址:{{
          deleteaddres.province + deleteaddres.city + deleteaddres.district
        }}
      </div>
      <div slot="footer">
        <el-button @click="deleteshow = false">取 消</el-button>
        <el-button type="primary" @click="deleteAddress">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSearchMixin } from "@/config/mixin";
import { mapGetters, mapMutations } from "vuex";
//新增 or 修改地址组件
import addressui from "@/components/orderInfo/addressui.vue";
export default {
  name: "receiptAddress",
  components: {
    addressui,
  },
  mixins: [listSearchMixin],
  data() {
    return {
      addresList: [], //存储用户地址
      deleteaddres: {}, //存储要删除的地址信息
      deleteshow: false, //删除对话框的展示与隐藏
      addshow: false, //添加或修改地址对话框
      isaddOrupdate: 1, //判断执行添加地址还是修改地址  1新增地址 0修改地址
      flag: true, //判断是否有数据
    };
  },
  created() {
    this.getAddress();
  },
  computed: {
    ...mapGetters(["newAddress"]),
  },
  methods: {
    ...mapMutations(["SET_NEWADDRESS", "SET_AREACODE", "RESE_ADDRESS"]),
    // 获取用户地址列表
    getAddress() {
      let params = {
        url: this.$api.getAddressList,
        method: "get",
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.addresList = res.data;
          if (this.addresList.length > 0) {
            this.flag = true;
          } else {
            this.flag = false;
          }
        }
      });
    },
    // 用户点击新增地址按钮
    showaddDialog() {
      this.isaddOrupdate = 1;
      this.addshow = true;
      // 用户点击新增 要清除vuex中的newAddress和areaCode数据
      this.RESE_ADDRESS();
    },
    //用户点击取消修改或者添加
    cancel() {
      this.addshow = false;
    },
    // 用户点击确定添加或者修改确定按钮
    quedingbtn(addres) {
      // addres 添加和修改的地区参数
      if (this.isaddOrupdate == 1) {
        this.addAddress(addres);
      } else {
        // 修改的数据
        this.$store.state.newAddress.receiveAdress = addres;
        this.updateAddress();
      }
    },
    // 添加地址
    addAddress(addres) {
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
        if (res.status == 200) {
          this.$message.success("添加地址成功");
          //  刷新数据
          this.getAddress();
          // 关闭对话框
          this.addshow = false;
        }
      });
      ///console.log(params);
    },
    // 用户点击修改按钮
    showUpdateDialog(item) {
      this.isaddOrupdate = 0;
      this.addshow = true;
      // 把要修改的值存储到vuex中newAddress
      let params = {
        receiveAdress: item.province + "-" + item.city + "-" + item.district, //地址
        detail: item.detail, //详情地址
        realName: item.realName, //收货人
        phone: item.phone, //手机号
        isDefault: item.isDefault === 1, //重点  一定要这样写才行
        adressid: item.id, //id
      };
      this.SET_NEWADDRESS(params);
      // 存储当前区域编号到vuex中
      let code = [];
      code.push(item.province);
      code.push(item.city);
      code.push(item.district);
      this.SET_AREACODE(code);
    },
    //switch触发
    wsitchaddress(item) {
      // 把要修改的值添加vuex中newAddress
      let params = {
        receiveAdress: item.province + "-" + item.city + "-" + item.district, //地址
        detail: item.detail, //详情地址
        realName: item.realName, //收货人
        phone: item.phone, //手机号
        isDefault: item.isDefault === 1, //重点  一定要这样写才行
        adressid: item.id, //id
      };
      this.SET_NEWADDRESS(params);
      // 存储当前区域编号到vuex中
      let code = [];
      code.push(item.province);
      code.push(item.city);
      code.push(item.district);
      this.SET_AREACODE(code);
      // 调用修改地址方法
      this.updateAddress();
    },
    // 修改地址
    updateAddress() {
      // split 分割  字符串转数组
      let list = this.newAddress.receiveAdress.split("-");
      let params = {
        url: this.$api.editAddress,
        method: "post",
        data: {
          id: this.newAddress.adressid,
          real_name: this.newAddress.realName,
          phone: this.newAddress.phone,
          detail: this.newAddress.detail,
          is_default: this.newAddress.isDefault,
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
          this.$message.success("修改地址成功");
          // 刷新数据
          this.getAddress();
          // 关闭对话框
          this.addshow = false;
        }
      });
    },
    // 用户点击删除地址显示删除地址对话框
    showdeltedialog(item) {
      this.deleteaddres = item;
      this.deleteshow = true;
    },
    //删除地址
    deleteAddress() {
      let params = {
        url: this.$api.deleteAddress,
        method: "post",
        data: {
          id: this.deleteaddres.id,
        },
      };
      this.sendReq(params, (res) => {
        if (res.status == 200) {
          this.$message.success("删除成功");
          this.deleteshow = false;
          // 刷新数据
          this.getAddress();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.addressBox {
  border: 1px solid lightgray;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  .title {
    margin-bottom: 20px;
    padding: 5px 0;
    font-size: 10px;
    width: 130px;
    border-radius: 5px;
    text-align: center;
    color: #f78521;
    border: 1px solid #f78521;
    cursor: pointer;
  }
  .contentBox {
    display: flex;
    flex-wrap: wrap;
    .content {
      margin: 0px 22px 20px 0px;
      border: 1px solid lightgray;
      width: 470px;
      box-sizing: border-box;
      .addressInfo {
        padding: 10px 30px;
        > div {
          margin-bottom: 25px;
        }
        .setup {
          text-align: right;
        }
      }
      .btn {
        display: flex;
        border-top: 1px solid lightgray;
        > div {
          flex: 1;
          text-align: center;
          padding: 15px 0;
          cursor: pointer;
        }
        > div:nth-child(1) {
          border-right: 1px solid lightgray;
        }
        .updatebtn {
          color: #f78521;
          position: relative;
          > div {
            position: absolute;
            bottom: -5px;
            right: 0px;
          }
        }
      }
    }
  }
  //没有数据盒子
  .nodata {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    > p {
      color: #a19b9b;
    }
  }
  // 对话框
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
  .deletedialog {
    .el-dialog__body {
      > div {
        margin-bottom: 20px;
      }
    }
  }
}
</style>