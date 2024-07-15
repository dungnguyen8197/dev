<template>
  <el-dialog title="Import Excel" :visible.sync="dialogVisible" :before-close="handleClose" width="80%">
    <el-upload
      ref="upload"
      class="upload-demo"
      :action="url"
      :on-change="handleFileUpload"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      accept=".xlsx"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">select file</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">upload to server</el-button>
      <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
    </el-upload>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" align="center" :prop="item" :label="item" />
    </el-table>
  </el-dialog>
</template>

<script>
import XLSX from 'xlsx'
const urlBaseApi = process.env.VUE_APP_BASE_API
export default {
  name: 'DialogImportExcel',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      file_excel: '',
      url: `${urlBaseApi}/statistic/import-change-date-agent-payment`
    }
  },
  methods: {
    handleRemove(file) {
      this.tableHeader = []
      this.tableData = []
      this.$refs.upload.clearFiles()
    },
    handleClose() {
      this.$emit('onClickButtonImport', { dialog: false, reload: false })
    },
    submitUpload() {
      this.$refs.upload.submit()
      this.tableHeader = []
      this.tableData = []
      this.$emit('onClickButtonImport', { dialog: false, reload: true })
      setTimeout(() => {
        this.handleRemove()
      }, 2000)
    },
    handleSuccess(response, file, fileList) {
      // Handle successful upload response
      if (+response.error_code === 0) {
        this.$notify.success({
          title: 'Success',
          message: 'Lấy thông tin đơn hàng shop thành công !!!'
        })
        if (response?.error_msg?.length > 0) {
          setTimeout(() => {
            this.$notify.warning({
              title: 'Warning',
              message: `Những dòng bị thiếu thông tin: STT ${response?.error_msg?.join(', ')}`,
              duration: 5000
            })
          }, 500)
        }
      }
    },
    handleError(err, file, fileList) {
      this.$notify.error({
        title: 'Error',
        message: err
      })
    },
    generateData({ header, results }) {
      this.tableHeader = header
      this.tableData = results
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    handleFileUpload(file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        // Xử lý workbook (file Excel)
        // Đọc dữ liệu từ sheet đầu tiên
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const header = this.getHeaderRow(worksheet)
        const results = XLSX.utils.sheet_to_json(worksheet)
        this.generateData({ header, results })

        // Xử lý workbook (file Excel)
        // Đọc dữ liệu từ sheet đầu tiên
        // const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        // const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // console.log('--------------------jsonData', jsonData)
        // this.tableHeader = jsonData[0]
        // jsonData.splice(0, 1)
        // this.tableData = jsonData
        // console.log(this.tableData, '-------------------tableData')
      }

      reader.readAsArrayBuffer(file.raw)
    }
  }
}
</script>

<style>
.drop{
  border: none !important;
  width: auto !important;
  height: auto !important;
  line-height: normal !important;
  text-align: left !important;
}
</style>
