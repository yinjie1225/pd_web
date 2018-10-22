<template>
  <div class="mod-config">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <span style="float: right;height: 30px;line-height: 30px">客服联系方式：18667119823</span>
      <el-tab-pane label="基本信息" name="first">
        <table style="font-size: 18px;font-weight: 500">
          <tr style="height: 60px;margin-top: 20px"><td>公司名称：{{comname}}</td></tr>
          <tr style="height: 60px;margin-top: 20px"><td>联系人：{{comcontacts}}</td></tr>
          <tr style="height: 60px;margin-top: 20px"><td>联系电话：{{comcontphone}}</td></tr>
          <tr style="height: 60px;margin-top: 20px"><td>电子邮箱：{{comemail}}</td></tr>
        </table>
      </el-tab-pane>
      <el-tab-pane label="财务信息" name="second">
        <span style="height: 60px;margin: 20px 20px;font-size: 18px;font-weight: 500">未认证？</span><a href="#"><el-button type="primary" >联系客服认证</el-button></a>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        comname: '',
        comcontacts: '',
        comcontphone: '',
        comemail: '',
        activeName: 'first'
      }
    },
    activated () {
      this.getData()
    },
    computed: {
      userId: {
        get () {
          return this.$store.state.user.id
        }
      },
      userName: {
        get () {
          return this.$store.state.user.name
        }
      }
    },
    methods: {
      getData () {
        this.$http({
          url: this.$http.adornUrl('/generator/tbcompanyinfo/compayinfo'),
          method: 'get',
          params: this.$http.adornParams({
            'userid': this.userId
          })
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === 0) {
            this.comname = data.compayinfo.comname
            this.comcontacts = data.compayinfo.comcontacts
            this.comcontphone = data.compayinfo.comcontphone
            this.comemail = data.compayinfo.comemail
          } else {
            this.comname = ''
            this.comcontacts = ''
            this.comcontphone = ''
            this.comemail = ''
          }
        })
      },
      handleClick (tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>
