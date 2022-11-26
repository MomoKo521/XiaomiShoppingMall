<template>
  <!-- 我的收藏和浏览足迹数据组件 -->
  <div class="produt">
    <div v-if="flag" class="conetntbox">
      <div
        class="produtbox"
        v-for="(item, index) in productList"
        :key="index"
        @click="checkchange(item)"
      >
        <div class="images">
          <img class="procutimg" :src="$api.BASEURL + item.image" />
          <div class="bjimg" v-if="$parent.isshowoperation">
            <img
              :src="
                require(item.ischeck
                  ? '../../assets/images/edit.png'
                  : '../../assets/images/noEdit.png')
              "
            />
          </div>
        </div>
        <!-- 当前未收藏页面时展示线段 -->
        <div
          v-if="$route.path == '/myCollection'"
          style="border-top: 1px solid lightgray"
        ></div>
        <div class="conetent">
          <p>{{ item.storeName }}</p>
          <p>{{ item.price }}</p>
        </div>
        <div class="btnbox">
          <div class="cancelbtn" @click="deleteproduct(item)">
            <slot name="delete"></slot>
          </div>
          <div class="quedibtn" @click="goproduct(item)">查看详情</div>
        </div>
      </div>
    </div>
    <!--没有数数据展示的提示 -->
    <div v-else class="nodata">
      <img src="../../../static/image/nothing@2x.png" />
      <div><slot name="massage"></slot></div>
      <router-link to="/">去首页看看</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "productCollection",
  props: ["productList"],
  data() {
    return {
      flag: true, //是否展示没有数据盒子
    };
  },
  watch: {
    productList: {
      handler(value) {
        if (value.length > 0) {
          this.flag = true;
        } else {
          this.flag = false;
        }
      },
    },
  },
  methods: {
    // 切换商品选中
    checkchange(item) {
      // 在开启选择切换时才能改变ischeck值
      if (this.$parent.isshowoperation) {
        // 切换是否选中
        item.ischeck = !item.ischeck;
      }
    },
    // 用户点击取消按钮
    deleteproduct(item) {
      this.$emit("deleteone", item.pid);
    },
    //用户点击查看商品信息信息按钮
    goproduct(item) {
      // 在未开启选择切换时才能跳转商品页面
      if (!this.$parent.isshowoperation) {
        let data = {
          productId: item.pid,
        };
        this.$router.push({
          name: "productDetail",
          query: { productid: JSON.stringify(data) },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.produt {
  .conetntbox {
    display: flex;
    flex-wrap: wrap;
    .produtbox {
      width: 180px;
      margin: 0 18px 20px 0;
      border: 1px solid lightgray;
      .images {
        position: relative;
        .procutimg {
          width: 160px;
          height: 180px;
        }
        .bjimg {
          position: absolute;
          top: 0;
          right: 0;
          > img {
            width: 64px;
            height: 64px;
          }
        }
      }
      .conetent {
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        & p:nth-child(1) {
          width: 150px;
          overflow: hidden; //（文字长度超出限定宽度，则隐藏超出的内容）
          white-space: nowrap; //（设置文字在一行显示，不能换行）
          text-overflow: ellipsis; //（规定当文本溢出时，显示省略符号来代表被修剪的文本）
        }
      }
      .btnbox {
        display: flex;
        border-top: 1px solid lightgray;
        > div {
          cursor: pointer;
          padding: 10px 0px;
          text-align: center;
          flex: 1;
        }
        & div:nth-child(1) {
          border-right: 1px solid lightgray;
        }
      }
    }
  }
  & .produtbox:nth-child(5n) {
    margin-right: 0;
  }
  .nodata {
    margin: 0 auto;
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    .router-link-active {
      text-decoration: none;
      padding: 8px 20px;
      background-color: #ff7f50;
      color: white;
    }
    > div {
      margin: 10px 0;
      color: #a19b9b;
    }
  }
}
</style>