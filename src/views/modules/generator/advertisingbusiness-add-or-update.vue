<template>
    <el-dialog
      :title="!dataForm.businessid ? '详情' : '详情'"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="78%" height="700px">
      <el-form :inline="true" style="margin-top: -16px;">
        <el-form-item>
          <el-date-picker
            v-model="dataForm.gmtCreateStart"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="init(dataForm.businessid)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data = 'dataForm'
        border
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center"  width="50"></el-table-column>
        <el-table-column  prop="businessID" header-align="center" align="center" label="业务ID"></el-table-column>
        <el-table-column  prop="comname" header-align="center" align="center" label="公司名称"></el-table-column>
        <el-table-column  prop="incomemount" header-align="center" align="center" label="入账金额"></el-table-column>
        <el-table-column  prop="gmt_create" header-align="center" align="center" label="最新入账时间"></el-table-column>
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
        dataForm: [],
        dataRule: {
          excelid: [
            { required: true, message: '导入数据ID不能为空', trigger: 'blur' }
          ],
          advertname: [
            { required: true, message: '广告位名称不能为空', trigger: 'blur' }
          ],
          advertspec: [
            { required: true, message: '广告位规格不能为空', trigger: 'blur' }
          ],
          advertpv: [
            { required: true, message: '广告位访问pv不能为空', trigger: 'blur' }
          ],
          advertuv: [
            { required: true, message: '广告位访问uv不能为空', trigger: 'blur' }
          ],
          advertcustuv: [
            { required: true, message: '新客访问量uv不能为空', trigger: 'blur' }
          ],
          visitip: [
            { required: true, message: 'IP访问量不能为空', trigger: 'blur' }
          ],
          expectprofit: [
            { required: true, message: '预计收益不能为空', trigger: 'blur' }
          ],
          confirmtype: [
            { required: true, message: '确认状态不能为空', trigger: 'blur' }
          ],
          gmtCreate: [
            { required: true, message: '添加时间不能为空', trigger: 'blur' }
          ],
          gmtModified: [
            { required: true, message: '修改时间不能为空', trigger: 'blur' }
          ],
          isState: [
            { required: true, message: '是否有效  0 否  1 是不能为空', trigger: 'blur' }
          ],
          isDelete: [
            { required: true, message: '是否删除   0 否  1是不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (businessid) {
        this.businessid = businessid
        this.dataForm.businessid = businessid || 0
        this.visible = true
        this.$nextTick(() => {
          // this.$refs['dataForm'].resetFields()
          if (this.dataForm.businessid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/advertisingbusiness/findByBusinessId`),
              method: 'post',
              data: {
                'businessid': businessid,
                'startdate': this.dataForm.gmtCreateStart,
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
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.init(this.businessid)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.init(this.businessid)
      }
    }
  }
</script>
