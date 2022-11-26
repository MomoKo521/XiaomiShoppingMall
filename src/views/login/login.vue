<template>
  <div>
    <div class="title">
      <img src="../../assets/images/cereshop/home/eshop.png" alt="" />
      <div class="titlecontent">欢迎来到PC商城</div>
    </div>
    <div class="login_box">
      <div class="loginForm">
        <h2 v-text="flag == 1 ? '登陆' : '注册'"></h2>
        <el-form
          ref="form"
          :model="loginInfo"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="手机号">
            <el-input
              placeholder="请输入您的手机号"
              v-model="loginInfo.phone"
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码" v-if="flag != 1">
            <el-input
              placeholder="请输入验证码"
              v-model="loginInfo.code"
            ></el-input>
            <div
              class="code"
              @click="getCode"
              v-text="vCode ? vCode : '获取验证码'"
            ></div>
          </el-form-item>
          <el-form-item label="昵称" v-if="flag != 1">
            <el-input
              placeholder="请输入您的昵称"
              v-model="loginInfo.nickname"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              placeholder="请输入您的密码"
              v-model="loginInfo.passwrod"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" v-if="flag != 1">
            <el-input
              placeholder="请输入确认密码"
              v-model="loginInfo.passwrodCopy"
            ></el-input>
          </el-form-item>
          <div class="loginchangge">
            <div v-if="flag == 1">
              <el-checkbox v-model="loginTime"></el-checkbox>免登录七天
            </div>
            <a
              href="javascript:void(0)"
              v-text="flag == 1 ? '注册' : '登陆'"
              @click="loginrgestchange"
            ></a>
          </div>
          <div
            class="loginbtn"
            v-text="flag == 1 ? '登陆' : '注册'"
            @click="result"
          ></div>
        </el-form>
        <!-- 协议 -->
        <div class="xieyi" v-if="flag != 1">
          <el-checkbox v-model="isagreement"></el-checkbox
          >阅读并同意《eshop服务协议》
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入axios请求函数
import { listSearchMixin } from "../../config/mixin";
import Cookie from "js-cookie";
import { mapMutations } from "vuex";
export default {
  mixins: [listSearchMixin],
  name: "login",
  data() {
    return {
      //收集登陆注册表单数据
      loginInfo: {
        phone: "", //手机号
        code: "", //验证码
        nickname: "", //昵称
        passwrod: "", //密码
        passwrodCopy: "", //重复密码
      },
      isagreement: false, //是否勾选协议
      loginTime: false, //是否免登录七天 false时长一天  true 时长7天
      flag: "1", //判断当前是展示登陆功能还是注册功能
      vCode: "", //存储接口返回的验证码
    };
  },
  methods: {
    //映射vuexmutations中存储用户信息方法
    ...mapMutations(["SET_USERINFO"]),
    // 登陆与注册切换
    loginrgestchange() {
      this.flag == 1 ? (this.flag = 2) : (this.flag = 1);
      // 每次切换重置组件数据
      this.loginInfo.phone = "";
      this.loginInfo.code = "";
      this.loginInfo.nickname = "";
      this.loginInfo.passwrod = "";
      this.loginInfo.passwrodCopy = "";
      this.isagreement = false;
      this.loginTime = false;
    },
    //获取验证码
    getCode() {
      let xy = /^1[123456789]\d{9}$/;
      // 判断是否为空
      if (this.loginInfo.phone == "") {
        this.$message.warning("请输入你的手机号");
        return;
      }
      //收集格式验证
      if (!xy.test(this.loginInfo.phone)) {
        this.$message.warning("手机号码格式不对");
        return;
      }
      //axios参数
      let params = {
        url: this.$api.vCode,
        method: "post",
        data: {
          phone: this.loginInfo.phone,
        },
      };
      //使用listSearchMixin  文件混入的axios封装请求函数
      this.sendReq(params, (data) => {
        if (data.status == 200) {
          this.vCode = data.data;
        }
      });
    },
    // 判断用户点击按钮登陆还是注册
    result() {
      if (this.flag == 1) {
        //登陆
        this.login();
      } else {
        // 注册
        this.register();
      }
    },
    // 注册请求
    register() {
      let xy = /^1[123456789]\d{9}$/;
      // 判断是否为空
      if (this.loginInfo.phone == "") {
        this.$message.warning("请输入你的手机号");
        return;
      }
      //收集格式验证
      if (!xy.test(this.loginInfo.phone)) {
        this.$message.warning("手机号码格式不对");
        return;
      }
      //判断验证码正不正确
      if (this.loginInfo.code != this.vCode || this.loginInfo.code == "") {
        this.$message.warning("验证码错误");
        return;
      }
      // 判断数据是否为空
      if (
        this.loginInfo.nickname.trim() == "" ||
        this.loginInfo.passwrod.trim() == "" ||
        this.loginInfo.passwrodCopy.trim() == ""
      ) {
        this.$message.warning("请输入完整的信息");
        return;
      }
      //判断两次密码是否一致
      if (this.loginInfo.passwrod != this.loginInfo.passwrodCopy) {
        this.$message.warning("两次密码不一致");
        return;
      }
      // 判断是否勾选协议
      if (this.isagreement == false) {
        this.$message.warning("请勾选协议");
        return;
      }
      // 全部符合条件发送注册接口请求
      let parapms = {
        url: this.$api.register,
        method: "post",
        data: {
          account: this.loginInfo.phone,
          captcha: this.loginInfo.code,
          nickname: this.loginInfo.nickname,
          password: this.loginInfo.passwrod,
        },
      };
      this.sendReq(parapms, (item) => {
        if (item.status == 200) {
          this.$message.success(item.msg);
          // 跳转路由 注册页面
          // this.$router.push("/login", () => {});
          this.loginrgestchange();
        }
      });
    },
    // 登陆
    login() {
      let xy = /^1[123456789]\d{9}$/;
      // 判断是否为空
      if (this.loginInfo.phone == "") {
        this.$message.warning("请输入你的手机号");
        return;
      }
      //收集格式验证
      if (!xy.test(this.loginInfo.phone)) {
        this.$message.warning("手机号码格式不对");
        return;
      }
      // 判断数据是否为空
      if (this.loginInfo.passwrod.trim() == "") {
        this.$message.warning("请输入完整的信息");
        return;
      }
      // 发送登陆请求：
      let params = {
        url: this.$api.login,
        method: "post",
        data: {
          password: this.loginInfo.passwrod,
          username: this.loginInfo.phone,
        },
      };
      this.sendReq(params, (item) => {
        //console.log(item);
        if (item.status == 200) {
          // 存储token值
          if (this.loginTime) {
            // cookie保存token时长为7天
            Cookie.set("token", item.data.token, { expires: 7 });
          } else {
            // cookie保存token时长为1天
            Cookie.set("token", item.data.token, { expires: 1 });
          }
          // 根据token获取用户信息
          this.getUserInfo();
          // 跳转首页
          this.$message.success("登陆成功！");
          this.$router.push("/");
        } else {
          this.$message.warning(item.msg);
        }
      });
    },
    // 获取用户信息
    getUserInfo() {
      let params = {
        url: this.$api.getUserInfo,
        method: "get",
      };
      this.sendReq(params, (item) => {
        //console.log(item);
        //使用vuex mutations 方法映射  存储用户信息
        this.SET_USERINFO(item.data);
      });
    },
  },
  created() {
    if (this.$route.query.type) {
      this.flag = this.$route.query.type;
    }
  },
};
</script>

