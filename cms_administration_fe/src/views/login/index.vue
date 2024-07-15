<template>
  <div class="login-container">
    <!-- <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left"> -->
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <el-button v-if="isLogin" class="icon" type="primary" icon="el-icon-back" @click="backCaptcha" />
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-phone" />
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="Số điện thoại"
          :readonly="isLogin"
          name="phone"
          type="text"
          tabindex="1"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-form-item v-if="isLogin" prop="otp">
        <el-input v-model="loginForm.code" placeholder="Nhập mã OTP" @keyup.enter.native="handleLogin" />
      </el-form-item>

      <el-form-item v-if="!isLogin" prop="captcha">
        <span style="margin-right: 20px" class="svg-container" @click="changeCaptcha">
          <i class="el-icon-refresh" />
        </span>
        <img :src="imageCaptcha">
      </el-form-item>

      <p v-if="!isTimeOut" style="color: white">{{ time }}</p>
      <p v-if="isTimeOut" style="color: red">Mã đã hết hạn</p>

      <el-form-item v-if="!isLogin">
        <span class="svg-container">
          <i class="el-icon-eleme" />
        </span>
        <el-input v-model="loginForm.captcha" placeholder="Nhập mã Captcha" @keyup.enter.native="handleLogin" />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" style="display: none" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <!-- <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >{{ this.btnLogin }} -->
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >{{ btnLogin }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import { Message } from 'element-ui'
import moment from 'moment'
import { getOTP, verifyCaptcha } from '@/api/user'
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct phone'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      total: '',
      minutes: '--',
      seconds: '--',
      interval: 0,
      loginForm: {
        phone: '',
        password: '',
        captcha: '',
        code: ''
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      imageCaptcha: '',
      btnLogin: 'Nhận OTP',
      isLogin: false,
      keydata: window.location.protocol + '//' + window.location.host,
      timeOut: moment('4000'),
      isTimeOut: false,
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validateUsername }],
        code: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  computed: {
    time: function() {
      return this.timeOut.format('mm:ss')
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
    time(data) {
      if (data === '00:00') {
        this.isTimeOut = true
      }
    }
  },
  created() {
    this.getCaptcha()
    setInterval(() => {
      this.timeOut = moment(this.timeOut.subtract(1, 'seconds'))
    }, 1000)
  },
  methods: {
    changeCaptcha() {
      this.getCaptcha()
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      if (this.isTimeOut) {
        Message({
          message: 'Mã đã hết hạn',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        if (!this.isLogin) {
          verifyCaptcha({ keydata: this.keydata, capstr: this.loginForm.captcha }).then(res => {
            if (res.error_code === 1) {
              Message({
                message: 'Mã Captcha không chính xác',
                type: 'error',
                duration: 5 * 1000
              })
            } else if (res.error_code === 0) {
              getOTP({ phone: this.loginForm.phone }).then(res => {
                if (res.error_code === 0) {
                  this.timeOut = moment(125 * 1000)
                  this.btnLogin = 'Login'
                  this.isLogin = true
                } else if (res.error_code === 1 && res?.error_msg?.includes('Bạn vừa lấy mã xác nhận')) {
                  this.$message.error(`Bạn vừa lấy mã OTP${res.error_msg.split('Bạn vừa lấy mã xác nhận')[1]}`)
                  this.getCaptcha()
                } else {
                  this.$message.error(res.error_msg)
                  this.getCaptcha()
                }
              })
            }
          })
        } else {
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              this.loading = true
              this.$store.dispatch('user/login', this.loginForm)
                .then(() => {
                  this.$router.push({ path: '/', query: this.otherQuery })
                  this.loading = false
                })
                .catch(() => {
                  this.$message.error('Mã OTP không chính xác')
                  this.loading = false
                })
            } else {
              return false
            }
          })
        }
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    onEvent() {
      // when you need a reCAPTCHA challenge
      this.$refs.recaptcha.execute()
    },
    getCaptcha() {
      this.keydata = Math.floor(Math.random() * 100000)
      axios.get(process.env.VUE_APP_BASE_API + '/admin/get-captcha', {
        params: { keydata: this.keydata },
        responseType: 'blob'
      }).then(res => {
        const urlCreator = window.URL || window.webkitURL
        this.timeOut = moment(60 * 2 * 1000)
        this.isTimeOut = false
        this.imageCaptcha = urlCreator.createObjectURL(res.data)
      })
    },
    backCaptcha() {
      this.loginForm.captcha = ''
      this.loginForm.code = ''
      this.isLogin = false
      this.getCaptcha()
    }
  }
}
</script>

<style lang="scss">

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  .icon {
    font-size: 24px;
    padding: 0px;
    color: #eee;
    background-color: transparent;
    border-color: transparent;
  }
}
</style>
