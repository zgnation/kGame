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

let chart,
  bar = null;
let colorList = [
  "rgba(220, 20, 60, 1)",
  "rgba(60, 179, 113, 1)",
  "#61a0a8",
  "#d48265",
  "#91c7ae"
];
let dates = [
  "2016-03-29",
  "2016-03-30",
  "2016-03-31",
  "2016-04-01",
  "2016-04-04",
  "2016-04-05",
  "2016-04-06",
  "2016-04-07",
  "2016-04-08",
  "2016-04-11",
  "2016-04-12",
  "2016-04-13",
  "2016-04-14",
  "2016-04-15",
  "2016-04-18",
  "2016-04-19",
  "2016-04-20",
  "2016-04-21",
  "2016-04-22",
  "2016-04-25",
  "2016-04-26",
  "2016-04-27",
  "2016-04-28",
  "2016-04-29",
  "2016-05-02",
  "2016-05-03",
  "2016-05-04",
  "2016-05-05",
  "2016-05-06",
  "2016-05-09",
  "2016-05-10",
  "2016-05-11",
  "2016-05-12",
  "2016-05-13",
  "2016-05-16",
  "2016-05-17",
  "2016-05-18",
  "2016-05-19",
  "2016-05-20",
  "2016-05-23",
  "2016-05-24",
  "2016-05-25",
  "2016-05-26",
  "2016-05-27",
  "2016-05-31",
  "2016-06-01",
  "2016-06-02",
  "2016-06-03",
  "2016-06-06",
  "2016-06-07",
  "2016-06-08",
  "2016-06-09",
  "2016-06-10",
  "2016-06-13",
  "2016-06-14",
  "2016-06-15",
  "2016-06-16",
  "2016-06-17",
  "2016-06-20",
  "2016-06-21"
];
let data = [
  [17512.58, 17633.11, 17434.27, 17642.81, 17436.21],
  [17652.36, 17716.66, 17652.36, 17790.11, 17685.1],
  [17716.05, 17685.09, 17669.72, 17755.07, 17535.25],
  [17661.74, 17792.75, 17568.02, 17811.48, 17784.65],
  [17799.39, 17737.22, 17710.67, 17806.38, 17905.52],
  [17718.03, 17603.32, 17579.56, 17718.03, 17852.22],
  [17605.45, 17716.05, 17542.54, 17723.55, 17691.02],
  [17687.28, 17541.96, 17484.23, 17687.28, 17542.23],
  [17555.39, 17576.96, 17528.16, 17694.51, 17722.85],
  [17586.48, 17556.41, 17555.9, 17731.63, 17910.55],
  [17571.34, 17721.25, 17553.57, 17744.43, 17852.55],
  [17741.66, 17908.28, 17741.66, 17918.35, 17534.22],
  [17912.25, 17926.43, 17885.44, 17962.14, 17854.22],
  [17925.95, 17897.46, 17867.41, 17937.65, 17455.89],
  [17890.2, 18004.16, 17848.22, 18009.53, 17954.85],
  [18012.1, 18053.6, 17984.43, 18103.46, 17463.44],
  [18059.49, 18096.27, 18031.21, 18167.63, 17845.55],
  [18092.84, 17982.52, 17963.89, 18107.29, 17514.62],
  [17985.05, 18003.75, 17909.89, 18026.85, 17546.22],
  [17990.94, 17977.24, 17855.55, 17990.94, 17631.88],
  [17987.38, 17990.32, 17934.17, 18043.77, 18000.11],
  [17996.14, 18041.55, 17920.26, 18084.66, 17238.1],
  [18023.88, 17830.76, 17796.55, 18035.73, 17864.08],
  [17813.09, 17773.64, 17651.98, 17814.83, 17653.88],
  [17783.78, 17891.16, 17773.71, 17912.35, 17932.22],
  [17870.75, 17750.91, 17670.88, 17870.75, 17102.0],
  [17735.02, 17651.26, 17609.01, 17738.06, 17922.65],
  [17664.48, 17660.71, 17615.82, 17736.11, 17951.22],
  [17650.3, 17740.63, 17580.38, 17744.54, 18420.45],
  [17743.85, 17705.91, 17668.38, 17783.16, 17130.89],
  [17726.66, 17928.35, 17726.66, 17934.61, 17645.29],
  [17919.03, 17711.12, 17711.05, 17919.03, 17465.25],
  [17711.12, 17720.5, 17625.38, 17798.19, 17842.0],
  [17711.12, 17535.32, 17512.48, 17734.74, 17852.99],
  [17531.76, 17710.71, 17531.76, 17755.8, 17123.56],
  [17701.46, 17529.98, 17469.92, 17701.46, 17231.99],
  [17501.28, 17526.62, 17418.21, 17636.22, 17312.08],
  [17514.16, 17435.4, 17331.07, 17514.16, 17765.88],
  [17437.32, 17500.94, 17437.32, 17571.75, 17745.55],
  [17507.04, 17492.93, 17480.05, 17550.7, 17025.98],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""]
];
let volumes = [
  86160000,
  79330000,
  102600000,
  104890000,
  85230000,
  115230000,
  99410000,
  90120000,
  79990000,
  107100000,
  81020000,
  91710000,
  84510000,
  118160000,
  89390000,
  89820000,
  100210000,
  102720000,
  134120000,
  83770000,
  92570000,
  109090000,
  100920000,
  136670000,
  80100000,
  97060000,
  95020000,
  81530000,
  80020000,
  85590000,
  75790000,
  87390000,
  88560000,
  86640000,
  88440000,
  103260000,
  79120000,
  95530000,
  111990000,
  87790000,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
];

