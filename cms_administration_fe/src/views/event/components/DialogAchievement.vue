<template>
  <el-dialog
    title="Thêm thành tích"
    :visible.sync="$store.getters.isShowDialogAddAchievement"
    width="80%"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Danh sách thành tích" required>
        <el-row class="data-table-content table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col" class="text-center" style="min-width: 180px">Loại thành tích</th>
                <th scope="col" class="text-center" style="min-width: 180px">Tên thành tích</th>
                <th scope="col" class="text-center" style="min-width: 180px">Golfer</th>
                <th scope="col" class="text-center" style="min-width: 180px">Cá nhân/CLB</th>
                <th scope="col" class="text-center" style="min-width: 180px">Câu lạc bộ</th>
                <th scope="col" class="text-center" style="min-width: 180px">Xóa</th>
              </tr>
            </thead>
            <tbody>
              <template>
                <template v-for="(item, index) in formRequest.achievement_lists">
                  <tr :key="index">
                    <td class="text-center">
                      <el-select
                        v-model="formRequest.achievement_lists[index].achievement_type"
                        class="w-100"
                        filterable
                        remote
                        clearable
                        placeholder="Chọn loại thành tích"
                      >
                        <el-option
                          v-for="achievement in achievementList"
                          :key="achievement.id"
                          :label="achievement.achievement_name"
                          :value="achievement.id"
                        />
                      </el-select>
                    </td>
                    <td class="text-center">
                      <el-input
                        v-model="formRequest.achievement_lists[index].achievement_name"
                        :disabled="formRequest.achievement_lists && formRequest.achievement_lists[index].achievement_type && objectAchievement[formRequest.achievement_lists[index].achievement_type].is_custom != 1"
                        placeholder="Tên thành tích"
                      />
                    </td>
                    <td v-if="formRequest.achievement_lists[index].type == 2" class="text-center">
                      <el-select
                        :ref="`searchGofer${index}`"
                        v-model="formRequest.achievement_lists[index].user_id"
                        class="w-100"
                        filterable
                        remote
                        clearable
                        placeholder="Nhập viD hoặc tên"
                        :remote-method="onSearchGolfer"
                        @hook:mounted="(value) => cancelReadOnly(value, `searchGofer${index}`)"
                        @visible-change="(value) => cancelReadOnly(value, `searchGofer${index}`)"
                      >
                        <el-option
                          v-for="user in users"
                          :key="user.value"
                          :label="user.label"
                          :value="user.value"
                        />
                      </el-select>
                    </td>
                    <td v-else />
                    <td class="text-center">
                      <el-select
                        :ref="`searchClub${index}`"
                        v-model="formRequest.achievement_lists[index].type"
                        class="w-100"
                        filterable
                        remote
                        clearable
                        placeholder="Nhập tên CLB "
                        :remote-method="onSearchClub"
                        @hook:mounted="(value) => cancelReadOnly(value, `searchClub${index}`)"
                        @visible-change="(value) => cancelReadOnly(value, `searchClub${index}`)"
                      >
                        <el-option
                          v-for="val in typeList"
                          :key="val.value"
                          :label="val.label"
                          :value="val.value"
                        />
                      </el-select>
                    </td>
                    <td v-if="$store.getters.event_object.is_global == 1 && formRequest.achievement_lists[index].type == 1" class="text-center">
                      <el-select
                        :ref="`searchClub${index}`"
                        v-model="formRequest.achievement_lists[index].club_id"
                        class="w-100"
                        filterable
                        remote
                        clearable
                        placeholder="Nhập tên CLB "
                        :remote-method="onSearchClub"
                        @hook:mounted="(value) => cancelReadOnly(value, `searchClub${index}`)"
                        @visible-change="(value) => cancelReadOnly(value, `searchClub${index}`)"
                      >
                        <el-option
                          v-for="club in clubs"
                          :key="club.id"
                          :label="club.name"
                          :value="club.id"
                        />
                      </el-select>
                    </td>
                    <td v-else />
                    <td class="text-center">
                      <el-button
                        style="margin-right: 10px"
                        size="small"
                        :title="`Xóa`"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click="deleteProductGifts(index)"
                      />
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
          <el-row class="text-center">
            <el-button class="text-center" @click="addProductGifts">Thêm thành tích</el-button>
          </el-row>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">Xác nhận</el-button>
    </span>
  </el-dialog>
