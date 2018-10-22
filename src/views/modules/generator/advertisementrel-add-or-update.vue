<template>
  <el-dialog
    :title="!dataForm.id ? '详情' : '详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="78%" height="700px">
    <!--<el-form :inline="true" style="margin-top: -16px;">-->
      <!--<el-form-item>-->
        <!--<el-date-picker-->
          <!--v-model="dataForm.gmtCreateStart"-->
          <!--type="date"-->
          <!--value-format="yyyy-MM-dd"-->
          <!--placeholder="选择日期">-->
        <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
        <!--<el-button @click="init(dataForm.businessid)">查询</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->
    <el-table
      :data = 'dataForm'
      border
      style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center"  width="50"></el-table-column>
      <el-table-column  prop="advertname" header-align="center" align="center" label="广告位名称 "></el-table-column>
      <el-table-column  prop="advertpv" header-align="center" align="center" label="展示数"></el-table-column>
      <el-table-column  prop="advertuv" header-align="center" align="center" label="点击数"></el-table-column>
      <el-table-column  prop="expectprofit" header-align="center" align="center" label="收益"></el-table-column>
      <el-table-column  prop="gmt_create" header-align="center" align="center" label="添加时间"></el-table-column>
      <el-table-column  prop="advettime" header-align="center" align="center" label="广告日期"></el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        businessid: '',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        visible: false,
        dataForm: []
      }
    },
    methods: {
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList(this.businessid)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.businessid)
      },
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.businessid = id
          this.getDataList(this.businessid)
        })
      },
      getDataList (id) {
        this.$http({
          url: this.$http.adornUrl(`/generator/advertisementrel/findByAdvertisementRelId`),
          method: 'post',
          data: {
            'excelid': id,
            'page': this.pageIndex,
            'limit': this.pageSize
          }
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === 0) {
            this.dataForm = data.page
            this.totalPage = data.numCount
          } else {
            this.totalPage = 0
          }
        })
      }
    }
  }
</script>
