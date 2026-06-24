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
  import { CButton, CIcon, CTooltip, useDialog } from '@clyso/clyso-ui-kit';
  import { h, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { DiffReport } from '@/utils/types/chorus';
  import type { AddId } from '@/utils/types/helper';
  import { useChorusDiffReportsStore } from '@/stores/chorusDiffReportsStore';
  import { IconName } from '@/utils/types/icon';
  import DiffReportsShortList from '@/components/chorus/diff-reports/DiffReportsShortList/DiffReportsShortList.vue';
  import i18nDiffReports from '@/components/chorus/diff-reports/i18nDiffReports';
  import { useChorusNotification } from '@/utils/composables/useChorusNotification';

  const { t } = useI18n({ messages: i18nDiffReports });

  const props = defineProps<{
    report: AddId<DiffReport>;
  }>();

  const isDeleteLoading = ref(false);

  const { deleteDiffReport: storeDeleteDiffReport } =
    useChorusDiffReportsStore();
  const { createNotification } = useChorusNotification();
  const { createDialog } = useDialog();

  async function deleteDiffReport() {
    isDeleteLoading.value = true;

    try {
      await storeDeleteDiffReport(props.report);

      createNotification({
        type: 'success',
        title: t('deleteSuccessTitle'),
        duration: 4000,
        content: () =>
          h('div', [
            t('deleteSuccessContent'),
            h(DiffReportsShortList, {
              reports: [props.report],
            }),
          ]),
      });
    } catch {
      createNotification({
        type: 'error',
        title: t('deleteErrorTitle'),
        positiveText: t('deleteErrorAction'),
        positiveHandler: () => {
          deleteDiffReport();
        },
        content: () =>
          h('div', [
            t('deleteErrorContent'),
            h(DiffReportsShortList, {
              reports: [props.report],
            }),
          ]),
      });
    } finally {
      isDeleteLoading.value = false;
    }
  }

  function handleDelete() {
    createDialog({
      type: 'error',
      iconName: IconName.BASE_TRASH,
      title: t('deletionConfirmTitle'),
      content: () => [
        h('div', { style: 'margin-bottom: 8px' }, t('deletionConfirmContent')),
        h(DiffReportsShortList, {
          reports: [props.report],
          size: 'medium',
          style: 'margin-bottom: 8px',
        }),
        t('deletionConfirmQuestion'),
      ],
      positiveText: t('deletionConfirmAction'),
      negativeText: t('deleteCancelAction'),
      positiveHandler: () => deleteDiffReport(),
    });
  }
</script>

<template>
  <div class="diff-reports-actions">
    <div class="diff-reports-actions__list">
      <div
        class="diff-reports-actions__item diff-reports-actions__item--delete"
      >
        <CTooltip :delay="1000">
          <template #trigger>
            <CButton
              secondary
              size="tiny"
              type="error"
              :loading="isDeleteLoading"
              @click="handleDelete"
            >
              <template #icon>
                <CIcon
                  :is-inline="true"
                  :name="IconName.BASE_TRASH"
                />
              </template>
            </CButton>
          </template>

          {{ t('actionDelete') }}
        </CTooltip>
      </div>
    </div>
  </div>
</template>
