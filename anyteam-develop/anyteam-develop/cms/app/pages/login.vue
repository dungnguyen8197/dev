<template>
  <div class="container">
    <form id="login-form" class="needs-validation vh-100 d-flex flex-wrap align-items-center justify-content-center" novalidate @submit.prevent="doLogin">
      <CCard style="width: 30rem">
        <CCardHeader>
          ログイン
        </CCardHeader>
        <CCardBody>
          <CRow v-if="error">
            <CCol sm="12">
              <CAlert
                color="danger"
              >
                {{ errorText }}
              </CAlert>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="12">
              <CInput
                label="メールアドレス"
                type="email"
                placeholder="name@domain.com"
                v-model="email"
                required
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="12">
              <CInput
                type="password"
                label="パスワード"
                v-model="password"
                pattern=".{6,50}"
                required
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="6">
              <CButton
                color="primary"
                size="lg"
                type="submit"
              >
                ログイン
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'auth',
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      isLogin: false,
      error: false,
      errorText: 'ログインに失敗しました',
      isProcess: false,
    }
  },
  methods: {
    logout() : void {
      this.$auth.logout()
    },
    async doLogin() :Promise<void> {
      if (this.isProcess) return;
      let form = <HTMLInputElement>document.getElementById('login-form')
      form.classList.add('was-validated')
      
      try {
        if (form.checkValidity()) {
          this.isProcess = true;
          let loginInfo = {
            email: this.email,
            password: this.password
          }
          await this.$auth.loginWith('local', {data: loginInfo});
          this.isProcess = false;
        }
      } catch (e) {
        this.isProcess = false;
        this.error = true;
      }
    },
  }
})
</script>

<style>
</style>
