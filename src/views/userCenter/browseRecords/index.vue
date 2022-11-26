<template>
  <div class="Collectionbox">
    <div class="top">
      <div class="leftbox">浏览足迹</div>
      <div class="rightbox">
        <span v-if="isshowoperation"
          ><el-checkbox v-model="isSelectAll" @change="SelectAll"></el-checkbox>
          全选</span
        >
        <span v-if="isshowoperation" @click="deleteAll">删除</span>
        <span class="keepbtn" @click="isshowoperation = !isshowoperation">{{
          isshowoperation ? "保存" : "批量删除"
        }}</span>
      </div>
    </div>
    <div class="contentr">
      <productCollection :productList="CollectionList" @deleteone="deleteone">
        <template slot="delete">删除足迹</template>
        <template slot="massage">你还没有浏览足迹~</template>
      </productCollection>
    </div>
  </div>
</template>

<script>
import { listSearchMixin } from "@/config/mixin";
import productCollection from "@/components/orderInfo/productCollection.vue";
export default {
  name: "browseRecords",
  mixins: [listSearchMixin],
  components: {
    productCollection,
  },
  data() {
    return {
      isshowoperation: false, //是否展示操作
      CollectionList: [], //存储我的收藏数据
      isSelectAll: false, //是否全选
      checkId: [], //存储被选中的id
    };
  },
  created() {
    this.getCollection();
  },
  watch: {
    CollectionList: {
      handler(newval) {
        // 如果商品全部选中那么全选按钮勾选
        this.isSelectAll = newval.every((item) => item.ischeck);
        // 过滤出被选中的商品
        this.checkId = newval.filter((item) => item.ischeck).map((i) => i.pid);
      },
      deep: true,
    },
  },
  methods: {
    // 获取我的收藏商品
    getCollection() {
      let params = {
        url: this.$api.getcollect,
        method: "get",
        payload: {
          type: "foot",
        },
      };
      this.sendReq(params, (res) => {
        // console.log(res);
        if (res.status == 200) {
          this.CollectionList = res.data;
          this.CollectionList.forEach((element) => {
            this.$set(element, "ischeck", false);
          });
        }
      });
    },
    // 取消单个收藏
    deleteone(id) {
      let params = {
        url: this.$api.unfavorites + id,
        method: "post",
        data: {
          category: "foot",
        },
      };
      this.sendReq(params, (res) => {
        //console.log(res);
        if (res.status == 200) {
          this.$message.success("删除足迹成功");
          // 刷新数据
          this.getCollection();
        }
      });
    },
    // 全选多选框发生改变
    SelectAll() {
      this.CollectionList.forEach((item) => {
        item.ischeck = this.isSelectAll;
      });
    },
    // 批量取消收藏
    async deleteAll() {
      if (this.checkId.length <= 0) {
        this.$message.warning("请选择商品后在操作");
        return;
      }
      // 将数据转换成字符串
      let listId = this.checkId.join(",");
      let flag = await this.$confirm("是否真的要删除全选浏览商品", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (flag == "confirm") {
        let params = {
          url: this.$api.unfavorites + listId,
          method: "post",
          data: {
            category: "foot",
          },
        };
        this.sendReq(params, (res) => {
          if (res.status == 200) {
            this.$message.success("执行成功");
            this.getCollection();
            // 关闭操作模式
            this.isshowoperation = false;
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.Collectionbox {
  border: 1px solid lightgray;
  .top {
    display: flex;
    align-items: center;
    padding: 0 30px;
    justify-content: space-between;
    border-bottom: 1px solid lightgray;
    .leftbox {
      padding: 20px 0px;
      border-bottom: 1px solid #f78521;
      color: #f78521;
    }
    .rightbox {
      span {
        margin-left: 15px;
        cursor: pointer;
      }
      .keepbtn {
        padding: 8px 25px;
        background-color: #ff7f50;
        color: white;
      }
    }
  }
  .contentr {
    padding: 10px 30px;
  }
}
</style>