<template>
  <div class="producbox" v-loading="loading">
    <div class="shoopingbox" v-for="item in shopping" :key="item.id">
      <div class="imgbox">
        <img
          :src="$api.BASEURL + item.image"
          alt=""
          @click="goproductDetail(item)"
        />
      </div>
      <p class="store marg">{{ item.storeName }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "likeList",
  props: ["shopping"],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    // 跳转商品详情页面
    goproductDetail(item) {
      let data = {
        productId: item.id,
      };

      this.$router.push({
        path: "/productDetail",
        query: { productid: JSON.stringify(data) },
      });
      //刷新页面
      this.$router.go(0);
    },
  },
};
</script>

<style lang="scss" scoped>
.producbox {
  display: flex;
  flex-wrap: wrap;
  .shoopingbox {
    width: 100%;
    padding-bottom: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    transition: all 0.5s;
    .imgbox {
      padding: 0 20px;
      img {
        cursor: pointer;
        width: 100%;
        margin-bottom: 10px;
      }
    }

    .store {
      text-align: center;
      width: 100%;
      font-size: 14px;
      font-weight: 500;
      overflow: hidden; //（文字长度超出限定宽度，则隐藏超出的内容）
      white-space: nowrap; //（设置文字在一行显示，不能换行）
      text-overflow: ellipsis; //（规定当文本溢出时，显示省略符号来代表被修剪的文本）
    }
  }
  & .shoopingbox:hover {
    box-shadow: 0 0 20px gray;
  }
}
</style>  