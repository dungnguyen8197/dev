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
import { isEmpty } from '@/utils/validate'
import GolferResource from '@/api/golfer/golfer'

// const typeImport = [
//   { label: 'Nhập danh sách golfer', value: 1 },
//   { label: 'Nhập danh sách sản phẩm', value: 2 }
// ]
const golferResource = new GolferResource()

export default {
  name: 'UploadExcelInsurancePhysicalDamage',
  props: {
    listsGolfers: {
      type: Array,
      default: function() {
        return []
      }
    },
    listsGolferError: {
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
    async readerData(rawFile) {
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
          const arrayVgaError = []
          console.log('results....................', results)
          this.$emit('onSetData', array, arrayVgaError)
          let index = 0
          results.map(item => {
            const obj = {
              index: index++,
              user_id: item['vID'],
              user_name: item['Name'],
              passport: item['Passport'],
              indexImport: item['STT'],
              system_avatar_path: 'https://livenet.vhandicap.com/images/av.png'
            }

            if (isEmpty(obj.user_id) && isEmpty(obj.passport)) {
              arrayVgaError.push(obj)
            } else {
              array.push(obj)
            }
          })

          golferResource.checkGolferExists({ list_golfer: array }).then(res => {
            console.log('res....................1111111111111111', res)
            // lấy danh sách golfer có trong mảng array nhưng không có trong data trả về, kiemer tra theo key index
            const listGolferNotExists = array.filter(item => {
              const check = res.data.filter(row => parseInt(row.index) === parseInt(item.index))
              if (check.length === 0) {
                return item
              }
            })
            console.log('listGolferNotExists....................', listGolferNotExists)
            this.$emit('onSetData', res.data, [...arrayVgaError, ...listGolferNotExists])
          }).catch(err => {
            console.log('err....................', err)
            this.$message.error('Có lỗi xảy ra, vui lòng thử lại sau')
            this.$emit('onSetData', [], [])
          })

          this.loading = false
          console.log('array....................', array)
          console.log('array....................', arrayVgaError)
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
