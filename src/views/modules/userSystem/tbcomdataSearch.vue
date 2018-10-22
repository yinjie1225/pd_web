<template>
  <div class="mod-demo-echarts">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.businessname" placeholder="业务名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.gmtCreateStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="dataForm.gmtCreateEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!--<el-button type="primary" @click="addOrUpdateHandle()">导出</el-button>-->
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div id="J_chartLineBox" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column prop="businessname" header-align="center" align="center" label="业务名称"></el-table-column>
      <el-table-column prop="advertpv" header-align="center" align="center" label="展示数"></el-table-column>
      <el-table-column prop="advertuv" header-align="center" align="center" label="点击数"></el-table-column>
      <el-table-column prop="expectprofit" header-align="center" align="center" label="收益"></el-table-column>
      <el-table-column prop="gmtCreate" header-align="center" align="center" label="数据日期"></el-table-column>
    </el-table>
    <div style="margin: 10px;text-align: center;">总计：
      <span style="margin-left: 10px"><span style="font-weight: bold;">收益:</span>{{expectprofitSum}}</span>
    </div>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>

</template>

<script>
  import echarts from 'echarts'
  export default {
    data () {
      const lastMonthTime = new Date()
      lastMonthTime.setMonth(lastMonthTime.getMonth() - 1)
      return {
        chartLine: null,
        dataForm: {
          advertname: '',
          gmtCreateStart: lastMonthTime,
          gmtCreateEnd: new Date()
        },
        dataList: [],
        charList: {},
        advertpvSum: 0,
        advertuvSum: 0,
        advertcustuvSum: 0,
        expectprofitSum: 0,
        visitipSum: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        option: {
          'title': {
            'text': '收益'
          },
          'tooltip': {
            'trigger': 'axis'
          },
          'grid': {
            'left': '3%',
            'right': '4%',
            'bottom': '3%',
            'containLabel': true
          },
          xAxis: {
            'type': 'category',
            'boundaryGap': false,
            data: ['周一', '周二', '周三', '周四', '周五']
          },
          'yAxis': [
            {
              'type': 'value'
            }],
          'series': [
            {
              'name': '收益',
              'type': 'line',
              'yAxisIndex': 0,
              'stack': '总量',
              'data': [0, 0, 0, 0, 0]
            }
          ]
        }
      }
    },
    activated () {
      this.getDataList()
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartLine) {
        this.chartLine.resize()
      }
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/advertisingbusiness/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'businessname': this.dataForm.businessname,
            'gmtCreateStart': this.dataForm.gmtCreateStart,
            'gmtCreateEnd': this.dataForm.gmtCreateEnd
          })
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === 0) {
            if (data.page != null) {
              this.dataList = data.page
              this.totalPage = data.numCount
              this.expectprofitSum = data.theTotalAmount
              // 图表数据
              if (data.gmtCreate.length !== 0) {
                this.charList = data
                this.option.xAxis.data = []
                this.option.series[0].data = []
                for (let i = 0; i < this.charList.gmtCreate.length; i++) {
                  this.option.xAxis.data.push(this.charList.gmtCreate[i])
                  this.option.series[0].data.push(this.charList.expectprofit[i])
                }
              } else {
                this.option.xAxis.data = []
                this.option.series[0].data = []
              }
              this.chartLine = echarts.init(document.getElementById('J_chartLineBox'))
              this.chartLine.setOption(this.option)
              window.addEventListener('resize', () => {
                this.chartLine.resize()
              })
              // end
            }
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
          this.initChartLine()
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (businessid) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(businessid)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/advertisingbusiness/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 折线图
      initChartLine () {
        // this.$http({
        //   url: this.$http.adornUrl(`/generator/advertisingbusiness/listChart`),
        //   method: 'get',
        //   params: this.$http.adornParams({
        //     'businessname': this.dataForm.businessname,
        //     'gmtCreateStart': this.dataForm.gmtCreateStart,
        //     'gmtCreateEnd': this.dataForm.gmtCreateEnd
        //   })
        // }).then(({data}) => {
        //   console.log(data)
        //   if (data.code !== 400) {
        //     this.charList = data
        //     this.option.xAxis.data = []
        //     this.option.series[0].data = []
        //     for (let i = 0; i < this.charList.gmtCreate.length; i++) {
        //       this.option.xAxis.data.push(this.charList.gmtCreate[i])
        //       this.option.series[0].data.push(this.charList.expectprofit[i])
        //     }
        //   } else {
        //     this.option.xAxis.data = []
        //     this.option.series[0].data = []
        //   }
        //   this.chartLine = echarts.init(document.getElementById('J_chartLineBox'))
        //   this.chartLine.setOption(this.option)
        //   window.addEventListener('resize', () => {
        //     this.chartLine.resize()
        //   })
        // })
      }
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>
