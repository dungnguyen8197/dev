<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="90%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <h3>Thông tin chung :</h3>
        <el-col :sm="24" :md="11">

          <el-form-item label="Tên sự kiện :" required>
            <el-form-item prop="name">
              <el-input
                v-model="formRequest.name"
                prop="name"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="Tên sự kiện"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Link web:">
            <el-form-item prop="url_web">
              <el-input
                v-model="formRequest.url_web"
                clearable
                filterable
                remote
                reserve-keyword
                prop="url_web"
                placeholder="Link web"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Tên Tournament :">
            <el-form-item prop="event_tournament_id">
              <el-select
                v-model="tournamentModel"
                class="w-100"
                clearable
                filterable
                remote
                reserve-keyword
                prop="event_tournament_id"
                placeholder="Tìm kiếm tournament"
                :remote-method="onSearchTournament"
                :loading="loadingSearchTournament"
              >
                <el-option
                  v-for="tournament in Tournaments"
                  :key="tournament.value"
                  :label="tournament.label"
                  :value="tournament"
                />
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item label="Tên sân :" required>
            <el-form-item prop="facility_id">
              <el-select
                v-model="facilityModel"
                class="w-100"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="Tìm kiếm sân golf"
                :remote-method="onSearchFacility"
                :loading="loadingSearchFacility"
              >
                <el-option
                  v-for="facility in facilities"
                  :key="facility.value"
                  :label="facility.label"
                  :value="facility"
                />
              </el-select>
            </el-form-item>
            <span
              v-if="(+formRequest.is_international === 1) && formRequest.location"
              class="color-red"
            >{{ `(Location: ${formRequest.location})` }}</span>
          </el-form-item>
          <el-row>
            <el-col :sm="24" :md="11">
              <el-form-item label="Chọn đường đi :" required>
                <el-form-item prop="path_id1">
                  <el-select
                    v-model="formRequest.path_id1"
                    :disabled="Object.keys(facilityModel).length === 0"
                    clearable
                    placeholder="Chọn đường đi "
                  >
                    <el-option v-for="item in paths" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="11">
              <el-form-item label="Chọn đường về :" required>
                <el-form-item prop="path_id2">
                  <el-select
                    v-model="formRequest.path_id2"
                    :disabled="Object.keys(facilityModel).length === 0"
                    clearable
                    placeholder="Chọn đường về"
                  >
                    <el-option v-for="item in paths" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Ảnh sự kiện:" required>
            <el-form-item prop="upload">
              <el-upload
                ref="ruleForm"
                :file-list="listImage"
                class="upload-demo"
                action="uploadURL"
                list-type="picture"
                multiple
                :on-change="onPickImage"
                :on-remove="removeFile"
                :on-preview="previewFile"
                :auto-upload="false"
                :limit="1"
                :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
              >
                <el-button type="primary"> Upload poster</el-button>
              </el-upload>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Hiển thị toàn hệ thống:">
            <el-form-item prop="is_public_all">
              <el-select
                v-model="formRequest.is_public_all"
                class="w-100"
              >
                <el-option v-for="(item, key) in objectYesNo" :key="key" :label="item" :value="+key" />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Show App:">
            <el-form-item prop="is_show">
              <el-select
                v-model="formRequest.is_show"
                class="w-100"
              >
                <el-option v-for="(item, key) in objectYesNo" :key="key" :label="item" :value="+key" />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Sự kiện công khai:">
            <el-form-item prop="is_global">
              <el-select
                v-model="formRequest.is_global"
                class="w-100"
                @change="handleGlobalEvent"
              >
                <el-option v-for="(item, key) in objectYesNo" :key="key" :label="item" :value="+key" />
              </el-select>
            </el-form-item>
          </el-form-item>
          <div v-if="is_global_show">
            <el-form-item v-if="!(+formRequest.is_international === 1)" label="Số lượng Golfer tham gia: " required>
              <el-form-item prop="max_member">
                <el-input
                  v-model="formRequest.max_member"
                  placeholder=" Số lượng người tham gia"
                  @keyup.enter.native="onSubmitForm('ruleForm')"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item v-if="!(+formRequest.is_international === 1)" label="Lệ phí: " required>
              <el-form-item prop="fee">
                <el-input
                  v-model="formRequest.fee"
                  placeholder="Lệ phí"
                  @keyup.native="formatPrice"
                  @keyup.enter.native="onSubmitForm('ruleForm')"
                />
              </el-form-item>
            </el-form-item>

            <el-form-item label="Đơn vị tổ chức:" required>
              <el-form-item prop="organization_id">
                <el-select
                  v-model="formRequest.organization_id"
                  placeholder="Chọn đơn vị tổ chức"
                  class="w-100"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  @change="(val) => { delete formRequest.organization_option; handleShowOrganizationChild(val)}"
                >
                  <el-option
                    v-for="(item, key) in getOrganizations"
                    :key="key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <span
                v-if="(+formRequest.is_international === 1) && formRequest.unit_organization"
                class="color-red"
              >{{ `( Đơn vị tổ chức: ${formRequest.unit_organization})` }}</span>
            </el-form-item>

            <el-form-item
              v-if="isShowOrganizationChild && formRequest.organization_id !== 11"
              label="Chọn option đơn vị tổ chức:"
              required
            >
              <el-form-item prop="organization_option">
                <el-select
                  v-model="formRequest.organization_option"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  :remote-method="onSearchOptionOrganizational"
                  placeholder="Chọn option đơn vị tổ chức"
                  class="w-100"
                >
                  <el-option
                    v-for="(item) in organizationChild"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item v-if="formRequest.organization_id === 11" label="Chọn Doanh nghiệp tổ chức:" required>
              <el-form-item prop="club_id">
                <el-select
                  v-model="formRequest.club_id"
                  class="w-100"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="Tìm kiếm Doanh nghiệp"
                  :remote-method="onSearchCompany"
                  :loading="loadingSearchCompany"
                  @change="handle_pick_company"
                >
                  <el-option
                    v-for="company in Companies"
                    :key="company.id"
                    :label="company.name"
                    :value="company.id"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>

            <el-form-item v-if="!(+formRequest.is_international === 1)" label="Đăng ký bảo trợ: " required>
              <el-form-item prop="patronize">
                <el-select
                  v-model="formRequest.patronize"
                  :disabled="(+formRequest.is_international === 1)"
                  filterable
                  placeholder="Chọn đơn vị bảo trợ"
                  class="w-100"
                >
                  <el-option v-for="(item, key) in patronizes" :key="key" :label="item" :value="item" />
                </el-select>

              </el-form-item>
            </el-form-item>
            <el-form-item label="Livescore">
              <el-select
                v-model="formRequest.live_score"
                class="w-100"
                @change="(val) => {if(val === 0) return delete formRequest.url_live_score} "
              >
                <el-option v-for="(item, key) in objectYesNo" :key="key" :label="item" :value="+key" />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="Link livescore">
            <el-form-item prop="url_live_score">
              <el-input
                v-model="formRequest.url_live_score"
                v-loading="uploadFileLoading"
                placeholder="Link lives sự kiện"
                clearable
                filterable
                remote
                reserve-keyword
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item
            v-if="!(+formRequest.is_international === 1)"
            label="Câu lạc bộ/Doanh nghiệp :"
            required
          >
            <el-form-item prop="club_id">
              <el-select
                v-model="formRequest.club_id"
                :disabled="formRequest.is_global === 1"
                class="w-100"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="Tìm kiếm Club/Doanh nghiệp"
                :remote-method="onSearchClub"
                :loading="loadingSearchClub"
                @change="handle_pick_club"
              >
                <el-option v-for="club in clubs" :key="club.id" :label="club.name" :value="club.id" />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Sự kiện HOT:">
            <el-form-item prop="is_hot">
              <el-select
                v-model="formRequest.is_hot"
                class="w-100"
              >
                <el-option v-for="(item, key) in objectYesNo" :key="key" :label="item" :value="+key" />
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="{span:12,offset:1}">
          <el-form-item label="Thời gian bắt đầu :" required>
            <el-form-item prop="tee_time">
              <el-date-picker
                v-model="formRequest.tee_time"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Thời gian bắt đầu"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian kết thúc :" required>
            <el-form-item prop="tee_time_end">
              <el-date-picker
                v-model="formRequest.tee_time_end"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Thời gian kết thúc"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="vID người tạo:" required>
            <el-form-item prop="user_created">
              <el-select
                v-model="formRequest.user_created"
                class="w-100"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="Tìm kiếm mã VID"
                :remote-method="onSearchGolfer"
                :loading="loadingSearchUser"
              >
                <!-- @change="handleAddPhone" -->
                <el-option v-for="user in users" :key="user.value" :label="user.label" :value="user.value" />
              </el-select>
            </el-form-item>
          </el-form-item>
          <!--          <el-form-item v-if="!(+formRequest.is_international === 1)" label="SDT liên hệ:">-->
          <!--            <el-form-item prop="phone_contact">-->
          <!--              <el-input-->
          <!--                v-model="formRequest.phone_contact"-->
          <!--                placeholder="Nhập SDT"-->
          <!--                @keyup.enter.native="onSubmitForm('ruleForm')"-->
          <!--              />-->
          <!--            </el-form-item>-->
          <!--          </el-form-item>-->
          <el-form-item label="Thông tin chi tiết:" required>
            <el-form-item prop="about">
              <el-input
                v-model="formRequest.about"
                type="textarea"
                prop="about"
                placeholder="Thông tin chi tiết"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <template v-if="!(+formRequest.is_international === 1)">
            <el-form-item label="Xin tài trợ cho SK:">
              <el-form-item prop="is_sponsor">
                <el-select
                  v-model="formRequest.is_sponsor"
                  class="w-100"
                  @change="(val) => {if(val === 0) delete formRequest.phone_sponsor}"
                >
                  <el-option v-for="(item, key) in objectYesNo" :key="key" :label="item" :value="+key" />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="SDT của BTC giải đấu:">
              <el-form-item prop="phone_sponsor">
                <el-input
                  v-model="formRequest.phone_sponsor"
                  :disabled="formRequest.is_sponsor === 0"
                  placeholder="Nhập SDT"
                  @keyup.enter.native="onSubmitForm('ruleForm')"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item label="Phê duyệt khi tham gia:">
              <el-form-item prop="is_auto_joined">
                <el-select
                  v-model="formRequest.is_auto_joined"
                  class="w-100"
                >
                  <el-option v-for="(item, key) in objectYesNo" :key="key" :label="item" :value="+key" />
                </el-select>
              </el-form-item>
            </el-form-item>
          </template>
        </el-col>
      </el-row>
      <div v-if="is_global_show">
        <div style="border:1px solid rgb(179, 179, 179); margin:15px" />
        <h3>Điều lệ :</h3>
        <ckeditor v-model="formRequest.rule_event_html" :config="editorConfig" />
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmpty, validateText } from '@/utils/validate'
import { Message } from 'element-ui'
import { baseURL } from '@/constant/config'
import { getAcountInfo } from '@/utils/auth'
import FacilityResource from '@/api/facility/facility'
import AdminClubResource from '@/api/club/admin-club'
import GolferResource from '@/api/golfer/golfer'
import EventResource from '@/api/event'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { formatNumber } from '@/utils/convert'
import Axios from 'axios'
import OrganizationOptionResource from '@/api/event/organizationOption'

