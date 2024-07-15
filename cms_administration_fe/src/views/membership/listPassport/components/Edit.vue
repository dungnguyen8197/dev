<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :show-close="false"
    :before-close="handleClose"
    class="update-passport"
  >
    <el-row v-loading="loadingForm && isEdit" class="box-form">
      <el-col :xs="24" :sm="6" class="pr-2">
        <el-form ref="form" :model="postForm">
          <el-form-item label="Số CMND/Passport: ">
            <el-input v-model="postForm.number_passport" placeholder="Số CMND/Passport" />
          </el-form-item>
          <el-form-item label="Tên hội viên: ">
            <el-input v-model="postForm.fullname" placeholder="Tên hội viên" />
          </el-form-item>
          <el-form-item label="Ngày sinh: ">
            <el-date-picker
              v-model="modelBirthday"
              class="w-100"
              type="date"
              format="dd/MM/yyyy"
              placeholder="Ngày sinh"
            />
          </el-form-item>
          <el-form-item label="Ngày hết hạn: ">
            <el-date-picker
              v-model="postForm.date_of_expiry"
              class="w-100"
              type="date"
              format="dd/MM/yyyy"
              placeholder="VD: 09/06/2020"
            />
          </el-form-item>
          <el-form-item label="Trạng thái: ">
            <div class="el-form-item__content">
              <el-select v-model="isConfirm" class="w-100" placeholder="Select">
                <el-option
                  v-for="item in actionIsConfirm"
                  :key="item.value"
                  :label="item.label"
                  :value="item"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :xs="24" :sm="6" class="pr-2">
        <el-form ref="form" :model="postForm">
          <el-form-item label="Ngày cấp: ">
            <el-date-picker
              v-model="postForm.date_of_issue"
              class="w-100"
              type="date"
              format="dd/MM/yyyy"
              placeholder="VD: 09/06/2020"
            />
          </el-form-item>
          <el-form-item label="Nơi cấp: ">
            <el-input v-model="postForm.place_of_issue" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Số điện thoại: ">
            <el-input v-model="objectData.golfer.phone" disabled placeholder="Số điện thoại" />
          </el-form-item>
          <el-form-item label="Giới tính: ">
            <div class="el-form-item__content">
              <el-select v-model="isSex" class="w-100" placeholder="Select">
                <el-option
                  v-for="item in optionsSex"
                  :key="item.value"
                  :label="item.label"
                  :value="item"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="Ghi chú: ">
            <el-input v-model="postForm.note" type="textarea" autocomplete="off" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :xs="24" :sm="6">
        <label class="lable-image">{{ (objectData.type === 1) ? 'Ảnh CMND' : 'Ảnh Passport' }}</label>
        <div class="tile is-ancestor">
          <div class="tile is-10 is-vertical is-parent">
            <div class="viewer-wrapper">
              <viewer
                ref="viewer"
                :options="options"
                :images="images"
                class="viewer"
                @inited="inited"
              >
                <template slot-scope="scope">
                  <figure class="images">
                    <div
                      v-for="(image, index) in scope.images"
                      :key="index + Math.random()"
                      class="image-wrapper"
                    >
                      <img class="image" :src="image" :data-source="image" :alt="image">
                    </div>
                  </figure>
                </template>
              </viewer>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="6">
        <label class="lable-image">Ảnh chân dung</label>
        <template v-if="objectData.system_avatar_path">
          <img :src="objectData.system_avatar_path" alt="" style="width: 100%; height: auto">
        </template>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCloseDialog">Hủy bỏ</el-button>
      <el-button type="primary" @click="onSubmit">{{ (isEdit) ? 'Cập nhật' : 'Thêm mới' }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { actionIsConfirm, optionsSex } from '@/utils/optionsMembership'
import { convertDate } from '@/utils/convert'

const defaultForm = {
  is_confirm: 0,
  birthday: '',
  fullname: '',
  number_passport: '',
  date_of_issue: '',
  date_of_expiry: '',
  place_of_issue: '',
  note: ''
}
export default {
  name: 'Edit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    objData: {
      type: Object,
      default: () => {}
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      objectData: {
        golfer: {
          phone: ''
        },
        certificate: {
          fullnane: '',
          avatar: '',
          birthday: ''
        }
      },
      dialogVisible: false,
      loadingForm: false,
      actionIsConfirm: [...actionIsConfirm],
      optionsSex: [...optionsSex],
      isConfirm: {},
      isSex: {},
      title: 'Thông tin hội viên',
      modelBirthday: '',
      images: [],
      isSubmit: true,
      options: {
        inline: true,
        button: true,
        navbar: true,
        title: true,
        toolbar: true,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: true,
        url: 'data-source'
      },
      timer: null
    }
  },
  watch: {
    showDialog(value) {
      this.dialogVisible = value
    },
    objData(value) {
      this.objectData = Object.assign({}, value)
      this.actionIsConfirm.map(item => {
        if (item.value === parseInt(value.is_confirm)) {
          this.isConfirm = Object.assign({}, item)
        }
      })
      this.optionsSex.map(item => {
        if (item.value === parseInt(value.gender)) {
          this.isSex = Object.assign({}, item)
        }
      })
      if (value.certificate) {
        this.modelBirthday = new Date(value.certificate.birthday)
        this.postForm.fullname = value.certificate.fullname
      }
      this.postForm.number_passport = this.objectData.number_passport
      this.postForm.date_of_issue = new Date(this.objectData.date_of_issue)
      this.postForm.date_of_expiry = new Date(this.objectData.date_of_expiry)
      this.postForm.place_of_issue = this.objectData.place_of_issue
      this.postForm.note = this.objectData.note
      const arrayImage = []
      if (value.img_passport_front) {
        arrayImage.push(value.img_passport_front)
      }
      if (value.img_passport_back) {
        arrayImage.push(value.img_passport_back)
      }
      this.images = [...arrayImage]
    },
    isConfirm(value) {
      this.postForm.is_confirm = value.value
    },
    isSex(value) {
      this.postForm.gender = value.value
    },
    modelBirthday(value) {
      this.postForm.birthday = convertDate(value, 'YYYY-MM-DD')
    }
  },
  methods: {
    onCloseDialog() {
      this.dialogVisible = false
      this.$emit('clickButton', false)
    },
    onSubmit() {
      if (this.isConfirm === 1 && !this.handleValidateForm()) {
        return
      }
      this.handleConvertDate()
      if (this.isEdit) {
        const certificateID = (this.objectData.certificate) ? this.objectData.certificate.id : 0
        const data = Object.assign(this.postForm, {
          id: this.objectData.id,
          certificate_id: certificateID
        })
        this.$store.dispatch('updateUsersPassport', data).then(response => {
          if (response.error_code === 0) {
            this.handleCloseDialogSuccess()
            this.$message.success(response.message)
          } else {
            this.$message.error(response.message)
          }
        })
      }
    },
    handleConvertDate() {
      if (this.postForm.date_of_issue !== '' || this.postForm.date_of_issue !== undefined) {
        this.postForm.date_of_issue = convertDate(this.postForm.date_of_issue, 'YYYY-MM-DD')
      }
      if (this.postForm.date_of_expiry === '' || this.postForm.date_of_expiry === undefined) {
        this.postForm.date_of_expiry = null
      } else {
        this.postForm.date_of_expiry = convertDate(this.postForm.date_of_expiry, 'YYYY-MM-DD')
      }
      if (this.postForm.birthday === '') {
        this.postForm.birthday = convertDate(Date.now(), 'YYYY-MM-DD')
      }
    },
    handleValidateForm() {
      const isConfirm = this.postForm.is_confirm
      const fullname = this.postForm.fullname
      const birthday = this.postForm.birthday
      if (fullname === '' || fullname === undefined) {
        this.$message.warning('Vui lòng nhập tên hội viên trước khi cập nhật!')
        return false
      }
      if (birthday === '' || birthday === undefined || birthday === '1970-01-01') {
        this.$message.warning('Vui lòng nhập ngày sinh hội viên trước khi cập nhật!')
        return false
      }
      if (isConfirm === 0 || isConfirm === undefined) {
        this.$message.warning('Vui lòng chọn trạng thái trước khi cập nhật!')
        return false
      }
      return true
    },
    handleClose() {
      this.postForm = Object.assign({}, defaultForm)
      this.modelBirthday = ''
      this.onCloseDialog()
    },
    handleCloseDialogSuccess() {
      this.dialogVisible = false
      this.modelBirthday = ''
      this.postForm = Object.assign({}, defaultForm)
      this.$emit('clickButton', true)
    },
    inited(viewer) {
      this.$viewer = viewer
    }
  }
}
</script>

<style lang="scss">
    .update-passport {
        .el-dialog {
            width: 90% !important;
        }

        .w-100 {
            width: 100%;
        }
    }

    .lable-image {
        line-height: 36px;
        margin-bottom: 10px;
    }

    .pr-2 {
        padding-right: 10px;
    }

    .viewer {
        height: 400px;

        .images {
            height: 100%;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            flex-wrap: wrap;
            padding: 5px;

            .image-wrapper {
                display: inline-block;
                width: calc(33% - 20px);
                margin: 5px 5px 0 5px;

                .image {
                    width: 100%;
                    cursor: pointer;
                    display: inline-block;
                }
            }
        }
    }
</style>
