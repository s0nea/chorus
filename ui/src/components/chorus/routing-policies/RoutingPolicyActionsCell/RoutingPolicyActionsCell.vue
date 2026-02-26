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
  import { CButton, CIcon, CTooltip, useDialog } from '@clyso/clyso-ui-kit';
  import { h, ref } from 'vue';
  import i18nRoutingPolicies from '../i18nRoutingPolicies';
  import type { RoutingPolicy } from '@/utils/types/chorus';

  const { t } = useI18n({
    messages: i18nRoutingPolicies,
  });

  defineProps<{
    routingPolicy: RoutingPolicy;
  }>();

  const { createDialog } = useDialog();

  const isDeleteLoading = ref(false);

  async function deleteRoutingPolicy() {
    isDeleteLoading.value = true;
  }

  function handleRoutingPolicyDelete() {
    createDialog({
      type: 'error',
      iconName: 'base-trash',
      title: t('routingPolicyDeletionConfirmTitle'),
      content: () => [
        h(
          'div',
          { style: 'margin-bottom: 8px' },
          t('routingPolicyDeletionConfirmContent'),
        ),
        h('div'),
        t('routingPolicyDeletionConfirmQuestion'),
      ],
      positiveText: t('routingPolicyDeletionConfirmAction'),
      negativeText: t('routingPolicyDeletionCancelAction'),
      positiveHandler: () => deleteRoutingPolicy(),
    });
  }
</script>

<template>
  <div class="routing-policy-actions">
    <div class="routing-policy-actions__list">
      <div
        class="routing-policy-action__item routing-policy-action__item--delete"
      >
        <CTooltip :delay="1000">
          <template #trigger>
            <CButton
              secondary
              size="tiny"
              type="error"
              :loading="isDeleteLoading"
              @click="handleRoutingPolicyDelete"
            >
              <template #icon>
                <CIcon
                  :is-inline="true"
                  name="base-trash"
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
