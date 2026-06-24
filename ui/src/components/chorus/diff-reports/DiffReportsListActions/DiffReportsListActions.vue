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
  import { useI18n } from 'vue-i18n';
  import {
    CButton,
    CIcon,
    CTooltip,
    useDialog,
    CBadge,
  } from '@clyso/clyso-ui-kit';
  import { computed, h } from 'vue';
  import { storeToRefs } from 'pinia';
  import i18nDiffReports from '@/components/chorus/diff-reports/i18nDiffReports';
  import { IconName } from '@/utils/types/icon';
  import { useChorusDiffReportsStore } from '@/stores/chorusDiffReportsStore';
  import DiffReportsShortList from '@/components/chorus/diff-reports/DiffReportsShortList/DiffReportsShortList.vue';
  import { useChorusNotification } from '@/utils/composables/useChorusNotification';

  const { t } = useI18n({ messages: i18nDiffReports });
  const { createDialog } = useDialog();
  const { createNotification } = useChorusNotification();

  const {
    selectedReportsCount,
    isAnyReportsSelected,
    selectedReports,
    isDeleteSelectedProcessing,
  } = storeToRefs(useChorusDiffReportsStore());
  const { deleteDiffReports } = useChorusDiffReportsStore();

  const selectedDiffReportsForDelete = computed(() =>
    selectedReports.value.filter((report) => report.locations.length === 2),
  );

  const isDeleteDisabled = computed(
    () =>
      !isAnyReportsSelected.value ||
      selectedDiffReportsForDelete.value.length === 0,
  );

  function openDeleteConfirmation() {
    const reports = selectedDiffReportsForDelete.value;

    createDialog({
      type: 'error',
      iconName: IconName.BASE_TRASH,
      title: t('actionSelectedDeleteTitle'),
      content: () => [
        h(
          'div',
          { style: 'margin-bottom: 8px' },
          t('actionSelectedDeleteContent', { total: reports.length }),
        ),
        h(DiffReportsShortList, {
          reports,
          size: 'medium',
          style: 'margin-bottom: 8px',
        }),
        t('actionSelectedDeleteQuestion'),
      ],
      positiveText: t('actionDelete'),
      negativeText: t('deleteCancelAction'),
      positiveHandler: async () => {
        const { successList, errorList } = await deleteDiffReports(reports);

        if (successList.length > 0) {
          createNotification({
            type: 'success',
            title: t('deleteSelectedSuccessTitle'),
            duration: 4000,
            content: () =>
              h('div', [
                t('deleteSelectedSuccessContent', {
                  total: successList.length,
                }),
                h(DiffReportsShortList, { reports: successList }),
              ]),
          });
        }

        if (errorList.length > 0) {
          createNotification({
            type: 'error',
            title: t('deleteSelectedErrorTitle'),
            positiveText: t('deleteSelectedErrorAction'),
            positiveHandler: () => {
              openDeleteConfirmation();
            },
            content: () =>
              h('div', [
                t('deleteSelectedErrorContent', {
                  total: errorList.length,
                }),
                h(DiffReportsShortList, { reports: errorList }),
              ]),
          });
        }
      },
    });
  }
</script>

<template>
  <div class="diff-reports-list-actions">
    <div class="diff-reports-list-actions__selection-actions">
      <CTooltip :delay="1000">
        <template #trigger>
          <CBadge
            :offset="[-4, 0]"
            :value="selectedDiffReportsForDelete.length"
            :max="100"
          >
            <CButton
              secondary
              :disabled="isDeleteDisabled"
              :loading="isDeleteSelectedProcessing"
              size="medium"
              type="error"
              @click="openDeleteConfirmation"
            >
              <template #icon>
                <CIcon
                  :is-inline="true"
                  :name="IconName.BASE_TRASH"
                />
              </template>
            </CButton>
          </CBadge>
        </template>

        <template v-if="!isAnyReportsSelected">
          {{ t('actionDelete') }}
        </template>
        <template v-else>
          {{ t('actionDeleteSelected', { total: selectedReportsCount }) }}
        </template>
      </CTooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/utils' as utils;

  .diff-reports-list-actions {
    display: flex;
    justify-content: space-between;
    gap: utils.unit(2);

    &__selection-actions {
      display: inline-flex;
      align-items: center;
      gap: utils.unit(3);

      ::v-deep(.c-badge-sup) {
        pointer-events: none;
      }
    }
  }
</style>
