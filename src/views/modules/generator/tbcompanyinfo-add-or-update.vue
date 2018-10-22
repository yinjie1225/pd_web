<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="公司名称" prop="comname">
      <!--<el-select v-model="companyvalue" placeholder="请选择" v-show="!dataForm.id">-->
        <!--<el-option-->
          <!--v-for="item in options"-->
          <!--:key="item.comcode"-->
          <!--:label="item.comname"-->
          <!--:value="item.comname">-->
        <!--</el-option>-->
      <!--</el-select>-->
        <el-input v-model="dataForm.comname" v-show="!dataForm.id" placeholder="公司名称"></el-input>
        <el-input v-model="dataForm.comname"  v-show="dataForm.id" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="联系人" prop="comcontacts">
      <el-input v-model="dataForm.comcontacts" placeholder="联系人"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="comcontphone">
      <el-input v-model="dataForm.comcontphone" placeholder="联系方式(仅限手机号)"></el-input>
    </el-form-item>
    <el-form-item label="公司邮箱" prop="comemail">
      <el-input v-model="dataForm.comemail" placeholder="公司邮箱"></el-input>
    </el-form-item>
    <el-form-item label="开户银行" prop="openbank">
      <el-input v-model="dataForm.openbank" placeholder="开户银行"></el-input>
    </el-form-item>
    <el-form-item label="银行账户" prop="openbankcode">
      <el-input v-model="dataForm.openbankcode" placeholder="银行账户"></el-input>
    </el-form-item>
    <el-form-item label="是否有效" prop="isState" v-show="dataForm.id">
      <el-radio-group v-model="dataForm.isState">
        <el-radio :label="1">有效</el-radio>
        <el-radio :label="0">无效</el-radio>
      </el-radio-group>
    </el-form-item>
    <!--<el-form-item label="是否删除" prop="isDelete" >-->
      <!--<el-radio-group v-model="dataForm.isDelete">-->
        <!--<el-radio :label="1">是</el-radio>-->
        <!--<el-radio :label="0">否</el-radio>-->
      <!--</el-radio-group>-->
    <!--</el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile, isEmail, isBankCode } from '@/utils/validate'
  export default {
    data () {
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('公司邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateBankCode = (rule, value, callback) => {
        if (!isBankCode(value)) {
          callback(new Error('银行卡号格式错误'))
        } else {
          callback()
        }
      }
      return {
        options: [{
          comcode: '',
          comname: ''
        }],
        companyvalue: '',
        visible: false,
        dataForm: {
          id: 0,
          comcode: '',
          comname: '',
          comcontacts: '',
          comcontphone: '',
          comaddress: '',
          comemail: '',
          comfinance: '',
          compayee: '',
          businesscode: '',
          businessimg: '',
          licenceimg: '',
          comopen: '',
          openbank: '',
          openbankcode: '',
          openbranchbank: '',
          comremark: '',
          gmtCreate: '',
          gmtModified: '',
          isState: '',
          isDelete: ''
        },
        dataRule: {
          // comcode: [
          //   { required: true, message: '公司编号不能为空', trigger: 'blur' }
          // ],
          comname: [
            { required: true, message: '公司名称不能为空', trigger: 'blur' }
          ],
          comcontacts: [
            { required: true, message: '公司联系人不能为空', trigger: 'blur' }
          ],
          comcontphone: [
            { required: true, message: '联系方式不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          // comaddress: [
          //   { required: true, message: '公司地址不能为空', trigger: 'blur' }
          // ],
          comemail: [
            { required: true, message: '公司邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          openbank: [
            { required: true, message: '开户银行不能为空', trigger: 'blur' }
          ],
          openbankcode: [
            { required: true, message: '开户银行卡号不能为空', trigger: 'blur' },
            { validator: validateBankCode, trigger: 'blur' }
          ]
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        // 公司名称列表
        this.$http({
          url: this.$http.adornUrl(`/generator/tbcompanyinfo/`),
          method: 'get'
        }).then((response) => {
          this.options = response.data.companyList
        })
        // end
      })
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/generator/tbcompanyinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.comcode = data.tbCompanyInfo.comcode
                this.dataForm.comname = data.tbCompanyInfo.comname
                this.dataForm.comcontacts = data.tbCompanyInfo.comcontacts
                this.dataForm.comcontphone = data.tbCompanyInfo.comcontphone
                this.dataForm.comaddress = data.tbCompanyInfo.comaddress
                this.dataForm.comemail = data.tbCompanyInfo.comemail
                this.dataForm.comfinance = data.tbCompanyInfo.comfinance
                this.dataForm.compayee = data.tbCompanyInfo.compayee
                this.dataForm.businesscode = data.tbCompanyInfo.businesscode
                this.dataForm.businessimg = data.tbCompanyInfo.businessimg
                this.dataForm.licenceimg = data.tbCompanyInfo.licenceimg
                this.dataForm.comopen = data.tbCompanyInfo.comopen
                this.dataForm.openbank = data.tbCompanyInfo.openbank
                this.dataForm.openbankcode = data.tbCompanyInfo.openbankcode
                this.dataForm.openbranchbank = data.tbCompanyInfo.openbranchbank
                this.dataForm.comremark = data.tbCompanyInfo.comremark
                this.dataForm.gmtCreate = data.tbCompanyInfo.gmtCreate
                this.dataForm.gmtModified = data.tbCompanyInfo.gmtModified
                this.dataForm.isState = data.tbCompanyInfo.isState
                this.dataForm.isDelete = data.tbCompanyInfo.isDelete
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        var x = 1
        if (!this.dataForm.id) {
          x = 1
        } else {
          x = this.dataForm.isState
        }
        if (this.dataForm.comname === '' || this.dataForm.comname === null) {
          this.$message.error('公司名称不能为空！')
          return 0
        }
        if (this.dataForm.comcontacts === '' || this.dataForm.comcontacts === null) {
          this.$message.error('联系人不能为空！')
          return 0
        }
        if (this.dataForm.comcontphone === '' || this.dataForm.comcontphone === null) {
          this.$message.error('联系方式不能为空！')
          return 0
        }
        if (this.dataForm.comemail === '' || this.dataForm.comemail === null) {
          this.$message.error('公司邮箱不能为空！')
          return 0
        }
        if (this.dataForm.openbank === '' || this.dataForm.openbank === null) {
          this.$message.error('开户银行不能为空！')
          return 0
        }
        if (this.dataForm.openbankcode === '' || this.dataForm.openbankcode === null) {
          this.$message.error('银行卡号不能为空！')
          return 0
        }
        this.$http({
          url: this.$http.adornUrl(`/generator/tbcompanyinfo/${!this.dataForm.id ? 'save' : 'update'}`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.id || undefined,
            'comcode': this.dataForm.comcode,
            'comname': this.dataForm.comname,
            'comcontacts': this.dataForm.comcontacts,
            'comcontphone': this.dataForm.comcontphone,
            'comaddress': this.dataForm.comaddress,
            'comemail': this.dataForm.comemail,
            'comfinance': this.dataForm.comfinance,
            'compayee': this.dataForm.compayee,
            'businesscode': this.dataForm.businesscode,
            'businessimg': this.dataForm.businessimg,
            'licenceimg': this.dataForm.licenceimg,
            'comopen': this.dataForm.comopen,
            'openbank': this.dataForm.openbank,
            'openbankcode': this.dataForm.openbankcode,
            'openbranchbank': this.dataForm.openbranchbank,
            'comremark': this.dataForm.comremark,
            'gmtCreate': this.dataForm.gmtCreate,
            'gmtModified': this.dataForm.gmtModified,
            'isState': x,
            'isDelete': 0
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
}
</script>
