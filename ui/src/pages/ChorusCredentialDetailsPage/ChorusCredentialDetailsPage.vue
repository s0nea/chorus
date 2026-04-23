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
    CBreadcrumb,
    CBreadcrumbItem,
    CDashboardPage,
  } from '@clyso/clyso-ui-kit';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { RouteName } from '@/utils/types/router';
  import i18nAddCredential from '@/components/chorus/add-credential/i18nAddCredential';

  const { t } = useI18n({ messages: i18nAddCredential });

  const props = defineProps<{
    storageName: string;
    alias?: string;
  }>();

  const isEditMode = computed(() => !!props.alias);
</script>

<template>
  <CDashboardPage class="chorus-credential-details-page">
    <template #breadcrumbs>
      <CBreadcrumb>
        <CBreadcrumbItem
          :to="{
            name: RouteName.CHORUS_STORAGE_DETAILS,
            params: { storageName },
          }"
        >
          {{ storageName }}
        </CBreadcrumbItem>
        <CBreadcrumbItem :is-active="true">
          {{
            isEditMode
              ? t('breadcrumbEditCredential')
              : t('breadcrumbAddCredential')
          }}
        </CBreadcrumbItem>
      </CBreadcrumb>
    </template>

    <!-- TODO: CredentialFormTile -->
  </CDashboardPage>
</template>