let upData = [
  [17711.12, 17535.32, 17512.48, 17734.74, 17854.66],
  [17531.76, 17710.71, 17531.76, 17755.8, 17321.56],
  [17701.46, 17529.98, 17469.92, 17701.46, 17520.56],
  [17501.28, 17526.62, 17418.21, 17636.22, 17654.52],
  [17514.16, 17435.4, 17331.07, 17514.16, 18089.23],
  [17437.32, 17500.94, 17437.32, 17571.75, 17432.11],
  [17507.04, 17492.93, 17480.05, 17550.7, 17965.21],
  [17525.19, 17706.05, 17525.19, 17742.59, 17035.66],
  [17735.09, 17851.51, 17735.09, 17891.71, 18280.33],
  [17859.52, 17828.29, 17803.82, 17888.66, 17766.22],
  [17826.85, 17873.22, 17824.73, 17873.22, 18621.14],
  [17891.5, 17787.2, 17724.03, 17899.24, 17789.66],
  [17754.55, 17789.67, 17664.79, 17809.18, 17756.64],
  [17789.05, 17838.56, 17703.55, 17838.56, 17542.33],
  [17799.8, 17807.06, 17689.68, 17833.17, 18546.11],
  [17825.69, 17920.33, 17822.81, 17949.68, 17798.66],
  [17936.22, 17938.28, 17936.22, 18003.23, 18522.66],
  [17931.91, 18005.05, 17931.91, 18016, 18230.52],
  [17969.98, 17985.19, 17915.88, 18005.22, 18456.22],
  [17938.82, 17865.34, 17812.34, 17938.82, 17863.41],
  [17624.82, 17663.34, 17698.34, 17877.82, 17832.41]
];
let upVolumes = [
  79180000,
  68940000,
  73190000,
  147390000,
  78530000,
  75560000,
  82270000,
  71870000,
  78750000,
  71260000,
  69690000,
  90540000,
  101690000,
  93740000,
  94130000,
  91950000,
  248680000,
  99380000,
  85130000,
  89440000
];

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  let option = {
    animation: false,
    color: colorList,
    axisPointer: {
      show: true,
      link: [
        {
          xAxisIndex: [0, 1]
        }
      ]
    },
    xAxis: [
      {
        type: "category",
        data: dates,
        boundaryGap: false,
        axisLine: { show: false, lineStyle: { color: "#21202d" } },
        axisLabel: {
          formatter: function(value) {
            return echarts.format.formatTime("MM-dd", value);
          }
        },
        axisPointer: {
          show: true
        },
        show: false
      }
    ],
    yAxis: {
      boundaryGap: false,
      min: "dataMin",
      max: "dataMax",
      splitNumber: 2,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: false
      },
      splitLine: {
        lineStyle: { color: "#373a5b", width: 1 }
      }
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom:0
    },
    series: {
      type: "candlestick",
      name: "日K",
      data: data,
      itemStyle: {
        color: "#ef232a",
        color0: "#14b143",
        borderColor: "#ef232a",
        borderColor0: "#14b143"
      }
    }
  };

  chart.setOption(option);
  return chart; // 返回 chart 后可以自动绑定触摸操作
}
function initBar(canvas, width, height) {
  bar = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(bar);

  let option = {
    animation: false,
    color: colorList,
    xAxis: {
      type: "category",
      data: dates,
      show: false
    },
    yAxis: {
      type: "value",
      show: false
    },
    series: {
      name: "Volume",
      type: "bar",
      itemStyle: {
        color: function(d) {
          return d.value > 90000000 ? colorList[0] : colorList[1];
        }
      },
      data: volumes
    },
    grid: {
      left: 0,
      right: 0,
      top: 10,
      bottom:0,
      containLabel: false
    }
  };

  bar.setOption(option);
  return bar; // 返回 chart 后可以自动绑定触摸操作
}
const rightUser = [
  0.2,
  0.5,
  -1.2,
  -2.6,
  -6.2,
  -3.1,
  0.1,
  3.2,
  5.5,
  6.0,
  3.2,
  5.1,
  1.2,
  4.6,
  2.0,
  6.1,
  1.0,
  -3.2,
  -0.4,
  2.1
];
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
      day:20,
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
