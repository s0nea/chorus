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
  import { CButton, CIcon, CRadio, useDialog } from '@clyso/clyso-ui-kit';
  import { storeToRefs } from 'pinia';
  import { computed, h, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import i18nDiffReportDetail from '@/components/chorus/diff-report-detail/i18nDiffReportDetail';
  import { useChorusDiffReportDetailStore } from '@/stores/chorusDiffReportDetailStore';
  import { useChorusNotification } from '@/utils/composables/useChorusNotification';
  import { IconName } from '@/utils/types/icon';

  const detailStore = useChorusDiffReportDetailStore();
  const { locations, isFixLoading, report } = storeToRefs(detailStore);
  const { t } = useI18n({ messages: i18nDiffReportDetail });
  const { createNotification, createRetryNotification } =
    useChorusNotification();
  const { createDialog } = useDialog();

  const selectedSourceIndex = ref(0);

  async function fixDiffReport() {
    try {
      await detailStore.fixDiffReport(selectedSourceIndex.value);

      createNotification({
        type: 'success',
        title: t('fixSuccessTitle'),
        content: t('fixSuccessContent'),
        duration: 4000,
      });
    } catch (error: unknown) {
      createRetryNotification({
        title: t('fixErrorTitle'),
        message: t('fixErrorContent'),
        error,
        positiveText: t('fixErrorAction'),
        positiveHandler: () => {
          fixDiffReport();
        },
      });
    }
  }

  function handleFix() {
    selectedSourceIndex.value = 0;

    createDialog({
      type: 'warning',
      iconName: IconName.BASE_FLASH,
      title: t('fixConfirmTitle'),
      content: () => [
        h('div', { style: 'margin-bottom: 16px' }, t('fixConfirmContent')),
        h(
          'div',
          { style: 'margin-bottom: 8px; font-weight: 500' },
          t('fixSourceLabel'),
        ),
        h('div', { style: 'display: flex; flex-direction: column; gap: 8px' }, [
          h(
            CRadio,
            {
              checked: selectedSourceIndex.value === 0,
              name: 'fix-source',
              onChange: () => {
                selectedSourceIndex.value = 0;
              },
            },
            () =>
              `${locations.value[0]?.storage} / ${locations.value[0]?.bucket}`,
          ),
          h(
            CRadio,
            {
              checked: selectedSourceIndex.value === 1,
              name: 'fix-source',
              onChange: () => {
                selectedSourceIndex.value = 1;
              },
            },
            () =>
              `${locations.value[1]?.storage} / ${locations.value[1]?.bucket}`,
          ),
        ]),
      ],
      positiveText: t('fixConfirmAction'),
      negativeText: t('fixCancelAction'),
      positiveHandler: () => fixDiffReport(),
    });
  }

  const canFix = computed(() => {
    return report.value && !report.value.consistent && report.value.ready;
  });
</script>

<template>
  <div class="diff-report-detail-entries-list-actions">
    <CButton
      v-if="canFix"
      ghost
      type="primary"
      :loading="isFixLoading"
      @click="handleFix"
    >
      <template #icon>
        <CIcon
          :is-inline="true"
          :name="IconName.BASE_FLASH"
        />
      </template>
      {{ t('fixAction') }}
    </CButton>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/utils' as utils;

  .diff-report-detail-entries-list-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
