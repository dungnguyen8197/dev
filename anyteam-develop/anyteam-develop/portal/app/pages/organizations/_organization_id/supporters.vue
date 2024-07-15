<template>
  <div>
    <Header title="運動高校支援者一覧" />
    <div class="flex justify-between align-items-center">
      <MonthSelect />
      <Button>
        <span class="mr-1 icon icon-download icon-white icon-xl"></span>
        CSVダウンロード
      </Button>
    </div>
    <Statistics
      v-bind:profit="6242190"
      v-bind:supporters="1190"
    />
    <Table>
      <thead>
        <tr>
          <th width="80%">支援者名</th>
          <th width="10%">支援方法</th>
          <th width="10%">支援金額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="supporter in 20" v-bind:key="supporter">
          <td>
            <SupporterInfo
              v-bind:name="'上福元光太郎'"
              v-bind:region="'東京'"
              v-bind:description="'30代'"
              v-bind:image="'/user-avatar.png'"
            />
          </td>
          <td>通常</td>
          <td>201,000円</td>
        </tr>
      </tbody>
    </Table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from "~/components/Header.vue";
import Button from "~/components/common/Button.vue";
import MonthSelect from "~/components/support/MonthSelect.vue";
import Statistics from "~/components/support/Statistics.vue";
import Table from "~/components/common/Table.vue";
import SupporterInfo from "~/components/support/SupporterInfo.vue";

export default Vue.extend({
  components: {SupporterInfo, Table, Statistics, MonthSelect, Button, Header},
})
</script>
