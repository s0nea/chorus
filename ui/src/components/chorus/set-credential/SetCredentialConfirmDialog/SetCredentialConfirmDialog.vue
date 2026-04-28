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
  import { storeToRefs } from 'pinia';
  import { CDialog } from '@clyso/clyso-ui-kit';
  import { useI18n } from 'vue-i18n';
  import { h, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import i18nSetCredential from '../i18nSetCredential';
  import { useChorusSetCredentialStore } from '@/stores/chorusSetCredentialStore';
  import { useChorusNotification } from '@/utils/composables/useChorusNotification';
  import { RouteName } from '@/utils/types/router';

  const { isConfirmDialogOpen, storage } = storeToRefs(
    useChorusSetCredentialStore(),
  );
  const { submitCredential } = useChorusSetCredentialStore();
  const { createNotification } = useChorusNotification();

  const { t } = useI18n({
    messages: i18nSetCredential,
  });

  const router = useRouter();

  async function setCredential() {
    try {
      await submitCredential();

      createNotification({
        type: 'success',
        title: t('setCredentialSuccessTitle'),
        content: t('setCredentialSuccessContent'),
        duration: 4000,
      });

      isConfirmDialogOpen.value = false;

      await nextTick();

      router.push({
        name: RouteName.CHORUS_STORAGE_DETAILS,
        params: { storageName: storage.value?.name },
      });
    } catch (error: unknown) {
      createNotification({
        type: 'error',
        title: t('setCredentialErrorTitle'),
        positiveText: t('setCredentialErrorRetry'),
        positiveHandler: () => {
          setCredential();
        },
        content: () =>
          h('div', [
            t('setCredentialErrorContent'),
            h('br'),
            h('br'),
            h(
              'span',
              { style: 'white-space: pre-wrap' },
              error instanceof Error ? error.message : String(error),
            ),
          ]),
      });
    }
  }
</script>

<template>
  <CDialog
    class="set-credential-confirm-dialog"
    type="confirm"
    :width="600"
    :positive-handler="setCredential"
    v-model:is-shown="isConfirmDialogOpen"
  >
    <template #title>
      {{ t('confirmSetCredentialTitle') }}
    </template>

    <p>{{ t('confirmSetCredentialDescription') }}</p>

    <template #positive-text>
      {{ t('confirmSetCredentialPositive') }}
    </template>
    <template #negative-text>
      {{ t('confirmSetCredentialNegative') }}
    </template>
  </CDialog>
</template>
