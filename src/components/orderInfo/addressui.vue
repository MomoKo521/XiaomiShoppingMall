<template>
  <div class="addressuibox">
    <el-form ref="form" :model="newAddress" label-width="80px" :rules="rules">
      <el-form-item label="所在地区">
        <!--  @change="handleChange"
        options  数据源 
         v-model 选中的值 
         props  配置项-->
        <el-cascader
          @change="handleChange"
          v-model="$store.state.areaCode"
          :options="tAreaList"
          :props="props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="detail">
        <el-input
          type="textarea"
          rows="2"
          v-model="newAddress.detail"
        ></el-input>
      </el-form-item>
      <el-form-item label="收货人" prop="realName">
        <el-input v-model="newAddress.realName"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="newAddress.phone"></el-input>
      </el-form-item>
      <el-form-item style="font-weight: 600">
        <el-checkbox v-model="newAddress.isDefault"></el-checkbox>
        设置为默认收货地址
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="determine">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { listSearchMixin } from "@/config/mixin";
import { mapGetters } from "vuex";
export default {
  name: "addressui",
  mixins: [listSearchMixin],
  computed: {
    ...mapGetters(["newAddress"]),
  },
  data() {
    var checkAge = (rule, value, callback) => {
      let bds = /^1[123456789]\d{9}$/;
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }

      if (!bds.test(value)) {
        return callback(new Error("手机号码格式不对"));
      }
      callback();
    };
    return {
      // 表单效验规则
      rules: {
        detail: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        realName: [
          { required: true, message: "请输入收货人", trigger: "blur" },
        ],
        phone: [{ validator: checkAge, trigger: "blur" }],
      },
      tAreaList: [], //存储联级选择器的所有地址信息
      arrList: [], //存储存储联级选择器选中的值
      props: {
        value: "label",
        label: "label",
      }, //联级选择器配置项
    };
  },
  created() {
    this.getArea();
  },
  methods: {
    //获取联级选择器地区信息
    getArea() {
      let prarams = {
        url: this.$api.getArea,
        method: "get",
      };
      this.sendReq(prarams, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.tAreaList = res.data;
        }
      });
    },
    // 联级选择器发生改变
    handleChange(arr) {
      this.arrList = arr;
    },
    //用户点击取消
    cancel() {
      this.$emit("cancel");
    },
    // 用户点击确定
    determine() {
      //  先表达效验

      this.$refs.form.validate((flag) => {
        if (this.$store.state.areaCode.length <= 0) {
          this.$message.warning("请选择所在地区");
          return;
        }
        if (flag) {
          let addres = `${this.arrList[0]}-${this.arrList[1]}-${this.arrList[2]}`;

          this.$emit("quedingbtn", addres);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoepd>
.addressuibox {
  box-sizing: border-box;
  padding: 10px 100px;
  .el-form {
    .el-cascader {
      width: 100%;
      .el-input__inner {
        width: 100%;
      }
    }
    .el-textarea__inner {
      resize: none;
    }
  }
  .footer {
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
</style>