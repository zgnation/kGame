<template>
  <div class="content">
    <div class="usrBox">
      <div class="usrmsg">
        <div class="leftFirer">
          <div class="pic">
            <div class="picture"></div>
          </div>
          <div class="intro">
            <div class="day">第 {{playDay}} /{{day}}天</div>
            <div
              class="rate"
              :class="userA_color"
            >{{userA.rate}}%</div>
          </div>
        </div>
        <div class="rightFirer">
          <div class="intro">
            <div class="day">第 {{userB.day}} /{{day}}天</div>
            <div
              class="rate"
              :class="userB_color"
            >{{userB.rate}}%</div>
          </div>
          <div class="pic">
            <div class="picture"></div>
          </div>
        </div>
      </div>
      <div class="usrname">
        <div class="leftFirer">
          <div class="name">{{userA.name}}</div>
        </div>
        <div class="timeTips">
          还剩 <span>{{userA.time}}</span> 秒自动跳过
        </div>
        <div class="rightFirer">
          <div class="rname">{{userB.name}}</div>
        </div>
      </div>
    </div>
    <div class="chartBox">
      <div class="stckData">
        <ul>
          <li>开盘 <span>{{futureData[0]}}</span> </li>
          <li>最高 <span>{{futureData[3]}}</span> </li>
          <li>涨跌额 <span :class="upsColor">{{upsValue}}</span> </li>
          <li>收盘 <span>{{futureData[1]}}</span></li>
          <li>最低 <span>{{futureData[2]}}</span></li>
          <li>涨跌幅 <span :class="upsColor">{{upsRate}}</span></li>
        </ul>
      </div>
      <div class="KTitle">
        <div class="title">K 线图</div>
        <div class="subTitle">
          本局最高 <span>{{userA.maxRate}}%</span>
        </div>
      </div>
      <div class="KBox">
        <div class="echarts-wrap">
          <mpvue-echarts
            :echarts="echarts"
            :onInit="onInit"
            canvasId="demo-canvas"
          />
        </div>
      </div>
      <div class="barTitle">
        成交量
      </div>
      <div class="barBox">

        <div class="bar-chart">
          <mpvue-echarts
            :echarts="echarts"
            :onInit="onBar"
            canvasId="bar-canvas"
          />
        </div>
      </div>
      <div class="buyBtn">
        <div
          class="lBtn"
          @click='buyAction'
          v-if="btn!=1"
        >{{buyBtn?"买入开仓":"卖出平仓"}}</div>
        <div
          class="mBtn"
          @click='sellAction'
          v-if="btn!=-1"
        >{{sellBtn?"卖出开仓":"买入平仓"}}</div>
        <!-- <div class="lBtn">买入/卖出</div> -->
        <div
          class="rBtn"
          @click='nextDay'
        >观望</div>
      </div>
    </div>
    <cover-view
      class="msg"
      v-if="msg"
    >
      对面小伙伴还未答完，请耐心等待
    </cover-view>
  </div>
</template>

<script>
import echarts from "echarts/dist/diy-echarts.min.js";
// import echarts from "echarts";
import mpvueEcharts from "mpvue-echarts";