<style  lang='scss' scoped>
.title {
  height: 100px;
  width: 1230px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  .titlecontent {
    margin-left: 30px;
    font-style: 24px;
  }
}
.login_box {
  min-height: 760px;
  height: 100vh;
  background: url(../../assets/images/loginBg.jpg) no-repeat;
  background-size: cover; //按照图片的比例放大或者缩小至充满容器
  display: flex;
  justify-content: center;
  align-items: center;
  .loginForm {
    width: 480px;

    background-color: white;
    border-radius: 5px;
    h2 {
      font-size: 28px;
      color: #ff8113;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80px;
      &:after {
        content: "";
        height: 2px;
        width: 98px;
        margin-left: 20px;
        background: url(../../assets/images/dyou.png) no-repeat;
      }
      &:before {
        content: "";
        height: 2px;
        width: 98px;
        background: url(../../assets/images/dzuo.png) no-repeat;
        margin-right: 20px;
      }
    }
  }
}
::v-deep .el-form {
  padding: 0 30px 20px 30px;

  .el-input__inner {
    border: none;
    border-bottom: 1px solid gray;
    padding: 0;
  }
  .el-form-item__label {
    padding: 0;
    line-height: initial;
    font-weight: 500;
  }

  .el-form-item__content {
    line-height: initial;
    position: relative;
    // 验证码
    .code {
      display: inline-block;
      padding: 10px 20px;
      background-color: #dcdcdc;
      position: absolute;
      right: 0;
      top: -20px;
      cursor: pointer;
    }
  }
  .loginchangge {
    overflow: hidden;
    a {
      color: black;
      float: right;
    }
    div {
      float: left;
      font-weight: 500;
      display: flex;
      align-items: center;
      .el-checkbox__inner {
        margin-right: 8px;
      }
    }
  }
  .loginbtn {
    margin: 20px 0;
    width: 100%;
    padding: 5px 0;
    background-color: #ff8f05;
    color: white;
    text-align: center;
  }
}
.xieyi {
  border-top: 1px solid rgb(175, 170, 170);
  line-height: 50px;
  color: rgb(49, 43, 43);
  padding-left: 20px;
  ::v-deep .el-checkbox__inner {
    margin-right: 8px;
  }
}
</style>