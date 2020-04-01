<!--结果页-->
<template>
  <div class="resultBox">
    <div class="example">
      <div class="exMain"></div>
    </div>
    <div class="resultContent">
      <div class="usrBox">
        <div class="usr">
          <div class="pic"></div>
          <div class="usrname">{{userA.name}}</div>
          <div
            class="rate"
            :class="userA_color"
          >{{userA.rate}}%</div>
        </div>
        <div class="usr">
          <div class="pic"></div>
          <div class="usrname">{{userB.name}}</div>
          <div
            class="rate"
            :class="userB_color"
          >{{userB.rate}}%</div>
        </div>
      </div>
      <div class="success">
        <div
          class="res"
          :class="res.cla"
        >{{res.text}}</div>
        <div class="reward">
          +10积分
        </div>
      </div>
      <div class="btnBox">
        <div class="page">生成海报</div>
        <div
          class="again"
          @click='again'
        >再来一局</div>
        <button
          open-type="share"
          class="share"
        >分享好友</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userA: {
        name: "江湖默默",
        rate: "0"
      },
      userB: {
        name: "江湖华少",
        rate: "0"
      }
    };
  },
  computed: {
    userA_color() {
      return parseFloat(this.userA.rate) >= 0 ? "red" : "green";
    },
    userB_color() {
      return parseFloat(this.userB.rate) >= 0 ? "red" : "green";
    },
    res() {
      let a = parseFloat(this.userA.rate);
      let b = parseFloat(this.userB.rate);
      if (a > b) {
        return {
          text: "胜利",
          cla: "red"
        };
      } else if (a == b) {
        return {
          text: "平局",
          cla: ""
        };
      } else {
        return {
          text: "失败",
          cla: "green"
        };
      }
    }
  },
  mounted() {
    this.userA.name = this.$root.$mp.query.a;
    this.userA.rate = this.$root.$mp.query.aRate;
    this.userB.name = this.$root.$mp.query.b;
    this.userB.rate = this.$root.$mp.query.bRate;
  },
  onShareAppMessage: function(res) {
    return {
      title: "kgame",
      path: "/pages/homepage/main"
    };
  },
  methods: {
    again() {
      wx.reLaunch({
        url: "../index/main"
        // ,success: function(e) {
        //   var page = getCurrentPages().pop();
        //   if (page == undefined || page == null) return;
        //   page.onLoad();
        // }
      });
    }
  },
  created() {
    console.log(wx.getUserInfo());
  }
};
</script>

<style  scoped>
.resultBox {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #373a5b;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.example {
  width: 100%;
  height: 30%;
  background: linear-gradient(to right, #dc143c, #5f9ea0);
  border-radius: 8px;
  padding: 2px;
  box-sizing: border-box;
  margin-bottom: 30px;
}
.exMain {
  width: 100%;
  height: 100%;
  background-color: #21202d;
  border-radius: 5px;
}
.resultContent {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #87ceeb;
  border-radius: 8px;
  padding: 10px 5px;
  box-sizing: border-box;
}
.usrBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.usr {
  width: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #fff;
  margin-bottom: 2px;
}
.usrname {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 15px;
  color: #333;
  text-align: center;
  line-height: 2.2;
  font-weight: 600;
}
.rate {
  width: 100%;
  text-align: center;
  font-size: 15px;
  line-height: 1;
  font-weight: 600;
}
.rate.red,
.res.red {
  color: #ff3030;
}
.rate.green,
.res.green {
  color: #5fb878;
}
.success {
  width: 100%;
  padding: 10px 0;
  margin-bottom: 30px;
}
.res {
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
}
.reward {
  text-align: center;
  font-size: 13px;
  color: #d2691e;
}
.btnBox {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}
.btnBox > div,
.btnBox > button {
  width: 60%;
  color: #fff;
  font-size: 15px;
  line-height: 3;
  text-align: center;
}
.page {
  background-color: #ff4500;
}
.again {
  background-color: #b22222;
}
.share {
  background-color: #696969;
}
</style>