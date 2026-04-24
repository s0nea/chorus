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
    CAutoComplete,
    CButton,
    CIcon,
    CTile,
    GeneralHelper,
  } from '@clyso/clyso-ui-kit';
  import { storeToRefs } from 'pinia';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import i18nCredentials from '../i18nCredentials';
  import StorageCredentialsList from '../StorageCredentialsList/StorageCredentialsList.vue';
  import { useChorusStorageDetailsStore } from '@/stores/chorusStorageDetailsStore';
  import { RouteName } from '@/utils/types/router';
  import { IconName } from '@/utils/types/icon';

  const { t } = useI18n({
    messages: i18nCredentials,
  });

  const { isLoading, storage, filterAlias } = storeToRefs(
    useChorusStorageDetailsStore(),
  );

  const searchString = ref('');

  const aliasOptions = computed<string[]>(() => {
    const credentials = storage.value?.credentials ?? [];
    const query = searchString.value.trim().toLowerCase();

    return credentials
      .map((c) => c.alias)
      .filter((alias) => alias.toLowerCase().includes(query))
      .sort();
  });

  const handleSearchUpdate = GeneralHelper.debounce(() => {
    filterAlias.value = searchString.value;
  }, 1000);
</script>

<template>
  <CTile
    :is-loading="isLoading"
    class="storage-credentials"
  >
    <template #title>
      {{ t('credentialsTitle') }}
    </template>

    <div class="storage-credentials__toolbar">
      <CAutoComplete
        v-model:value="searchString"
        class="storage-credentials__search"
        :input-props="{
          autocomplete: 'disabled',
        }"
        :options="aliasOptions"
        :placeholder="t('searchPlaceholder')"
        clearable
        blur-after-select
        @update:value="handleSearchUpdate"
      />

      <RouterLink
        v-if="storage"
        :to="{
          name: RouteName.CHORUS_CREDENTIAL_DETAILS,
          params: { storageName: storage.name },
        }"
      >
        <CButton
          type="primary"
          size="medium"
          ghost
          tag="div"
        >
          <template #icon>
            <CIcon
              :is-inline="true"
              :name="IconName.BASE_ADD"
            />
          </template>

          {{ t('addCredential') }}
        </CButton>
      </RouterLink>
    </div>

    <StorageCredentialsList />
  </CTile>
</template>

<style lang="scss" scoped>
  @use '@/styles/utils' as utils;

  .storage-credentials {
    &__toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: utils.unit(3);
      margin-bottom: utils.unit(4);
    }

    &__search {
      max-width: 300px;
    }
  }
</style>
