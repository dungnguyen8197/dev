<template>
  <div>
    <CRow>
      <CCol>
        <h3>組織一覧</h3>
      </CCol>
      <CCol class="text-right" md="4" sm="6">
        <CForm @submit.prevent="searchOrganization">
          <CInput placeholder="Search" v-model="searchKeyword"/>
        </CForm>
      </CCol>
    </CRow>
    <CCard>
      <CCardBody>
        <CDataTable
          hover
          items-per-page-select
          :items="results.list"
          :fields="fields"
          :items-per-page="pagination.itemPerPage"
          :itemsPerPageSelect ="pagination.itemsPerPageSelect"
          @pagination-change="onUpdatePerPage"
        >
          <template #action="{item}">
            <td class="py-2 text-right">
              <CButton
                color="info"
                size="sm"
                @click="$router.push({
                  name: 'organizations-organization_id-edit',
                  params: { organization_id: item.id }
                })"
              >
                Edit
              </CButton>
              <CButton
                color="danger"
                size="sm"
                @click="showDeleteModal(item.id)"
              >
                Delete
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
    <CPagination
      :activePage.sync="pagination.pageActive"
      :pages="numberPage"
      align="end"
      @update:activePage="getOrganizations"
    />
    <BaseModal
      v-bind="modal"
      @update:hide="hideDeleteModal"
      @update:confirm="deleteOrganization(deleteId)"
    >
    </BaseModal>
    <BaseToaster
      :fixedToasts="fixedToasts"
      color="success"
    >
      削除しました
    </BaseToaster>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseToaster from '~/components/BaseToaster.vue';
import BaseModal from '~/components/BaseModal.vue';
import { OrganizationListRO } from '~/interfaces/organization.interface';
import { ItemsPerPageSelect, PaginationInterface } from '~/interfaces/pagination.interface';
import { deleteOrganizationById, getOrganizationList } from '~/api/organization';

const fields = [
  { key: 'id', _style:'width:1%', label : 'id', sorter: false, filter: false },
  { key: 'type_name', _style:'min-width:30px', label : '種別', sorter: false, filter: false },
  { key: 'division_type_name', _style:'min-width:10px;', label : '区分', sorter: false, filter: false },
  { key: 'name', _style:'min-width:10px;', label : '組織名', sorter: false, filter: false },
  { key: 'created_at', _style:'min-width:10px;', label : '作成日時', sorter: false, filter: false },
  { key: 'action', _style:'min-width:10px;', label : '', sorter: false, filter: false },
];

const results: OrganizationListRO = {
  total: 0,
  list : []
}

const itemsPerPageSelect: ItemsPerPageSelect = {
  label: '表示件数：',
  values: [5, 10, 20, 50]
}

const pagination: PaginationInterface = {
  pageActive: 1,
  itemPerPage: 10,
  offsetDefault: 0,
  collapseDuration: 0,
  itemsPerPageSelect : itemsPerPageSelect,
}

const modal = {
  title: 'データを削除しますか？',
  color: 'warning',
  message: 'この操作は取り消せません',
  isShow: false,
}

export default Vue.extend({
  components: {
    BaseToaster,
    BaseModal,
  },
  data() {
    return {
      results,
      fields,
      pagination,
      modal,
      deleteId: null as number | null,
      fixedToasts: 0,
      searchKeyword: '',
    }
  },
  head() {
    return {
      title: '組織一覧',
    }
  },
  computed: {
    numberPage(): number {
      return Math.ceil(this.results.total / this.pagination.itemPerPage);
    }
  },
  async mounted(): Promise<void> {
    await this.getOrganizations();
  },
  methods: {
    async getOrganizations(): Promise<void> {
      try {
        this.results = await getOrganizationList({
          limit: this.pagination.itemPerPage,
          offset: (this.pagination.pageActive - 1) * this.pagination.itemPerPage,
          name: this.searchKeyword,
        });
      } catch (err) {}
    },
    async onUpdatePerPage(itemPerPage: number): Promise<void> {
      this.pagination.pageActive = 1;
      this.pagination.itemPerPage = itemPerPage;
      await this.getOrganizations();
    },
    async searchOrganization(): Promise<void> {
      this.pagination.pageActive = 1;
      await this.getOrganizations();
    },
    showDeleteModal(id: number) {
      this.modal.isShow = true;
      this.deleteId = id;
    },
    hideDeleteModal() {
      this.modal.isShow = false;
    },
    async deleteOrganization(id: number | null): Promise<void> {
      if (!id) return ;
      try {
        await deleteOrganizationById(id);
        await this.getOrganizations();
        this.fixedToasts++;
        this.deleteId = null;
      } catch (err) {}
    }
  }
});
</script>