export default {
  components: {
    mpvueEcharts
  },
  data() {
    return {
      echarts,
      onInit: initChart,
      onBar: initBar,
      playDay: 0,
      day:10,
      futureData: data[39],
      buyBtn: 1,
      sellBtn: 1,
      overA: 0,
      overB: 0,
      userA: {
        name: "江湖默默",
        rate: 0,
        maxRate: 0,
        time: 5
      },
      userB: {
        name: "江湖华少",
        day: 0,
        rate: 0,
        time: [5, 4, 2, 3, 4, 3, 2, 1, 5, 2, 1, 4, 4, 5, 2, 2, 1, 4, 3, 3, 4]
      },
      btn: 0,
      msg: 0,
      timer: null
    };
  },
  methods: {
    setTime() {
      let bi = 0;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.playDay < this.day && !this.overA) {
          this.userA.time--;
          if (this.userA.time <= 0) {
            this.nextDay();
          }
        } else if (this.playDay == this.day && !this.overA) {
          this.overA = 1;
        }
        if (bi < this.day && !this.overB) {
          this.userB.time[bi]--;
          if (this.userB.time[bi] == 0) {
            this.userB.rate = rightUser[bi];
            this.userB.day++;
            bi++;
          }
        } else if (bi == this.day && !this.overB) {
          this.overB = 1;
        }
      }, 1000);
    },
    changeChart() {
      let z = this.playDay - 1;
      let r = 40 + z;
      data[r] = upData[z];
      volumes[r] = upVolumes[z];
      this.futureData = upData[z];
      if (!this.buyBtn) {
        this.rate(1);
      }
      if (!this.sellBtn) {
        this.rate(-1);
      }
      chart.setOption({
        series: {
          data: data
        }
      });
      bar.setOption({
        series: {
          data: volumes
        }
      });
    },
    buyAction() {
      if (this.playDay >= this.day) {
        return;
      }
      if (this.buyBtn) {
        this.buyBtn = 0;
        this.btn = -1;
      } else {
        this.buyBtn = 1;
        this.btn = 0;
      }
      this.nextDay();
    },
    sellAction() {
      if (this.playDay >= this.day) {
        return;
      }
      if (this.sellBtn) {
        this.sellBtn = 0;
        this.btn = 1;
      } else {
        this.sellBtn = 1;
        this.btn = 0;
      }
      this.nextDay();
    },
    nextDay() {
      if(this.playDay<this.day){
        this.playDay++;
        this.userA.time = 5;
      }
    },
    rate(x) {
      let r = 39 + this.playDay;
      let dayData = data[r];
      let tomorrowData = upData[this.playDay];
      this.userA.rate =
        x *
        (
          parseFloat(this.userA.rate) +
          parseFloat((dayData[4] - tomorrowData[4]) / dayData[0] * 100)
        ).toFixed(2);
      if (parseFloat(this.userA.rate) > parseFloat(this.userA.maxRate)) {
        this.userA.maxRate = this.userA.rate;
      }
    },
    result() {
      clearInterval(this.timer);
      this.btn = 0;
      this.msg = false;
      wx.reLaunch({
        url: this.urlFun
      });
    }
  },
  mounted() {
    this.setTime();
  },
  computed: {
    upsValue() {
      return (this.futureData[0] - this.futureData[1]).toFixed(2);
    },
    upsRate() {
      return (this.upsValue / this.futureData[1] * 100).toFixed(2) + "%";
    },
    upsColor() {
      return this.upsValue > 0 ? "red" : "green";
    },
    userA_color() {
      return parseFloat(this.userA.rate) >= 0 ? "red" : "green";
    },
    userB_color() {
      return parseFloat(this.userB.rate) >= 0 ? "red" : "green";
    },
    urlFun() {
      let url = "../result/main";
      function fh(x) {
        if (x > 0) {
          return "+" + x;
        } else if (x < 0) {
          return "-" + x;
        } else {
          return x;
        }
      }
      let arate = fh(this.userA.rate);
      let brate = fh(this.userB.rate);
      let a = "a=" + this.userA.name + "&aRate=" + arate;
      let b = "b=" + this.userB.name + "&bRate=" + brate;
      return url + "?" + a + "&" + b;
    }
  },
  watch: {
    playDay(d) {
      this.changeChart();
      if(d>=this.day){
        this.overA = 1;
        this.btn = 0;
      }
    },
    overA(d) {
      if (d&&this.overB) {
        this.result();
      } else if(d&&!this.overB) {
        this.msg = 1;
      }
    },
    overB(d) {
      if (this.overA) {
        this.result();
      }
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #21202d;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.usrBox {
  width: 100%;
  background-color: #373a5b;
  box-shadow: 3px 5px 5px -2px rgba(105, 105, 105, 0.8);
}
.usrmsg {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 25px 17px 10px;
  box-sizing: border-box;
}
.usrmsg > div {
  flex: 1;
  display: flex;
  align-items: center;
}
.pic {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border-width: 0.2px;
  border-style: solid;
}
.intro {
  flex: 1;
}
.leftFirer .pic {
  margin-right: 20px;
  box-shadow: 0 0 8px rgba(220, 20, 60, 0.6);
  border-color: rgba(220, 20, 60, 1);
}
.rightFirer .pic {
  margin-left: 20px;
  box-shadow: 0 0 8px rgba(95, 158, 160, 0.6);
  border-color: rgba(95, 158, 160, 1);
}
.rightFirer .intro {
  text-align: right;
}
.day {
  color: #fff;
  font-size: 12px;
  margin-bottom: 10px;
}
.rate {
  font-size: 15px;
}
.usrname {
  width: 100%;
  box-sizing: border-box;
  padding: 0 17px 10px;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #fff;
}
.timeTips {
  flex: 1;
  text-align: center;
  font-size: 11px;
}
.chartBox {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 5px;
  box-sizing: border-box;
}
.echarts-wrap {
  width: 100%;
  height: 140px;
}
.bar-chart {
  width: 100%;
  height: 80px;
}
.stckData {
  padding: 5px 12px;
  width: 100%;
  box-sizing: border-box;
  background-color: #1b1c38;
  border-radius: 5px;
}
.stckData ul {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.stckData ul li {
  width: 33%;
  color: #4682b4;
  font-size: 13px;
  line-height: 2.4;
}
.stckData ul li span {
  color: #fff;
}
.stckData ul li span.red,
.rate.red {
  color: #ff3030;
}
.stckData ul li span.green,
.rate.green {
  color: #5fb878;
}
.KBox,
.barBox {
  width: 100%;
  border-radius: 5px;
  background-color: #1b1c38;
  padding: 5px 0;
}
.KTitle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.barTitle {
  width: 100%;
  line-height: 30px;
  color: #fff;
  font-size: 13px;
  text-indent: 1em;
}
.title {
  line-height: 30px;
  color: #fff;
  font-size: 13px;
  text-indent: 1em;
}
.subTitle {
  text-align: center;
  color: #fff;
  font-size: 13px;
}
.KTitle span {
  color: #ff3030;
}
.buyBtn {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 17px;
  box-sizing: border-box;
  margin-top: 20px;
}
.buyBtn > div {
  width: 30%;
  line-height: 40px;
  text-align: center;
  font-size: 15px;
  color: #fff;
  border-radius: 10px;
}
.lBtn {
  background-color: #5fb878;
}
.mBtn {
  background-color: rgba(220, 20, 60, 1);
}
.rBtn {
  background-color: #393d49;
}
.msg {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 9;
  transform: translate(-50%, -50%);
  word-break: break-all;
  word-wrap: break-word;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 15px;
  line-height: 2.4;
  padding: 5px 20px;
  border-radius: 7px;
}
</style>
