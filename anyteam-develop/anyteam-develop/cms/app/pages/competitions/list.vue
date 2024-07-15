<template>
  <div>
    <CRow>
      <CCol sm="6"><h3>競技一覧</h3></CCol>
      <CCol sm="6">
        <CInput
          name="search"
          placeholder="Search"
          v-model:value="search"
          class="mr-3 w-100"
          @change="searchForm"
        />
      </CCol>
    </CRow>
    <CCardBody>
      <CDataTable
        hover
        items-per-page-select
        :items="results.list"
        :fields="fields"
        :items-per-page="pagination.itemPerPage"
        :itemsPerPageSelect="pagination.itemsPerPageSelect"
        @pagination-change="paginationChange"
      >
        <template #date="{ item }">
          <td>{{ item.created_at }}</td>
        </template>
        <template #buttons="{ item, index }">
          <td class="py-2 text-right">
            <CButton
              color="info"
              square
              size="sm"
              @click="
                $router.push({
                  path: '/competitions/' + item.id + '/edit',
                })
              "
            >
              Edit
            </CButton>
            <CButton
              color="danger"
              square
              size="sm"
              @click="showConfirmDeleteModal(item.id)"
            >
              Delete
            </CButton>
          </td>
        </template>
      </CDataTable>
      <CPagination
        align="end"
        v-if="results.list.length > 0"
        :activePage="pagination.pageActive"
        :pages="numberPage"
        @update:activePage="activePage"
      />
    </CCardBody>
    <CModal title="削除確認" centered :show.sync="isShowConfirmDeleteModal">
      <div class="text-center">本当に削除しますか ？</div>
      <template #footer>
        <CButton color="secondary" @click="confirmDelete(false)">
          いいえ
        </CButton>
        <CButton color="primary" @click="confirmDelete(true)"> はい </CButton>
      </template>
    </CModal>
    <BaseToaster :fixedToasts="errorToasts" color="danger">
      {{ errorMessage }}
    </BaseToaster>
    <BaseToaster :fixedToasts="deleteSuccessToasts" color="success">
      削除しました
    </BaseToaster>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { deleteCompetitionById, getCompetitionList } from "~/api/competitions";
import { CompetitionListInterface } from "../../interfaces/competitions.interface";
import {
  PaginationInterface,
  ItemsPerPageSelect,
} from "../../interfaces/pagination.interface";
import BaseToaster from "../../components/BaseToaster.vue";

const fields = [
  { key: "id", _style: "width:1%", label: "Id", sorter: true, filter: true },
  {
    key: "name",
    _style: "min-width:200px",
    label: "競技名",
    sorter: true,
    filter: true,
  },
  {
    key: "date",
    _style: "min-width:100px;",
    label: "作成日時",
    sorter: true,
    filter: false,
  },
  {
    key: "buttons",
    label: "",
    _style: "width:150px",
    sorter: false,
    filter: false,
  },
];

let results: CompetitionListInterface = {
  count: 0,
  offset: 0,
  list: [],
};

let itemsPerPageSelect: ItemsPerPageSelect = {
  label: "表示件数:",
  values: [5, 10, 20, 50],
};

let pagination: PaginationInterface = {
  pageActive: 1,
  itemPerPage: 10,
  offsetDefault: 0,
  collapseDuration: 0,
  itemsPerPageSelect: itemsPerPageSelect,
};

export default Vue.extend({
  name: "CompetitionsList",
  components: { BaseToaster },
  data() {
    return {
      results,
      fields,
      pagination,
      isShowConfirmDeleteModal: false,
      deleteCompetitionID: 0,
      offset: pagination.offsetDefault,
      search: "",
      deleteSuccessToasts: 0,
      errorToasts: 0,
      errorMessage: "",
    };
  },
  head() {
    return {
      title: '競技一覧',
    }
  },
  mounted() {
    this.getList();
  },
  computed: {
    numberPage(): number {
      return Math.ceil(this.results.count / this.pagination.itemPerPage);
    },
  },
  methods: {
    async getList(goFirstPage: boolean = false): Promise<void> {
      if (goFirstPage) {
        this.pagination.pageActive = 1;
      }
      this.results = await getCompetitionList({
        search: this.search,
        offset: (this.pagination.pageActive - 1) * this.pagination.itemPerPage,
        limit: this.pagination.itemPerPage,
      });
    },
    activePage(pageActive: number) {
      this.pagination.pageActive = pageActive;
      this.getList();
    },
    paginationChange(itemPerPage: number) {
      this.pagination.itemPerPage = itemPerPage;
      this.getList(true);
    },
    showConfirmDeleteModal(competitionID: number) {
      this.deleteCompetitionID = competitionID;
      this.isShowConfirmDeleteModal = true;
    },
    async confirmDelete(confirm: boolean) {
      this.isShowConfirmDeleteModal = false;
      if (confirm && this.deleteCompetitionID) {
        try {
          await deleteCompetitionById(this.deleteCompetitionID);
          this.getList(true);
          this.deleteSuccessToasts++;
        } catch (error: any) {
          if (error.status == 403) {
            this.errorMessage = "この競技が使用しているため、削除できません。";
            this.errorToasts++;
          }
        }
      }
    },
    async searchForm() {
      await this.getList(true);
    },
  },
});
</script>

<style scoped>
.card-body {
  background: white;
}
</style>
