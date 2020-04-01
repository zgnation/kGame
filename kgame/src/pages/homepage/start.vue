<!--首页 -->
<template>
  <div class="homeBox">
    <div class="main"></div>
    <div
      @click="start"
      id="startBtn"
    >开始游戏
    </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      url: "/pages/index/main"
    };
  },
  methods: {
    start() {
      wx.redirectTo({
        url: this.url
      });
    }
  }
};
</script>

<style  scoped>
.homeBox {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #373a5b;
}
.main {
  height: 60%;
}
#startBtn {
  width: 120px;
  height: 60px;
  background-color: #01aaed;
  border-radius: 8px;
  color: #fff;
  font-size: 17px;
  text-align: center;
  line-height: 60px;
  margin: 0 auto;
}
</style>