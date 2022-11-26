<template>
  <div class="rechargeBox">
    <el-tabs v-model="activeName">
      <el-tab-pane label="充值方案" name="first">
        <div class="planbox" v-for="item in fanganList" :key="item.id">
          <div class="plan">
            <p>￥{{ item.value.give_price }}</p>
            <p>
              使用条件:充值￥{{ item.value.price }}赠送￥{{
                item.value.give_price
              }}
            </p>
            <img src="../../../assets/images/indexLogo.png" />
          </div>
          <div class="shiyong" @click="Recharge(item)">立即使用</div>
          <div class="chizhi">充值</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { listSearchMixin } from "@/config/mixin";
export default {
  name: "recharge",
  mixins: [listSearchMixin],
  data() {
    return {
      activeName: "first",
      fanganList: [], //存储充值方案
    };
  },
  created() {
    this.getfangan();
  },
  methods: {
    // 获取充值方案
    getfangan() {
      let params = {
        url: this.$api.getfangan,
        method: "get",
      };
      this.sendReq(params, (res) => {
        // console.log(res);
        if (res.status == 200) {
          this.fanganList = res.data.rechargePriceWays;
        }
      });
    },
    // 用户点击立即使用充值
    Recharge(item) {
      let params = {
        url: this.$api.setRecharge,
        method: "post",
        data: {
          rechar_id: item.id,
        },
      };
      this.sendReq(params, (res) => {
        if (res.status == 200) {
          this.$message.success("充值成功");
        } else {
          this.$message.error("充值失败");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoepd>
.rechargeBox {
  border: 1px solid lightgray;
  height: 100%;
  .el-tabs {
    // 标题样式
    .el-tabs__header {
      .el-tabs__nav-wrap {
        padding-left: 20px;
        .is-active {
          color: #f78521;
        }
        .el-tabs__active-bar {
          background-color: #f78521;
        }
        .el-tabs__nav {
          padding: 10px 0;
        }
      }
    }
    //内容样式
    .el-tabs__content {
      padding: 20px 80px;
      .el-tab-pane {
        display: flex;
        .planbox {
          overflow: hidden;
          width: 280px;
          margin: 0px 120px 30px 0px;
          position: relative;
          border-radius: 10px;
          .plan {
            padding: 20px;
            background-color: #ff6633;
            position: relative;
            > p {
              height: 40px;
              line-height: 40px;
              color: white;
            }
            & p:nth-child(1) {
              font-size: 30px;
            }
            & p:nth-child(2) {
              font-size: 10px;
            }
            > img {
              position: absolute;
              bottom: 15px;
              opacity: 0.3;
            }
          }
          // 立即使用
          .shiyong {
            padding: 15px 0;
            text-align: center;
            background-color: #f3efee;
            cursor: pointer;
          }
          // 充值
          .chizhi {
            position: absolute;
            top: 0px;
            right: -48px;
            // 旋转
            transform: rotate(55deg);
            padding: 20px 40px 5px 40px;

            color: red;
            background-color: white;
          }
        }
      }
    }
  }
}
</style>