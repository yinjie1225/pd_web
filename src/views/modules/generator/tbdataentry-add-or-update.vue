<template>
  <el-dialog
    :title="'Excel导入'"
    :close-on-click-modal="false"
    width="65%"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" :inline="true">
      <el-form-item label="业务名称" prop="businessname">
        <el-input v-model="dataForm.businessname" placeholder="业务名称" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="业务ID" prop="businessid">
        <el-input v-model="dataForm.businessid" placeholder="业务ID" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="操作员" prop="businessOperatorname">
        <el-input :value="userName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="录入方式" >
        <el-input type="text" value="Excel上传" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item>

        <el-upload class="upload-demo" ref="upload" :action='uploadURL' name="file" :headers="headers" :data="form[0]"
                   :onError="uploadError" :onSuccess="uploadSuccess" :beforeUpload="beforeAvatarUpload"
                   :file-list="fileList1" :limit="1" :auto-upload="false">
          <el-button style="margin: 0;" slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <a href="http://fenrunpingtai.oss-cn-shenzhen.aliyuncs.com/ModelFile/ExcelModelSample.xlsx" download="ExcelModelSample.xlsx">Excel导入模板下载</a>
      </el-form-item>
    </el-form>
    <!--获取上传文件中的数据，用来确认-->
    <el-table
      :data="fileList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column prop="gmtCreate" header-align="center" align="center" label="数据日期"></el-table-column>
      <el-table-column prop="advertname" header-align="center" align="center" label="广告位名称"></el-table-column>
      <el-table-column prop="advertspec" header-align="center" align="center" label="广告位规格"></el-table-column>
      <el-table-column prop="advertpv" header-align="center" align="center" label="广告位访问pv"></el-table-column>
      <el-table-column prop="advertuv" header-align="center" align="center" label="广告位访问uv"></el-table-column>
      <el-table-column prop="advertcustuv" header-align="center" align="center" label="新客访问量(UV)"></el-table-column>
      <el-table-column prop="visitip" header-align="center" align="center" label="IP访问量"></el-table-column>
      <el-table-column prop="expectprofit" header-align="center" align="center" label="预计收益"></el-table-column>
    </el-table>

    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"  :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose" style="float:left" type="primary" :disabled="isdisable">确认上传数据</el-button>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {
    data () {
      return {
        dataListLoading: false,
        excelid: '',
        isdisable: true,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        uploadURL: window.SITE_CONFIG['baseUrl'] + '/generator/advertisementexcel/importexceldate',
        headers: {
          'token': Vue.cookie.get('token')
        },
        form: [],
        fileList: [],
        fileList1: [],
        dataForm: {
          businessname: '',
          businessid: '',
          businessstate: ''
        },
        visible: false,
        dataRule: {
          businessid: [
            {required: true, message: '业务ID不能为空', trigger: 'blur'}
          ],
          businessname: [
            {required: true, message: '业务名称不能为空', trigger: 'blur'}
          ],
          businessoperatorname: [
            { required: true, message: '操作员名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      userName: {
        get () {
          return this.$store.state.user.name
        }
      }
    },
    methods: {
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
      uploadSuccess: function (response, file, fileList) {
        console.log('上传文件', response)
        if (response.code === 0) {
          alert('上传文件成功！')
          this.fileList1 = []
          this.visible = false
          this.$emit('refreshDataList')
        } else {
          alert(response.msg)
          this.visible = false
        }
      },
      // 上传错误
      uploadError: function (response, file, fileList) {
        alert('上传失败，请重试！')
      },
      // 上传前对文件的大小的判断
      beforeAvatarUpload: function (file) {
        var extension = file.name.split('.')[1] === 'xls'
        var extension2 = file.name.split('.')[1] === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!extension && !extension2) {
          alert('上传模板只能是 xls、xlsx 格式!')
        }
        if (!isLt2M) {
          alert('上传模板大小不能超过 5MB!')
        }
        return (extension || extension2) && isLt2M
      },
      submitUpload: function () {
        this.$refs.upload.submit()
      },
      handleClose (done) {
        this.$confirm('确定数据确认？')
          .then(_ => {
            this.$http({
              url: this.$http.adornUrl(`/generator/advertisementexcel/dataConfirm`),
              method: 'post',
              data: this.$http.adornData({
                'buisnessid': this.dataForm.businessid,
                'confirmvalue': 3
              })
            }).then(({data}) => {
              console.log(data)
              alert(data.msg)
              this.$emit('refreshDataList')
              this.visible = false
            })
            done(() => {})
          })
          .catch(_ => {})
      },
      init (id, excelid) {
        this.form.splice(0, this.form.length)
        this.dataForm.id = id || 0
        this.visible = true
        this.excelid = excelid
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/generator/tbprofitbusinessinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.businessid = data.tbProfitbusinessInfo.businessid
                this.dataForm.businessname = data.tbProfitbusinessInfo.businessname
                this.form.push({bid: this.dataForm.businessid, bname: this.dataForm.businessname})
                this.dataForm.businessdescribe = data.tbProfitbusinessInfo.businessdescribe
                this.dataForm.businessOperator = data.tbProfitbusinessInfo.businessOperator
                this.dataForm.businessoperatorname = data.tbProfitbusinessInfo.businessoperatorname
                this.dataForm.businesstype = data.tbProfitbusinessInfo.businesstype
                this.dataForm.businessstate = data.tbProfitbusinessInfo.businessstate
                this.dataForm.gmtCreate = data.tbProfitbusinessInfo.gmtCreate
                this.dataForm.gmtModified = data.tbProfitbusinessInfo.gmtModified
                this.dataForm.isState = data.tbProfitbusinessInfo.isState
                this.dataForm.isDelete = data.tbProfitbusinessInfo.isDelete
              }
              this.isdisable = true
              this.isDisable()
              console.log(this.isdisable)
            })
          }
          this.getDataList()
        })
      },
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/generator/advertisementexcel/queryImportData'),
          method: 'post',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'excelid': this.excelid
          })
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === 0) {
            this.fileList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.fileList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      isDisable () {
        if (this.excelid) {
          this.$http({
            url: this.$http.adornUrl('/generator/advertisementexcel/queryWhetherConfirm'),
            method: 'post',
            params: this.$http.adornParams({
              'excelid': this.excelid
            })
          }).then(({data}) => {
            console.log(data)
            if (data.exceldatatype < 3) {
              this.isdisable = false
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.visible = false
        this.$emit('refreshDataList')
      }
    }
  }
</script>
