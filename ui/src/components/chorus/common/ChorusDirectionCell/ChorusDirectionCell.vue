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
  import { CTag, CIcon } from '@clyso/clyso-ui-kit';
  import { IconName } from '@/utils/types/icon';
  import ChorusStorageTag from '@/components/chorus/common/ChorusStorageTag/ChorusStorageTag.vue';

  type CTagProps = InstanceType<typeof CTag>['$props'];

  export interface DirectionItem {
    text: string;
    tooltip?: string;
    type?: CTagProps['type'];
    iconName?: string;
  }

  defineProps<{
    items: DirectionItem[];
    size?: CTagProps['size'];
  }>();
</script>

<template>
  <div class="chorus-direction-cell">
    <template
      v-for="(item, index) in items"
      :key="index"
    >
      <CIcon
        v-if="index > 0"
        class="chorus-direction-cell__arrow"
        :is-inline="true"
        :name="IconName.BASE_ARROW_FORWARD"
      />

      <ChorusStorageTag
        :storage-name="item.text"
        :tooltip="item.tooltip"
        :type="item.type"
        :size="size"
        :icon-name="item.iconName"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/utils' as utils;

  .chorus-direction-cell {
    display: flex;
    align-items: center;
    gap: utils.unit(2);

    @include utils.mobile {
      flex-direction: column;
    }

    &__arrow {
      flex-shrink: 0;
    }
  }
</style>
