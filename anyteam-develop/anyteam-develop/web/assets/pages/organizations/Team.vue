<template>
  <div>
    <div class="sp-only">
      <ul>
        <li>ANYTEAMとは？</li>
        <li>支援の流れ</li>
      </ul>
    </div>
    <PageHeader
      background="/public/images/organizations/img-header-team.png"
      :title="team.organization_name"
    >
      <template v-slot:icons>
        <PageHeaderIcon
          :region="team.region_name"
          :type="team.division_type_name"
          :supporter-count="team.supporter_count"
        ></PageHeaderIcon>
      </template>
    </PageHeader>
    <BreadcrumbMenu :paths="breadcrumbs" />
    <div class="section-container team__container">
      <div class="team__main">
        <div class="mb-30 mt-24">
          <Alert>
            {{ team.organization_name }}{{ team.name }}へのご支援を受け付けています。
            ご支援金は運動部のための施設費、運営費、遠征費などの資金として利用されます。皆様のご支援よろしくお願いいたします。
          </Alert>
        </div>
        <div class="section mb-30">
          <h3 class="section__title">支援者一覧</h3>
          <div>
            <div v-if="checkLogin" class="organization__supporters">
              <TeamActivitySupporters
                :supporters="supporters"
                :supporters-url="`/organizations/${team.organization_id}/teams/${team.id}/supporters`"
              />
            </div>
            <Alert v-else>
              部活を支援すると、{{ team.organization_name }}の支援者一覧を見ることができます。閲覧するにはログインが必要です。
            </Alert>
          </div>
        </div>
        <div class="section mb-30">
          <div class="flex items-center justify-between">
            <h3 class="section__title">{{ team.organization_name }}の部活一覧</h3>
            <a :href="`/organizations/${team.organization_id}`" class="pc-tablet-only text-sm team__link">
              {{ team.organization_name}}のページを見る
            </a>
          </div>
          <div>
            <ActivityList
              :activities="listOrganizationTeams"
              :organization-name="team.organization_name"
              :organization-id="team.organization_id"
              :checkLogin="checkLogin"
              :supporter-count="team.supporter_count"
            />
          </div>
          <div class="sp-only mt-24 text-center">
            <a :href="`/organizations/${team.organization_id}`" class="text-base text-center team__link">
              {{ team.organization_name}}のページを見る
            </a>
          </div>
        </div>
      </div>
      <div class="team__sub">
        <div class="team__support-action">
          <div class="team__support-text">
            <div>支援者</div>
            <div>{{ supportCount }}人</div>
          </div>
          <a :href="`/support?team_id=${team.id}`">
            <button class="btn btn-secondary btn-wide team__support-btn">支援する</button>
          </a>
        </div>
        <div class="pc-tablet-only team__sns">
          <div>
            <p class="text-base">部活ページをSNSでシェアしましょう！</p>
            <div  class="flex justify-center items-center">
              <a class="team__sns-link" href="#">
                <img class="team__sns-image" src="/public/images/sns/facebook.png" alt="Facebook" />
              </a>
              <a class="team__sns-link" href="#">
                <img class="team__sns-image" src="/public/images/sns/twitter.png" alt="Twitter" />
              </a>
              <a class="team__sns-link" href="#">
                <img class="team__sns-image" src="/public/images/sns/url.png" alt="URL" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { inject, defineComponent } from '@vue/runtime-core';
import PageHeader from "../../components/common/page/PageHeader.vue";
import RankingGroups from "../../components/common/organizations/RankingGroups.vue";
import SupportMethods from "../../components/common/organizations/SupportMethods.vue";
import ShareTeamPage from "../../components/common/organizations/ShareTeamPage.vue";
import TeamActivitySupporters from "../../components/common/organizations/TeamActivitySupporters.vue";
import Footer from '../../components/Footer.vue';
import ActivityList from '../../components/common/organizations/ActivityList.vue';
import BreadcrumbMenu from '../../components/breadcrumb/BreadcrumbMenu.vue';
import PageHeaderIcon from './PageHeaderIcon.vue';
import Alert from '../../components/alerts/Alert.vue';
import { TeamDetailResponse, OrganizationTeamListResponse } from '../../types/organization/team';
import { Supporter } from '../../types/support/supporter';
import { formatAmount } from '../../helpers/amount';

export default defineComponent({
  components: { 
    PageHeader,
    RankingGroups,
    SupportMethods,
    ShareTeamPage,
    TeamActivitySupporters,
    Footer,
    ActivityList,
    BreadcrumbMenu,
    PageHeaderIcon,
    Alert,
  },
  setup() {
    const supporters: Supporter[] = [
      {
        id: 1,
        icon: "",
        name: "遠藤啓太",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 10797000,
      },
      {
        id: 2,
        icon: "",
        name: "遠藤啓太",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
      {
        id: 3,
        icon: "",
        name: "長い名前の場合は改行を入れて対応します長い名前の場合",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
      {
        id: 4,
        icon: "",
        name: "遠藤啓太",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
      {
        id: 5,
        icon: "",
        name: "長い名前の場合は改行を入れて対応します長い名前の場合",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
    ];

    const $appData = inject('$appData') as {
      checkLogin: boolean,
      listOrganizationTeams: OrganizationTeamListResponse,
      teamDetail: TeamDetailResponse,
    };
    const checkLogin = $appData.checkLogin;
    const listOrganizationTeams = $appData.listOrganizationTeams.list;
    const team = $appData.teamDetail;
    const supportCount = formatAmount(team.supporter_count);
    const breadcrumbs = [
      {
        url: '/',
        text: 'トップ',
      },
      {
        url: '/organizations/' + team.organization_id,
        text: team.organization_name,
      },
      {
        url: '',
        text: team.name,
      },
    ];
    return {
      supporters,
      breadcrumbs,
      team,
      listOrganizationTeams,
      checkLogin,
      supportCount,
    };
  },
});
</script>

<style lang="scss" scoped>
ul {
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--light-color);
  border-bottom: 0;
  overflow: hidden;
  margin-top: 10px;
  padding-left: 0;
  >li {
    list-style: none;
    width: 50%;
    color: black;
    font-size: 12px;
    padding: 2px 15px;
    text-align: center;
    font-size: 12px;
    padding: 10px;
    border-left: 1px solid var(--light-color);
  }
}
h3 {
  font-size: 20px;
}
.team {
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__link {
    color: var(--secondary-color);
    text-decoration-color: var(--secondary-color);
  }
  &__support {
    &-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 10px;
      a {
        width: 240px;
      }
    }
    &-text {
      text-align: center;
      font-size: 1.4rem;
      margin-right: 12px;
      min-width: 7rem;
    }
    &-btn {
      width: 100%;
    }
  }
  &__sns {
    background-color: var(--light-color);
    border-radius: 4px;
    padding: 6px 12px;
    margin-top: 18px;
    &-link {
      margin-right: 8px;
      margin-left: 8px;
    }
    &-image {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
  @media screen and (min-width: 768px) {
    &__container {
      flex-direction: row;
      justify-content: space-between;
    }
    &__main {
      flex-grow: 0;
      flex-shrink: 0;
      flex-basis: 76%;
      max-width: 520px;
    }
    &__sub {
      flex-grow: 0;
      flex-shrink: 0;
      flex-basis: calc(24% - 20px);
      margin-left: 20px;
    }
    &__support {
      &-action {
        border: 1px solid #E3E3E3;
        border-radius: 4px;
        display: block;
      }
      &-text {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        margin-right: 0;
      }
    }
  }
  @media screen and (min-width: 992px) {
    &__main {
      max-width: 720px;
    }
  }
}
</style>