</template>
<script>

// import { validateText, validateImage, validateTextArea } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import EventResource from '@/api/event'
import { trim_string_object } from '@/utils/trim-string-object'
import GolferResource from '@/api/golfer/golfer'
import AdminClubResource from '@/api/club/admin-club'

const golferResource = new GolferResource()
const eventResource = new EventResource()
const adminClubResource = new AdminClubResource()

export default {
  name: 'DialogPartner',
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {},
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {
        achievement_lists: []
      },
      request: {},
      achievementList: [],
      users: [],
      clubs: [],
      objectAchievement: {},
      typeList: [{ value: 1, label: 'CLB' }, { value: 2, label: 'Cá nhân' }]
    }
  },
  watch: {
    '$store.getters.isShowDialogAddAchievement'(value) {
      console.log('v-if="$store.getters.event_object.is_global == 1"', this.$store.getters.event_object.is_global)
    }
  },

  created() {
    this.onGetList()
  },
  methods: {
    onGetList() {
      this.loadingTable = true
      eventResource.list_option_achievement({ get_all: 1 }).then(res => {
        if (res.error_code === 0) {
          this.achievementList = res?.data?.data || []
          if (this.achievementList.length > 0) {
            this.objectAchievement = this.achievementList.reduce((a, v) => ({ ...a, [v.id]: v }), {})
            console.log('this.achievementList...........', this.achievementList)
            console.log('this.objectAchievement...........', this.objectAchievement)
          }
          console.log('this.tableData___________', this.tableData)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          if (!this.formRequest.achievement_lists.length > 0 || (+this.$store.getters.event_object.is_global === 1 && this.formRequest.achievement_lists.find(item => +item.type === 1 && !item.club_id))) {
            this.$message.error('Bạn chưa nhập đủ thông tin !!!')
            return
          } else {
            this.handleSubmit()
          }
        }
      })
    },
    async handleSubmit() {
      await this.trim_string_object(this.formRequest)
      const list = this.formRequest.achievement_lists
        .filter(item => item.achievement_type)
        .map((item) => (
          {
            achievement_type: item.achievement_type,
            achievement_name: item?.achievement_name ? item?.achievement_name : this.objectAchievement?.[item.achievement_type]?.achievement_name,
            user_id: item.user_id,
            club_id: item.club_id,
            type: item.type
          }
        ))
      const body = { event_id: this.$store.getters.event_id, achievement_lists: list }
      console.log('body....................', body)
      eventResource.store_achievement(body).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        console.log('res.................................', res)
        if (error_code === 0) {
          this.$message.success('Thêm mới thành công')
          this.resetformRequest()
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },

    async resetformRequest() {
      await Promise.resolve(
        this.keyImage = [],
        this.formRequest = {
          achievement_lists: []
        }
      )
      this.$refs['ruleForm'].clearValidate()
    },

    handleClose() {
      this.$store.dispatch('hideDialogAddAchievement')
      this.resetformRequest()
    },
    onSearchGolfer(keyword) {
      const params = { keyword: keyword }
      this.loadingSearchUser = true
      golferResource.searchGolfer(params).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.users = result.map(value => {
              return { value: value.id, label: value.fullname, phone: value.phone || '' }
            })
          } else {
            this.users = []
          }
          this.loadingSearchUser = false
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    onSearchClub(keyword) {
      this.loadingSearchClub = true
      adminClubResource.search({ keyword: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.clubs = result
          } else {
            this.clubs = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchClub = false
      })
    },
    addProductGifts() {
      this.formRequest.achievement_lists.push({ achievement_type: '', achievement_name: '', user_id: '', type: 2, club_id: '' })
    },
    deleteProductGifts(index) {
      console.log('index', index)
      this.formRequest.achievement_lists.splice(index, 1)
    },
    cancelReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    },
    formatNumber,
    trim_string_object
  }
}
</script>

    <style scoped>
    .mb-10 {
      margin-bottom: 10px;
    }
    </style>

