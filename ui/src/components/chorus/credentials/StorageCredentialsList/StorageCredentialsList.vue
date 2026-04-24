<!--
  - Copyright © 2026 Clyso GmbH
  -
  -  Licensed under the GNU Affero General Public License, Version 3.0 (the "License");
  -  you may not use this file except in compliance with the License.
  -  You may obtain a copy of the License at
  -
  -  https://www.gnu.org/licenses/agpl-3.0.html
  -
  -  Unless required by applicable law or agreed to in writing, software
  -  distributed under the License is distributed on an "AS IS" BASIS,
  -  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  -  See the License for the specific language governing permissions and
  -  limitations under the License.
  -->

<script setup lang="ts">
  import {
    CButton,
    CDataTable,
    CIcon,
    type DataTableBaseColumn,
    type DataTableSortState,
  } from '@clyso/clyso-ui-kit';
  import { storeToRefs } from 'pinia';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import i18nCredentials from '../i18nCredentials';
  import type { ChorusCredential } from '@/utils/types/chorus';
  import { useChorusStorageDetailsStore } from '@/stores/chorusStorageDetailsStore';
  import { RouteName } from '@/utils/types/router';
  import { IconName } from '@/utils/types/icon';

  const { t } = useI18n({
    messages: i18nCredentials,
  });

  const {
    isLoading,
    hasError,
    storage,
    computedCredentials,
    page,
    pageSize,
    pagination,
  } = storeToRefs(useChorusStorageDetailsStore());

  const { initStorageDetails } = useChorusStorageDetailsStore();

  const sorter = ref<DataTableSortState | null>(null);

  const columns = computed<DataTableBaseColumn<ChorusCredential>[]>(() => [
    {
      title: t('columnUser'),
      key: 'alias',
      sorter: true,
    },
    {
      title: t('columnAccessKey'),
      key: 'accessKey',
      sorter: true,
    },
    {
      title: t('columnActions'),
      key: 'actions',
    },
  ]);

  const handleSortingChange = (newSorter: DataTableSortState | null) => {
    if (!computedCredentials.value.length) {
      return;
    }

    sorter.value = newSorter;
    page.value = 1;
  };

  const handlePageChange = (newPage: number) => {
    page.value = newPage;
  };

  const handlePageSizeUpdate = (newPageSize: number) => {
    pageSize.value = newPageSize;
    page.value = 1;
  };

  const rowKey = (row: ChorusCredential) => row.alias;
</script>

<template>
  <div class="storage-credentials-list">
    <div class="storage-credentials-list__container">
      <CDataTable
        class="sstorage-credentials-list__table"
        :columns="columns"
        :data="computedCredentials"
        max-height="1020px"
        virtual-scroll
        :is-controlled="true"
        :is-loading="isLoading"
        :has-error="hasError"
        :bordered="false"
        :sorter="sorter"
        :row-key="rowKey"
        :pagination="pagination"
        @update:sorter="handleSortingChange"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeUpdate"
        @retry="initStorageDetails(storage?.name ?? '')"
      >
        <template #alias="{ rowData }">
          {{ rowData.alias }}
        </template>

        <template #accessKey="{ rowData }">
          {{ rowData.accessKey }}
        </template>

        <template #actions="{ rowData }">
          <RouterLink
            v-if="storage"
            :to="{
              name: RouteName.CHORUS_CREDENTIAL_DETAILS,
              params: { storageName: storage.name, alias: rowData.alias },
            }"
          >
            <CButton
              size="small"
              secondary
            >
              <template #icon>
                <CIcon
                  :is-inline="true"
                  :name="IconName.BASE_CREATE"
                />
              </template>
            </CButton>
          </RouterLink>
        </template>
      </CDataTable>
    </div>
  </div>
</template>
