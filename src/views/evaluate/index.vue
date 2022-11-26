<template>
  <div class="evaluatebox">
    <div class="banner">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/myOrder' }"
          >我的订单</el-breadcrumb-item
        >
        <el-breadcrumb-item class="pj">评价</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 内容盒子 -->
      <div class="content" v-for="item in evaluate.cartInfo" :key="item.id">
        <div class="left">
          <img :src="$api.BASEURL + item.productInfo.image" />
          <p class="price">
            ￥<span>{{ item.productInfo.attrInfo.price }}</span>
          </p>
          <p class="sku">{{ item.productInfo.attrInfo.sku }}</p>
        </div>
        <div class="right">
          <div class="title">填写商品评价：</div>
          <!-- from表单 -->
          <el-form
            ref="form"
            :model="form"
            label-width="150px"
            label-position="left"
          >
            <el-form-item label="商品评分">
              <el-rate :colors="colors" v-model="form.Productrating"> </el-rate>
            </el-form-item>
            <el-form-item label="服务评分">
              <el-rate :colors="colors" v-model="form.Servicescore"> </el-rate>
            </el-form-item>
            <el-form-item label="评价晒单">
              <el-input
                v-model="form.evaluate"
                type="textarea"
                rows="5"
                placeholder="评价晒单"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <!--  :on-success="handlePictureCardPreview  文件上传成功的回调"
                :on-remove="handleRemove" 删除图片列表回调-->
              <el-upload
                :on-success="handlePictureCardPreview"
                :on-remove="handleRemove"
                :action="$api.upload"
                list-type="picture-card"
                :limit="5"
                :file-list="filelist"
              >
                <i class="el-icon-plus"></i> </el-upload
            ></el-form-item>
            <el-form-item>
              共{{ filelist.length }}张，还可以上传{{
                5 - filelist.length
              }}张</el-form-item
            >
          </el-form>
          <!-- 提交btn -->
          <div class="submitBtn">
            <div @click="orderComment">提交评价</div>
          </div>
        </div>
      </div>
    </div>
    <!--评价成功对话框 -->

    <el-dialog :visible.sync="dialogVisible" width="40%" :show-close="false">
      <p><img src="../../../static/image/wancheng@2x.png" /></p>
      <p>您的评价已成功提交</p>
      <span slot="footer" class="dialog-footer">
        <router-link to="/" class="cancelbth">返回首页</router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listSearchMixin } from "@/config/mixin";
export default {
  mixins: [listSearchMixin],
  name: "evaluate",
  data() {
    return {
      evaluate: {}, //存储评价商品数据
      form: {
        Productrating: 5, //商品评分
        Servicescore: 5, //服务评分
        evaluate: "", //评价
      }, //手机用户评价信息
      colors: ["#ff7800", "#ff7800", "#ff7800"], //Rate 评分颜色
      filelist: [], //存储上传的图片列表
      dialogVisible: false, //评价成功对话框
    };
  },
  created() {
    // 获取要评价的信息
    this.evaluate = JSON.parse(this.$route.query.product);
  },
  methods: {
    // 上传图片成功的回调
    handlePictureCardPreview(response, file, fileList) {
      // response请求结果
      // file 上传图片的信息
      // fileList  上传成功后图片列表数据
      if (response.status == 200) {
        this.filelist = fileList;
      }
    },
    // 删除图片列表的回调
    handleRemove(file, fileList) {
      // file 删除的图片信息
      // fileList  删除后最新的图片列表数据
      this.filelist = fileList;
    },
    //提交评价
    orderComment() {
      // 评价不能为空
      this.form.evaluate = this.form.evaluate.trim();
      //过滤图片列表 只要url拼接的字符串
      let pic = this.filelist.map((item) => item.response.data[0]).join();
      if (this.form.evaluate) {
        let params = {
          url: this.$api.orderComment,
          method: "POST",
          data: {
            unique: this.evaluate.cartInfo[0].unique, //订单唯一标识
            productScore: this.form.Productrating, //商品评价
            serviceScore: this.form.Servicescore, //服务评价
            pics: pic, //图片
            comment: this.form.evaluate, //评价
          },
        };
        this.sendReq(params, (res) => {
          //console.log(res);
          if (res.status == 200) {
            this.dialogVisible = true;
          }
        });
      } else {
        this.$message.warning("评价不能为空");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.evaluatebox {
  background-color: #f0f0f0;
  .banner {
    width: 1250px;
    margin: 0 auto;
    ::v-deep .el-breadcrumb {
      padding: 30px 0;
      .pj {
        span {
          color: #f78521 !important;
        }
      }
    }
    .content {
      background-color: white;
      display: flex;
      .left {
        min-height: 600px;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #eaeaea;
        img {
          width: 240px;
          max-height: 300px;
        }
        .price {
          font-size: 14px;
          margin: 30px 0;
          span {
            font-size: 20px;
          }
        }
        .sku {
          font-size: 14px;
          color: #8a8585;
        }
      }
      .right {
        flex: 2;
        padding: 30px;
        .title {
          padding: 10px 0;
          font-size: 20px;
          border-bottom: 1px dashed #f0f0f0;
        }
        ::v-deep .el-form {
          margin-top: 20px;
          .el-form-item__content {
            display: flex;
            min-height: 40px;
            align-items: center;
            .el-textarea__inner {
              resize: none;
            }
            & .el-textarea__inner:focus {
              border-color: #ff7800;
            }
            // 上传图片组件样式
            .el-upload {
              height: 80px;
              line-height: 80px;
              width: 80px;
            }
            .el-upload-list__item {
              height: 80px;

              width: 80px;
            }
          }
        }
        .submitBtn {
          display: flex;
          justify-content: center;
          > div {
            cursor: pointer;
            padding: 5px 60px;
            background-color: #f78521;
            color: white;
          }
        }
      }
    }
  }
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
        .cancelbth {
          border: 1px solid #f78521;
          padding: 10px 20px;
          color: #f78521;
          text-decoration: none;
        }
        & .cancelbth:hover {
          background-color: white;
        }
      }
    }
  }
}
</style>