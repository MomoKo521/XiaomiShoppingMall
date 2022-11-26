<template>
  <div class="myInfobox">
    <div>
      <span>昵称</span><span>{{ userInfo.nickname }}</span>
    </div>
    <div class="phonebox">
      <span>手机号：</span>
      <div v-if="isiupt">
        <span>{{ userInfo.phone }}</span>
        <a href="javascript:void(0)" @click="isiupt = false">修改</a>
      </div>
      <div v-else class="xiugai">
        <el-input v-model="userInfo.phone"></el-input>
        <a href="javascript:void(0)" @click="updatePhone">保存</a>
      </div>
    </div>
    <div>
      <span>账户余额：</span><span>￥{{ userInfo.nowMoney }}</span>
    </div>
    <div>
      <span>原密码：</span
      ><span
        ><el-input
          v-model="primaryPassword"
          show-password
          placeholder="请输入原密码"
        ></el-input
      ></span>
    </div>
    <div>
      <span>新密码</span
      ><span
        ><el-input
          v-model="newPassword"
          show-password
          placeholder="请输入新密码"
        ></el-input
      ></span>
    </div>
    <div>
      <span>重复密码</span
      ><span
        ><el-input
          v-model="repeatPssword"
          show-password
          placeholder="请输入重复新密码"
        ></el-input
      ></span>
    </div>
    <div>
      <span></span
      ><span><el-button @click="updatePassword">修改密码</el-button></span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { listSearchMixin } from "@/config/mixin";
export default {
  name: "myInfo",
  mixins: [listSearchMixin],
  data() {
    return {
      isiupt: true, //展示手机号和修改手机号
      primaryPassword: "", //输入框原密码
      newPassword: "", //新密码
      repeatPssword: "", //重复新密码
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    this.getuserInfo();
  },
  methods: {
    ...mapMutations(["SET_USERINFO"]),
    //获取用户信息
    getuserInfo() {
      let params = {
        url: this.$api.getUserInfo,
        method: "get",
      };
      this.sendReq(params, (item) => {
        //使用vuex mutations 方法映射  存储用户信息
        // console.log(item);
        this.SET_USERINFO(item.data);
      });
    },
    // 用户点击保存修改手机号按钮
    async updatePhone() {
      // 先效验手机号格式
      let reg = /^1[123456789]\d{9}$/;
      if (!reg.test(this.userInfo.phone)) {
        this.$message.warning("手机号码格式不对,无法修改");
        return;
      }
      let flag = await this.$confirm(
        "此操作将永久修改手机号, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 判断用户点击确定还是取消
      if (flag == "confirm") {
        // 用户点击确定
        this.isiupt = true;
        let params = {
          url: this.$api.uptUserInfo,
          method: "post",
          data: {
            phone: this.userInfo.phone,
          },
        };
        this.sendReq(params, (res) => {
          // console.log(res);
          if (res.status == 200) {
            this.$message.success("修改手机号成功");
          } else {
            this.$message.error(res.msg);
          }
          // 不管是否执行成功 刷新数据
          this.getuserInfo();
        });
      } else {
        //用户修改了数据但是单机取消保存  那么我们还是获取到原来的数据
        this.getuserInfo();
        this.isiupt = true;
      }
    },
    // 用户点击修改密码
    async updatePassword() {
      //效验数据
      // 是否为空
      if (
        this.primaryPassword.trim() == "" ||
        this.newPassword.trim() == "" ||
        this.repeatPssword.trim() == ""
      ) {
        this.$message.warning("请输入完整信息");
        return;
      }
      //新密码是否和重复密码一致
      if (this.newPassword != this.repeatPssword) {
        this.$message.warning("新密码和重复密码不一致");
        return;
      }

      let flag = await this.$confirm(
        "此操作将永久修改密码, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 判断用户点击确定还是取消
      if (flag == "confirm") {
        // 发送修改密码操作
        let params = {
          url: this.$api.updateUserPassword,
          method: "post",
          data: {
            newPassword: this.newPassword, //用户新密码
            password: this.primaryPassword, //用户旧密码
          },
        };
        this.sendReq(params, (res) => {
          if (res.status == 200) {
            this.$message.success("修改密码成功");
            // 重置修改密码表单
            this.primaryPassword = "";
            this.newPassword = "";
            this.repeatPssword = "";
          } else {
            this.$message.warning(res.msg);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.myInfobox {
  border: 1px solid lightgray;
  padding: 40px 30px;
  .el-input {
    width: 150px;
  }
  > div {
    display: flex;
    padding: 20px 0px;
    & span:nth-child(1) {
      width: 120px;
    }
  }
  .phonebox {
    a {
      color: #f78521;
      margin-left: 20px;
    }

    .xiugai {
      display: flex;
      align-items: center;
    }
  }
  .el-button {
    border: 1px solid #f78521;
    color: #f78521;
    padding: 10px 45px;
  }
  & .el-button:hover {
    background-color: transparent;
  }
}
</style>