<template>
  <div id="app">
    <router-view />
  </div>

</template>

<script>

// import { getToken } from '@/utils/auth'
// import { MessageBox } from 'element-ui'
// import store from '@/store'

export default {
  name: 'App',
  created() {
    // if (!getToken()) {
    //   // to re-login
    //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //     confirmButtonText: 'Re-Login',
    //     cancelButtonText: 'Cancel',
    //     type: 'warning'
    //   }).then(() => {
    //     store.dispatch('user/resetToken').then(() => {
    //   location.reload()
    //     })
    //   })
    // }
  }
}
</script>

<style>
.p-10 {
  padding: 10px;
}

.pl-10 {
  padding-left: 10px;
}

.pr-10 {
  padding-right: 10px;
}

.pt-10 {
  padding-top: 10px;
}

.pb-10 {
  padding-bottom: 10px;
}

.m-10 {
  margin: 10px !important;
}

.ml-10 {
  margin-left: 10px;
}

.mr-10 {
  margin-right: 10px;
}

.mt-10 {
  margin-top: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mg-5 {
  margin: 5px !important;
}

.ml-5 {
  margin-left: 5px;
}

.mr-5 {
  margin-right: 5px;
}

.mt-5 {
  margin-top: 5px;
}

.mb-5 {
  margin-bottom: 5px;
}

.el-table .cell {
  word-break: unset !important;
}

.vertical-middle {
  vertical-align: middle !important;
}

.el-message-box__message p, .el-form-item--medium .el-form-item__label {
  word-break: break-word;
}
/* , .table-bordered thead th, .table td, .table th */
.word-break, .table-bordered thead td {
  word-break: break-word;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.el-table .cell {
  text-overflow: unset !important;
}
</style>
<style lang="scss">
  .dialog-cancel-order {
    .el-dialog__header {
      display: none !important;
    }
    .el-dialog__body {
      padding: 20px !important
    }
  }
  .dialog-statistic-bill {
    .el-dialog__body {
    padding-top: 0 !important;
    }
    .el-icon-close {
      transform: scale(2);
    }
  }
  .el-scrollbar__bar {
    opacity: 1 !important;
  }
</style>
<style lang="scss">
// .daterange {
//   .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner {
//     width: 100% !important;
//     max-width: 400px !important;
//   }
// }
@media screen and (min-width: 0px) and (max-width: 700px) {
  .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner {
    width: 100% !important;
    max-width: 400px !important;
  }
 .title_code_payment {
    display: flex !important;
    flex-direction: column !important;
    .el-form-item__label {
      // width: 100% !important;
      text-align: left !important;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
.table_custom {
  input {
    background-color: inherit;
    border: none !important;
    font-weight: 600 !important;
  }
  .service-title {
    input {
      color: blue !important;
    }
  }
  .category-title {
    input {
      text-transform: uppercase
    }
  }
  .el-input-number__increase, .el-input-number__decrease {
    display: none !important;
  }
}
@media screen and (min-width: 0px) and (max-width: 700px) {
  .el-dialog {
    min-width: 360px;
  }
  .el-select-dropdown__list {
    max-width: 90vw;
  }
  .title_code_payment {
    display: flex !important;
    flex-direction: column !important;
    .el-form-item__label {
      // width: 100% !important;
      text-align: left !important;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }

  .row-order-invoice {
    flex-direction: column;
  }
  .el-form-item {
    margin-bottom: 10px !important;
    .el-form-item__label {
      line-height: 25px;
      margin-bottom: 0 !important;
    }
  }
}
.select1 .el-input__inner::placeholder {
  color: black !important;
}

</style>
