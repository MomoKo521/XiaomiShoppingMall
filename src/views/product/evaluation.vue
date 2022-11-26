<template>
  <div class="comment">
    <div class="commentbox">
      <span :class="{ active: type == 0 }" @click="changecomment(sumCount, 0)"
        >全部 ({{ sumCount }})</span
      >
      <span :class="{ active: type == 1 }" @click="changecomment(goodCount, 1)"
        >好评 ({{ goodCount }})</span
      >
      <span :class="{ active: type == 2 }" @click="changecomment(inCount, 2)"
        >中评 ({{ inCount }})</span
      >
      <span :class="{ active: type == 3 }" @click="changecomment(poorCount, 3)"
        >差评 ({{ poorCount }})</span
      >
    </div>
    <div class="replybox" v-for="(item, index) in reply" :key="index">
      <div class="headPortrait">
        <img
          src="../../assets/images/avatar.png"
          style="height: 70px; width: 100px"
        />
        <p>{{ item.nickname }}</p>
      </div>

      <div class="content">
        <p>{{ item.comment }}</p>
        <el-image
          :src="$api.BASEURL + img"
          v-for="(img, i) in item.picturesArr"
          :key="i"
          :preview-src-list="[$api.BASEURL + img]"
        ></el-image>

        <div>{{ item.createTime }}</div>
      </div>
    </div>
    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-size="5"
      layout="prev, pager, next, jumper"
      :total="tolog"
      align="right"
    >
    </el-pagination>
  </div>
</template>

<script>
// 导入封装aixos
import { listSearchMixin } from "@/config/mixin";
export default {
  mixins: [listSearchMixin],
  name: "evaluation",
  props: ["ProDetail"],
  data() {
    return {
      goodCount: 0, //好评数
      inCount: 0, //中评数
      poorCount: 0, //差评数
      sumCount: 0, //评论总数
      page: 1, //页码
      type: 0, //查询评论类型(总，好，中，差评论)
      tolog: 0, //分页中页码数
      reply: [], //存储评论列表
    };
  },
  methods: {
    // 获取商品评论数据
    getEvaluateData() {
      let params = {
        url: this.$api.getEvaluateData + this.ProDetail.id,
        method: "GET",
      };
      this.sendReq(params, (res) => {
        // console.log(res);
        if (res.status == 200) {
          this.goodCount = res.data.goodCount;
          this.inCount = res.data.inCount;
          this.poorCount = res.data.poorCount;
          this.sumCount = res.data.sumCount;
          // 默认全部评论 那么分页总页面等于好评数
          this.tolog = this.sumCount;
        }
      });
    },
    //获取商品评论列表
    getEvaluateList() {
      let params = {
        url: this.$api.getEvaluateList + this.ProDetail.id,
        method: "GET",
        payload: {
          page: this.page, //页码
          limit: 5, //size
          type: this.type,
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.reply = res.data;
        }
      });
    },
    // 切换评论类型
    changecomment(sum, type) {
      this.tolog = sum;
      this.type = type;
      this.getEvaluateList();
    },
    // 分页页码发生变化
    handleCurrentChange(page) {
      this.page = page;
      this.getEvaluateList();
    },
  },
  created() {
    this.getEvaluateData();
    this.getEvaluateList();
  },
};
</script>

<style lang="scss" scoped>
//宝贝评价样式
.comment {
  margin-right: 20px;
  // 评论数
  .commentbox {
    display: flex;
    padding-bottom: 30px;
    border-bottom: 1px solid rgb(199, 194, 194);
    span {
      margin-right: 20px;
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid rgb(161, 159, 159);
      border-radius: 20px;
      cursor: pointer;
    }
    // 被选中的评论类型
    .active {
      color: #f78521;
      border-color: #f78521;
    }
  }
  // 评论列表
  .replybox {
    margin-top: 30px;
    padding-bottom: 20px;
    padding-left: 50px;
    display: flex;
    border-bottom: 1px solid rgb(199, 194, 194);
    //legt
    .headPortrait {
      text-align: center;
      img {
        margin-bottom: 10px;
      }
    }
    // right
    .content {
      margin-left: 40px;
      .el-image {
        height: 100px;
        width: 100px;
      }
      p {
        padding-bottom: 10px;
      }
      div {
        padding-top: 10px;
      }
    }
  }
  // 分页器
  ::v-deep .el-pagination {
    margin-top: 20px;
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
      .active {
        background-color: #f78521;
        color: white;
      }
    }
  }
}
</style>