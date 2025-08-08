<template>
  <div class="page">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in CardList" :key="index">
        <Card :info="item" />
      </el-col>

      <el-col :span="24">
        <div class="echarts_box">
          <div class="header">
            <el-tabs v-model="activeEcharts" type="card">
              <el-tab-pane label="折线图" name="line">
                <div class="centent" v-if="activeEcharts === 'line'">
                  <v-chart :option="line" autoresize />
                </div>
              </el-tab-pane>
              <el-tab-pane label="柱状图" name="bar">
                <div class="centent" v-if="activeEcharts === 'bar'">
                  <v-chart :option="bar" autoresize />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import Card from "./components/Card.vue";
const userIcon = await import("@/assets/images/home/user.png");
const numIcon = await import("@/assets/images/home/num.png");
const downloadIcon = await import("@/assets/images/home/download.png");
const pingCiIcon = await import("@/assets/images/home/pingci.png");
const CardList = [
  {
    title: "用户量",
    dayNum: "2,000",
    dataNum: "120,000",
    icon: userIcon.default,
  },
  {
    title: "访问量",
    dayNum: "2,000",
    dataNum: "120,000",
    icon: numIcon.default,
  },
  {
    title: "下载量",
    dayNum: "2,000",
    dataNum: "120,000",
    icon: downloadIcon.default,
  },
  {
    title: "使用量",
    dayNum: "2,000",
    dataNum: "120,000",
    icon: pingCiIcon.default,
  },
];

const activeEcharts = ref("line");

const line = {
  tooltip: {
    trigger: "axis",
  },
  xAxis: [
    {
      type: "category",
      data: ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06"],
      // boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#999",
        },
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      splitNumber: 4,
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#DDD",
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "#333",
        },
      },
      nameTextStyle: {
        color: "#999",
      },
      splitArea: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: "课时",
      type: "line",
      data: [23, 60, 20, 36, 23, 85],
      lineStyle: {
        normal: {
          width: 8,
          color: {
            type: "linear",

            colorStops: [
              {
                offset: 0,
                color: "#A9F387", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#48D8BF", // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          },
          shadowColor: "rgba(72,216,191, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 20,
        },
      },
      itemStyle: {
        normal: {
          color: "#fff",
          borderWidth: 10,
          /*shadowColor: 'rgba(72,216,191, 0.3)',
                shadowBlur: 100,*/
          borderColor: "#A9F387",
        },
      },
      smooth: true,
    },
  ],
  grid: {
    left: 0,
    right: 0,
    containLabel: true, // 确保标签不被裁剪
  },
};

let xAxisData = [];
let data = [];
for (let i = 9; i < 16; i++) {
  xAxisData.push("5月" + i + "日");
  data.push(Math.round(Math.random() * 500) + 200);
}
const bar = {
  xAxis: [
    {
      data: xAxisData,
      axisLabel: {
        textStyle: {
          color: "#03a9f4",
        },
      },
      splitLine: {
        show: false,
      },
    },
    {
      // 辅助 x 轴
      show: false,
      data: xAxisData,
    },
  ],
  yAxis: {
    max: 1000,
    axisLine: {
      show: false,
    },
  },
  series: [
    {
      // 辅助系列
      type: "bar",
      silent: true,
      xAxisIndex: 1,
      itemStyle: {
        normal: {
          barBorderRadius: 20,
          color: "#ddd",
        },
      },
      barWidth: 40,
      data: data.map(function (val) {
        return 1000;
      }),
    },
    {
      type: "bar",
      data: data,
      barWidth: 40,
      itemStyle: {
        normal: {
          barBorderRadius: 20,
          color: "#03a9f4",
          shadowColor: "rgba(0, 0, 0, 0.4)",
          shadowBlur: 20,
        },
      },
    },
  ],
};
</script>

<style lang="scss" scoped>
.page {
  padding: 0 !important;
  background: transparent !important;

  :deep(.el-col) {
    margin: 10px 0;
  }

  .echarts_box {
    width: 100%;
    height: 600px;
    background: var(--bg-color);
    border-radius: 12px;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: var(--el-box-shadow-lighter);
    display: flex;
    flex-direction: column;

    .header {
      flex: auto;
    }
    .centent {
      width: 100%;
      height: 500px;
    }
  }
}
</style>