const facilityResource = new FacilityResource()
const eventResource = new EventResource()
const adminClubResource = new AdminClubResource()
const organizationOptionResource = new OrganizationOptionResource()

const organizationOption = [{ type: 1, label: 'Hội golf địa phương' }, {
  type: 2,
  label: 'Sân golf có hội viên'
}, { type: 3, label: 'Câu lạc bộ' }]
const objectYesNo = { 1: 'Có', 0: 'Không' }
const typeTour = { 1: 'Đấu CLB', 0: 'Đấu gậy' }
const organizations = ['Cá nhân', 'Doanh nghiệp', 'Hội golf địa phương', 'Sân golf có hội viên', 'Câu lạc bộ', 'Hiệp hội Golf Việt Nam']
const patronizes = ['Hiệp hội golf Việt Nam', 'Hội golf địa phương']
const formulaSummary = ['NET theo handicap', 'System 36', 'Đấu gậy không theo handicap', 'Stable Ford Bruto', 'Đấu đối kháng không theo Handicap', 'Đấu đối kháng theo handicap']
const limitStick = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 'Chỉ bộ sắt']
const limitAge = ['Không giới hạn', 'Dưới 21', 'Trung cao niên']
const listCup = ['Nhất', 'Nhất, Nhì', 'Nhất, Nhì, Ba']
const gender = ['Nam', 'Nữ', 'Nam và nữ']
const arrayYesNo = ['Có', 'Không']
const golferResource = new GolferResource()
export default {
  name: 'DialogAddEvent',
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    organizationData: {
      type: Array,
      default() {
        return []
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
      rules: {
        name: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.name, callback, 'Tên sự kiện'),
            trigger: 'change'
          }
        ],
        facility_id: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.facility_id, callback, 'Sân'),
            trigger: 'change'
          }
        ],
        tee_time: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.tee_time, callback, 'Ngày bắt đầu'),
            trigger: 'change'
          }
        ],
        tee_time_end: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.tee_time_end, callback, 'Ngày kết thúc'),
            trigger: 'change'
          }
        ],
        path_id1: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.path_id1, callback, 'Đường đi'),
            trigger: 'change'
          }
        ],
        path_id2: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.path_id2, callback, 'Đường về'),
            trigger: 'change'
          }
        ],
        club_id: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.is_global === 0 ? this.formRequest.club_id : 'ok', callback, 'CLB'),
            trigger: 'change'
          }
        ],
        user_created: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.user_created, callback, 'Người tạo'),
            trigger: 'change'
          }
        ],
        about: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.about, callback, 'Thông tin giải'),
            trigger: 'change'
          }
        ],
        max_member: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.is_global_show ? this.formRequest.max_member : 'ok', callback, 'Số lượng Golfer'),
            trigger: 'change'
          }
        ],
        fee: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.is_global_show ? this.formRequest.fee : 'ok', callback, 'Lệ phí'),
            trigger: 'change'
          }
        ],
        url_live_score: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.live_score === 1 ? this.formRequest.url_live_score : 'ok', callback, 'Link likescore'),
            trigger: 'change'
          }
        ],
        patronize: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.is_global_show ? this.formRequest.patronize : 'ok', callback, 'Đơn vị bảo trợ'),
            trigger: 'change'
          }
        ],
        organization_id: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.is_global_show ? this.formRequest.organization_id : 'ok', callback, 'Đơn vị tổ chức'),
            trigger: 'change'
          }
        ],
        organization_option: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.is_global_show ? this.formRequest.organization_option : 'ok', callback, 'Chọn option đơn vị tổ chức'),
            trigger: 'change'
          }
        ]
      },
      editorConfig: {
        toolbarGroups: [
          { name: 'document', groups: ['mode', 'document', 'doctools'] },
          { name: 'clipboard', groups: ['clipboard', 'undo'] },
          { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
          { name: 'forms', groups: ['forms'] },
          { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
          { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
          { name: 'links', groups: ['links'] },
          { name: 'insert', groups: ['insert'] },
          { name: 'styles', groups: ['styles'] },
          { name: 'colors', groups: ['colors'] },
          { name: 'tools', groups: ['tools'] },
          { name: 'others', groups: ['others'] },
          { name: 'about', groups: ['about'] }
        ],
        height: 300,
        line_height: '1'
      },
      typeChooseClub: 1,
      Companies: [],
      organizationOption: organizationOption,
      organizations: organizations,
      patronizes: patronizes,
      typeTour: typeTour,
      formulaSummary: formulaSummary,
      limitStick: limitStick,
      limitAge: limitAge,
      listCup: listCup,
      genders: gender,
      arrayYesNo: arrayYesNo,
      objectYesNo: objectYesNo,
      loadingSubmit: false,
      dialogLoading: false,
      loadingSearchFacility: false,
      loadingSearchTournament: false,
      loadingSearchUser: false,
      loadingSearchClub: false,
      is_global_show: false,
      isShowOrganizationChild: false,
      loadingSearchOption: false,
      organizationChild: [],
      formRequest: {
        admin_created_id: getAcountInfo().id,
        cupLongestDriver: 'Không',
        cupHio: 'Không',
        cupNearLine: 'Không',
        cupNearPin: 'Không',
        luckyDraw: 'Không',
        bestGross: 'Không',
        awardParty: 'Không',
        is_global: 0,
        is_sponsor: 0,
        is_club: 1,
        is_auto_joined: 1,
        live_score: 0,
        is_hot: 0,
        is_show: 1,
        is_public: 0,
        is_public_all: 0,
        url_web: '',
        type_club: null
      },
      rounds: [
        {
          roundName: '',
          maxHandicapRounds: null,
          formulaRounds: null,
          genderRounds: null,
          cupRounds: null
        }
      ],
      request: {},
      query: {
        limit: 10,
        page: 1
      },
      listImage: [],
      uploadFileLoading: false,
      listRemoveFile: [],
      round: [],
      facilities: [],
      Tournaments: [],
      users: [],
      clubs: [],
      paths: [],
      facilityModel: {},
      tournamentModel: {},
      file: null,
      dialog: { titleName: 'Thêm mới sự kiện', buttonName: 'Thêm mới' },
      organization: null,
      loadingSearchCompany: false
    }
  },
  computed: {
    pickerExport() {
      if (this.formRequest['tee_time_end']) {
        return {
          disabledDate: (time) => {
            return !moment(time.getTime()).isBetween(moment().subtract(1, 'day'), this.formRequest['tee_time_end'])
          }
        }
      } else {
        return {
          disabledDate: (time) => {
            return time.getTime() < moment().subtract(1, 'day')
          }
        }
      }
    },
    pickerImport() {
      if (this.formRequest['tee_time']) {
        return {
          disabledDate: (time) => {
            return moment(time.getTime()).isBefore(moment(this.formRequest['tee_time']))
          }
        }
      } else {
        return {
          disabledDate: (time) => {
            return time.getTime() < moment().subtract(1, 'day')
          }
        }
      }
    },
    getOrganizations() {
      const arrOrganization = this.organizationData.map(item => {
        return {
          label: item.name,
          value: item.id,
          type: item.type,
          domain_api: item.domain_api,
          type_mapping: item.type_mapping
        }
      })
      return [...arrOrganization]
    }

  },
  watch: {
    facilityModel(value) {
      if (!isEmpty(value)) {
        this.paths = value.path
        this.formRequest.facility_id = value.value
        this.formRequest.facility_display = value.label
      }
    },
    tournamentModel(value) {
      if (!isEmpty(value)) {
        this.formRequest.event_tournament_id = value.value
      } else {
        this.formRequest.event_tournament_id = null
      }
    },
    async objectData(value) {
      console.log('value__111111111', value)
      if (!this.isAdd) {
        const rules = value.rule_event ? JSON.parse(value.rule_event) : {}
        this.formRequest = {
          ...value,
          tee_time: moment(value.tee_time).format('yyyy-MM-DD HH:mm:ss'),
          tee_time_end: moment(value.tee_time_end).format('yyyy-MM-DD HH:mm:ss'),
          cupLongestDriver: rules?.cupLongestDriver ?? null,
          cupHio: rules?.cupHio ?? null,
          cupNearLine: rules?.cupNearLine ?? null,
          cupNearPin: rules?.cupNearPin ?? null,
          luckyDraw: rules?.luckyDraw ?? null,
          bestGross: rules?.bestGross ?? null,
          awardParty: rules?.awardParty ?? null,
          formulaSummary: rules?.formulaSummary ?? null,
          limitStick: rules?.limitStick ?? null,
          limitAge: rules?.limitAge ?? null,
          organization_id: +rules.organization_id || null,
          organization_option: +rules.organization_option || null,
          fee: formatNumber(value?.fee) || null,
          domain: rules?.domain || null,
          type_organizeSelect: rules?.type_organizeSelect || null,
          url_web: value?.url_web ?? null,
          type_club: value?.type_club ?? null
        }
        if (+value.is_global === 1) {
          this.is_global_show = true
        } else {
          this.is_global_show = false
        }
        this.rounds = rules?.rounds || []
        this.clubs = [value.club]
        this.facilities = [value.facility].map(value => {
          return { value: value.id, label: value.sub_title, path: value.paths }
        })
        this.facilityModel = this.facilities[0]
        this.users = [value.user].map(value => {
          const label = `vID${value.id} - ${value.fullname}`
          return { value: value.id, label: label }
        })
        if (value.tournament) {
          this.Tournaments = [value.tournament].map(value => {
            const label = `${value.name}`
            return { value: value.id, label: label }
          })
          console.log('thissssssssssssssssss', this.Tournaments)
          this.tournamentModel = this.Tournaments[0]
        }

        if (rules.organization_id) {
          this.isShowOrganizationChild = true
          if (this.formRequest.organization_option) {
            const dataValue = this.getOrganizations.find(item => +item.value === this.formRequest?.organization_id)
            this.organization = dataValue
            this.formRequest.type_mapping = dataValue.type_mapping
            const checkOption = this.organizationChild.find(item => item.value === this.formRequest.organization_option)
            if (isEmpty(checkOption)) {
              const option = {
                label: rules?.organization,
                value: this.formRequest.organization_option,
                image: rules?.avt_organization || null
              }
              this.organizationChild = [option, ...this.organizationChild]
              console.log('this.organizationChild________', this.organizationChild)
            }
          } else {
            const dataValue = this.formRequest?.organization_id
            await this.handleShowOrganizationChild(dataValue)
          }
        } else {
          this.isShowOrganizationChild = false
        }
        this.listImage = value.img_background ? [{ url: value.img_background }] : []
      } else {
        if (value) {
          this.formRequest = {
            ...this.formRequest,
            ...value
          }
          if (+value.is_global === 1) {
            this.is_global_show = true
          } else {
            this.is_global_show = false
          }
          console.log('this.formRequest.....................', this.formRequest)
        }
      }
    },
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới sự kiện', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật sự kiện', buttonName: 'Cập nhật' })
      }
    }
  },

  methods: {
    handle_pick_club(value) {
      const data = this.clubs.find(item => item.id === value)
      console.log('ewqeqweqweqweqwe', data)
      if (data.type_club === 4) {
        this.formRequest.type_club = 4
      } else {
        this.formRequest.type_club = data.type_club
      }
    },
    handle_pick_company(value) {
      console.log('tessssssssssssss', value)
      console.log('tessssssssssssss', this.Companies)

      const data = this.Companies.find(item => item.id === value)
      console.log('ưqewqewwwwwwwwwwwwwwwww', data)

      if (data.type_club === 4) {
        this.formRequest.type_club = 4
      } else {
        this.formRequest.type_club = data.type_club
      }
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          if (moment(this.formRequest.tee_time).isAfter(moment(this.formRequest.tee_time_end))) {
            this.$message.warning('Thời gian bắt đầu không được lớn hơn thời gian kết thúc .')
            return
          }
          this.loadingSubmit = true
          const formBody = await this.appendForm()
          if (this.isAdd) {
            await this.handleSubmitAdd(formBody)
          } else {
            await this.handleSubmitUpdate(formBody)
          }
        }
      })
    },
    handleInputConfirm() {
      const round = {
        roundName: '',
        maxHandicapRounds: null,
        formulaRounds: null,
        genderRounds: null,
        cupRounds: null
      }
      this.rounds.push(round)
      console.log('handleInputConfirm_________________', this.rounds)
    },
    async handleSubmitAdd(formBody) {
      eventResource.store(formBody).then(async res => {
        if (res.error_code === 0) {
          if ((+this.formRequest.is_international === 1)) {
            await eventResource.update_status_event_draf({ status: 1 }, this.formRequest.eventDrafID).then(response => {
              console.log('update_status_event_draf..................', response)
            })
          }
          this.$message.success(res.error_msg)
          this.$emit('onCloseDialog', { dialog: false, reload: true })
          this.resetformRequest()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    onSearchCompany(keyword) {
      this.loadingSearchCompany = true
      eventResource.searchCompany({ keyword_company: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.paths = []
            this.Companies = result
          } else {
            this.Companies = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchCompany = false
      })
    },
    async handleSubmitUpdate(formBody) {
      console.log('qqqqqqqqqqqqqqqqqqq', formBody)
      eventResource.update(formBody, formBody.id).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.$emit('onCloseDialog', { dialog: false, reload: true })
          this.resetformRequest()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    onSearchGolfer(keyword) {
      golferResource.searchGolfer({ keyword: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.users = result.map(value => {
              const label = `vID${value.id} - ${value.fullname}`
              return { value: value.id, label: label, phone: value.phone }
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
    async resetformRequest() {
      await Promise.resolve(
        (
          this.formRequest = {
            admin_created_id: getAcountInfo().id,
            cupLongestDriver: 'Không',
            cupHio: 'Không',
            cupNearLine: 'Không',
            cupNearPin: 'Không',
            luckyDraw: 'Không',
            bestGross: 'Không',
            awardParty: 'Không',
            is_global: 0,
            is_sponsor: 0,
            is_auto_joined: 1,
            live_score: 0,
            is_hot: 0,
            is_show: 1,
            is_public: 0,
            is_public_all: 0,
            url_web: '',
            type_club: null
          },
          this.rounds = [
            {
              roundName: '',
              maxHandicapRounds: null,
              formulaRounds: null,
              genderRounds: null,
              cupRounds: null
            }
          ],
          this.listImage = [],
          this.users = [],
          this.facilities = [],
          this.facilityModel = {},
          this.tournamentModel = {},
          this.clubs = [],
          this.organizationChild = [],
          this.is_global_show = false
        )
      )
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetformRequest()
    },
    async onPickImage(value, array) {
      console.log('value___________', value)

      if (value?.raw?.type !== 'image/png' && value?.raw?.type !== 'image/jpg' && value?.raw?.type !== 'image/jpeg' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng ảnh là JPG, JPEG, PNG`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else if (value.size > 4 * 1000 * 1000) {
        Message({
          message: `Kích thước ảnh tối đa là 4 MB, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} B`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else {
        this.file = value.raw
      }
    },
    removeFile(value) {
      delete this.formRequest.img_background
      this.file = null
    },
    previewFile(value) {
      if (!this.isAdd) {
        window.open(baseURL + value.url, '_blank')
      } else {
        window.open(value.url, '_blank')
      }
    },
    handleExceed(files, fileList, length) {
      Message({
        message: `Tối đa là ${length} file, bạn đang chọn ${files.length + fileList.length} file`,
        type: 'warning',
        duration: 5 * 1000
      })
    },
    onSearchFacility(keyword) {
      this.loadingSearchFacility = true
      facilityResource.listFacility({ title: keyword, cms_event: 'event' }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.paths = []
            this.facilities = result.map(value => {
              return { value: value.id, label: value.sub_title, booking: value.booking, path: value.paths }
            })
          } else {
            this.facilities = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchFacility = false
      })
    },
    onSearchTournament(keyword) {
      this.loadingSearchTournament = true
      eventResource.searchTournament({ keyword_tournament: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.paths = []
            this.Tournaments = result.map(value => {
              return { value: value.id, label: value.name }
            })
          } else {
            this.Tournaments = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchTournament = false
      })
    },
    async uploadFileToServe(file) {
      const myNewFile = new File([file], `${uuidv4().toString()}.png`, { type: file.type })
      const url = 'https://api-v2.vcallid.com/api/utils/upload/data'
      const formData = new FormData()
      formData.append('image', myNewFile)
      const res = await Axios.post(url, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
      return res
    },
    // handleAddPhone(val) {
    //   const user = this.users.find(user => +user.value === +val)
    //   if (!isEmpty(user)) {
    //     this.formRequest.phone_contact = user?.phone || ''
    //   } else {
    //     delete this.formRequest.phone_contact
    //   }
    // },
    async validateRound() {
      let message = null
      if (this.rounds.length < 1) {
        return 'Thông tin bảng không được bỏ trống.'
      }
      for (let i = 0; i < this.rounds.length; i++) {
        const round = this.rounds[i]
        for (const key in round) {
          if (isEmpty(round[key])) {
            message = 'Thông tin bảng đang có trường bị bỏ trống.'
            break
          }
        }
        if (message) {
          break
        }
      }
      return message
    },
    async appendForm() {
      const formData = this.formRequest
      console.log('qweqweqweqwewqeqwe', formData)
      console.log('eweqwe', this.Companies)
      for (const key in formData) {
        if (formData[key] === null || formData[key] === undefined || formData[key] === '') {
          delete formData[key]
        }
      }
      if (this.file != null && isEmpty(formData.img_background)) {
        const fileUpload = await this.uploadFileToServe(this.file)
        if (fileUpload) {
          formData.img_background = fileUpload.data.name
        }
      }
      if (this.formRequest.organization_id === 11 && this.Companies.length > 0) {
        const dataCompany = this.Companies.find(item => item.id === this.formRequest.club_id)
        console.log('ưeqwewqeqweqwewqeqwewqe', dataCompany)
        formData.organization = dataCompany.name
      }
      if (this.formRequest.organization_id === 11 && this.Companies.length === 0) {
        formData.organization = this.objectData.club.name
      }
      if (this.formRequest.organization_option) {
        const dataOption = this.organizationChild.find(item => item.value === this.formRequest.organization_option)
        formData.organization = dataOption.label
        formData.avt_organization = dataOption.image
      }
      if (this.formRequest.fee) {
        formData.fee = this.formRequest.fee.toString().replaceAll('.', '')
      }
      formData.rounds = this.rounds
      if (isEmpty(this.formRequest.url_web)) {
        formData.url_web = null
      }
      if (isEmpty(this.formRequest.url_live_score)) {
        formData.url_live_score = null
      }
      if (isEmpty(this.formRequest.event_tournament_id)) {
        formData.event_tournament_id = null
      }
      return formData
    },
    handleCloseTag(round) {
      this.rounds.splice(this.rounds.indexOf(round), 1)
    },
    handleGlobalEvent(val) {
      const removeForm = ['fee', 'patronize', 'organization', 'url_live_score', 'total_joined', 'limitStick', 'limitAge', 'formulaSummary']
      const updateForm = ['cupLongestDriver', 'cupHio', 'cupNearLine', 'cupNearPin', 'luckyDraw', 'bestGross', 'awardParty', 'is_show', 'live_score']
      if (+val === 1) {
        this.is_global_show = true
        delete this.formRequest.club_id
      } else {
        this.is_global_show = false

        removeForm.forEach(r => {
          delete this.formRequest[r]
        })
        updateForm.forEach(u => {
          this.formRequest[u] = 'Không'
        })
        this.rounds = [
          {
            roundName: '',
            maxHandicapRounds: null,
            formulaRounds: null,
            genderRounds: null,
            cupRounds: null
          }
        ]
      }
    },
    async handleShowOrganizationChild(val) {
      const data = this.getOrganizations.find(item => +item.value === +val)
      this.organizationChild = []
      this.organization = data
      this.formRequest.type_mapping = data.type_mapping
      console.log('data_________________', data)
      if (data && +data.type === 2) {
        await this.getOptionsOrganizationalDefault(data.domain_api)
      } else if (data && +data.type === 1) {
        this.formRequest.organization = data.label
        await this.getOptionsOrganizational(data.value)
      } else if (data && +data.type === 3) {
        this.formRequest.organization = data.label
        this.formRequest.type_organizeSelect = data.type
        this.formRequest.domain = data.domain_api
        this.isShowOrganizationChild = false
      } else if (data && +data.type === 4 && this.objectData.club_id !== 1152) {
        this.formRequest.organization = data.label
        this.formRequest.type_club = data.type
        this.isShowOrganizationChild = false
      } else {
        this.isShowOrganizationChild = false
        delete this.formRequest.organization_option
        this.organizationChild = []
      }
    },

    async getOptionsOrganizationalDefault(url) {
      if (!url) {
        this.isShowOrganizationChild = false
        return
      }
      const new_url = url.replace('uid=85412&token=cafed6ff5850a554fd057db05a859ebd', 'uid=888888888&token=ef552e36df9366e6609b463c69cfdebb')
      Axios({
        url: new_url,
        method: 'GET'
      }).then(res => {
        console.log('res__________', res)
        if (res.data.error_code === 0) {
          this.isShowOrganizationChild = true
          const data = res?.data?.data?.clubs || res?.data?.data
          this.organizationChild = data?.map(item => {
            return {
              label: item.name || item.id,
              value: item.id_map_club || item.id,
              image: item?.img_url || item?.logo_url_path
            }
          })
        }
      })
    },
    onSearchOptionOrganizational(keyword) {
      console.log('this.organization____________', this.organization)
      if (this.organization?.type === 2) {
        const url = new URL(this.organization?.domain_api.replace('uid=85412&token=cafed6ff5850a554fd057db05a859ebd', 'uid=888888888&token=ef552e36df9366e6609b463c69cfdebb'))
        const searchParams = new URLSearchParams(url.search)
        searchParams.set('q', keyword)
        url.search = searchParams.toString()
        Axios({
          url: url.href,
          method: 'GET'
        }).then(res => {
          if (res.data.error_code === 0) {
            const data = res?.data?.data?.clubs || res?.data?.data
            this.organizationChild = data?.map(item => {
              return {
                label: item.name || item.id,
                value: item.id_map_club || item.id,
                image: item?.img_url || item?.logo_url_path
              }
            })
          }
        })
      } else {
        const query = {
          page: 1,
          limit: 30,
          organization_id: this.organization.value,
          keyword
        }
        organizationOptionResource.lists(query).then(res => {
          if (res.error_code === 0) {
            this.organizationChild = res?.data?.data.map(item => {
              return { label: item.name, value: item.id, image: item.image }
            })
          }
        })
      }
    },
    async getOptionsOrganizational(val) {
      const query = {
        page: 1,
        limit: 30,
        organization_id: val
      }
      organizationOptionResource.lists(query).then(res => {
        if (res.error_code === 0) {
          this.organizationChild = res?.data?.data.map(item => {
            return { label: item.name, value: item.id, image: item.image }
          })
          if (res?.data?.total > 0) {
            this.isShowOrganizationChild = true
          } else {
            this.isShowOrganizationChild = false
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    formatPrice(val) {
      console.log('val................', this.formRequest.fee)
      if (val) {
        this.formRequest.fee = this.formRequest.fee.replace(/[^0-9]/g, '')
      }

      if (this.formRequest.fee) {
        this.formRequest.fee = formatNumber(this.formRequest.fee)
      }
      console.log('this.formRequest.fee................', this.formRequest.fee)
    },
    formatNumber
  }
}
</script>

<style scoped>
.w-100 {
  width: 100%;
}

.mr-10 {
  margin-right: 10px;
}

.color-red {
  color: red;
}
</style>
