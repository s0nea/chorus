/*
 * Copyright © 2026 Clyso GmbH
 *
 *  Licensed under the GNU Affero General Public License, Version 3.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  https://www.gnu.org/licenses/agpl-3.0.html
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { defineStore } from 'pinia';
import { computed, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import type { DataTablePaginationObject } from '@clyso/clyso-ui-kit';
import type { ChorusStorage } from '@/utils/types/chorus';
import { ChorusService } from '@/services/ChorusService';
import { RouteName } from '@/utils/types/router';

const CREDENTIALS_PAGE_SIZES: number[] = [10, 20, 30, 50, 100];

interface ChorusStorageDetailsState {
  isLoading: boolean;
  hasError: boolean;
  storage: ChorusStorage | null;
  filterAlias: string;
  page: number;
  pageSize: number;
}

function getInitialState(): ChorusStorageDetailsState {
  return {
    isLoading: false,
    hasError: false,
    storage: null,
    filterAlias: '',
    page: 1,
    pageSize: 10,
  };
}

export const useChorusStorageDetailsStore = defineStore(
  'chorusStorageDetails',
  () => {
    const state = reactive<ChorusStorageDetailsState>(getInitialState());
    const router = useRouter();

    async function initStorageDetails(storageName: string) {
      state.isLoading = true;
      state.hasError = false;

      try {
        const { storages: storagesValue } = await ChorusService.getStorages();

        state.storage =
          storagesValue.find(({ name }) => storageName === name) ?? null;

        if (state.storage === null) {
          router.push({ name: RouteName.CHORUS_STORAGES });
        }
      } catch {
        state.hasError = true;
      } finally {
        state.isLoading = false;
      }
    }

    const computedCredentials = computed(() => {
      const credentials = state.storage?.credentials ?? [];
      const query = state.filterAlias.trim().toLowerCase();

      if (!query) {
        return credentials;
      }

      return credentials.filter((c) => c.alias.toLowerCase().includes(query));
    });

    const pagination = computed<DataTablePaginationObject>(() => {
      const itemCount = computedCredentials.value.length;

      return {
        page: state.page,
        pageSize: state.pageSize,
        showSizePicker: true,
        pageSizes: [...CREDENTIALS_PAGE_SIZES],
        pageCount: Math.ceil(itemCount / state.pageSize) || 1,
        itemCount,
      };
    });

    async function $reset() {
      Object.assign(state, getInitialState());
    }

    return {
      ...toRefs(state),
      computedCredentials,
      pagination,
      initStorageDetails,
      $reset,
    };
  },
);
