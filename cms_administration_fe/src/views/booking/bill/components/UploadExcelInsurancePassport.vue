<template>
  <el-row>
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Thả tệp excel vào đây hoặc
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">Browse</el-button>
    </div>
  </el-row>
</template>

<script>
import XLSX from 'xlsx'
import BookingPaxResource from '@/api/BookingPax'
const bookingPaxResource = new BookingPaxResource()
export default {
  name: 'UploadExcelInsurancePassport',
  props: {
    listsPassports: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) {
        return
      }
      this.upload(rawFile)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) {
        return
      }
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.warning('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.warning('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const results = XLSX.utils.sheet_to_json(worksheet)
          const array = []
          // this.$store.dispatch('onCheckGolferId', { list: results }).then(response => {
          //   if (response.error_code === 0) {
          //     if (response.data.length > 0) {
          //       response.data.map(row => {
          //         const vga = row['MÃ VGA']
          //         const fullname = row['HỌ VÀ TÊN']
          //         const check = this.listsGolfers.filter(item => parseInt(item.value) === parseInt(vga))
          //         if (vga && check.length === 0) {
          //           const item = { golfer: { system_avatar_path: 'https://livenet.vhandicap.com/images/av.png', id: vga, fullname: `${fullname}` }, label: `VID${vga}`, value: parseInt(vga) }
          //           array.push(item)
          //         }
          bookingPaxResource.onCheckGolferPassport({ list: results }).then(response => {
            if (response.data.error_code === 0) {
              if (response.data.data.length > 0) {
                response.data.data.map(row => {
                  const vga = row['MÃ vID']
                  const userName = row['FullName ']
                  const passport = row['PASSPORT']
                  // const check = this.listsPassports.filter(item => parseInt(item.value) === parseInt(vga));
                  // if (vga && check.length === 0) {
                  const item = { id: vga, passport: passport, name: userName, label: `vID${vga}`, value: parseInt(vga) }
                  array.push(item)
                  // }
                })
              }
              this.$emit('onSetData', array)
              this.loading = false
              resolve()
            } else {
              this.$message.warning(response.data.error_msg)
              this.loading = false
            }
          })
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 1px dashed #bbb;
  width: 100%;
  height: 36px;
  margin: 0 auto;
  font-size: 15px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
  line-height: 33px;
}
</style>
