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

import { type DataTablePaginationObject } from '@clyso/clyso-ui-kit';
import type { DataTableSortState } from 'naive-ui';
import { defineStore } from 'pinia';
import { computed, reactive, toRefs } from 'vue';
import { GeneralHelper } from '@/utils/helpers/GeneralHelper';
import {
  RoutingPolicyTypes,
  type ChorusBucketRoutingPolicy,
  type ChorusRoutingPoliciesRequest,
  type ChorusRoutingPolicy,
  type ChorusUserRoutingPolicy,
} from '@/utils/types/chorus';
import { ChorusService } from '@/services/ChorusService';

interface ChorusRoutingPoliciesState {
  isLoading: boolean;
  hasError: boolean;
  userRoutingPolicies: ChorusUserRoutingPolicy[];
  bucketRoutingPolicies: ChorusBucketRoutingPolicy[];
  sorter: DataTableSortState | null;
  page: number;
  pageSize: number;
  pollingRequest: Promise<unknown> | null;
  pollingTimeout: number | null;

  selectedRoutingPolicyIds: string[];
  isResumeSelectedProcessing: boolean;
  isPauseSelectedProcessing: boolean;
  isDeleteSelectedProcessing: boolean;

  routingPoliciesRequestOptions: ChorusRoutingPoliciesRequest | null;

  filterUsers: string[];
  filterBucket: string;
  filterStorages: string[];
  filterStatus: boolean | null;
}

const PAGE_SIZES = [10, 20, 30, 50, 100] as const;

function getInitialState(): ChorusRoutingPoliciesState {
  return {
    isLoading: false,
    hasError: false,
    userRoutingPolicies: [],
    bucketRoutingPolicies: [],
    sorter: null,
    page: 1,
    pageSize: PAGE_SIZES[0],
    pollingRequest: null,
    pollingTimeout: null,
    selectedRoutingPolicyIds: [],

    isResumeSelectedProcessing: false,
    isPauseSelectedProcessing: false,
    isDeleteSelectedProcessing: false,

    routingPoliciesRequestOptions: null,

    filterUsers: [],
    filterBucket: '',
    filterStorages: [],
    filterStatus: null,
  };
}

export const useChorusRoutingPoliciesStore = defineStore(
  'chorusRoutingPolicies',
  () => {
    const state = reactive<ChorusRoutingPoliciesState>(getInitialState());

    const isBasePolicyMatched = (basePolicy: {
      user: string;
      toStorage: string;
      isBlocked: boolean;
    }) => {
      const isUserMatched =
        !state.filterUsers.length ||
        state.filterUsers.includes(basePolicy.user);
      const isStorageMatched =
        !state.filterStorages.length ||
        state.filterStorages.includes(basePolicy.toStorage);
      const isStatusMatched =
        !state.filterStatus || state.filterStatus === basePolicy.isBlocked;

      return isUserMatched && isStorageMatched && isStatusMatched;
    };

    const filteredUserRoutingPolicies = computed<ChorusUserRoutingPolicy[]>(
      () => state.userRoutingPolicies.filter(isBasePolicyMatched),
    );

    const filteredBucketRoutingPolicies = computed<ChorusBucketRoutingPolicy[]>(
      () => {
        const bucketFilterText = state.filterBucket?.toLowerCase().trim();

        return state.bucketRoutingPolicies.filter((bucketPolicy) => {
          if (!isBasePolicyMatched(bucketPolicy)) return false;

          if (!bucketFilterText) return true;

          return bucketPolicy.bucket
            ?.toLowerCase()
            .trim()
            .includes(bucketFilterText);
        });
      },
    );

    const computedRoutingPolicies = computed<ChorusRoutingPolicy[]>(() => {
      const policies: ChorusRoutingPolicy[] = [
        ...filteredUserRoutingPolicies.value.map((policy) => ({
          ...policy,
          bucket: '*',
          type: RoutingPolicyTypes.USER,
          id: `${policy.toStorage}${policy.user}`,
        })),
        ...filteredBucketRoutingPolicies.value.map((policy) => ({
          ...policy,
          type: RoutingPolicyTypes.BUCKET,
          id: `${policy.toStorage}${policy.user}${policy.bucket}`,
        })),
      ];

      const sortedPolicies = state.sorter
        ? GeneralHelper.orderBy(
            policies,
            [state.sorter.columnKey],
            [state.sorter.order === 'ascend' ? 'asc' : 'desc'],
          )
        : policies;

      const start = (state.page - 1) * state.pageSize;
      const end = state.page * state.pageSize;

      return sortedPolicies.slice(start, end);
    });

    const hasNoData = computed<boolean>(
      () => computedRoutingPolicies.value.length === 0,
    );

    const isFiltered = computed<boolean>(
      () =>
        state.filterUsers.length !== 0 ||
        state.filterBucket !== '' ||
        state.filterStorages.length !== 0 ||
        state.filterStatus !== null,
    );

    function clearFilters() {
      state.filterUsers = [];
      state.filterBucket = '';
      state.filterStorages = [];
      state.filterStatus = null;
    }

    async function getRoutingPolicies() {
      state.routingPoliciesRequestOptions = {
        hideUserRoutings: false,
        hideBucketRoutings: false,
      };

      const res = await ChorusService.getRoutingPolicies(
        state.routingPoliciesRequestOptions,
      );

      state.userRoutingPolicies = res.userRoutings;
      state.bucketRoutingPolicies = res.bucketRoutings;
    }

    async function startRoutingPoliciesPolling() {
      try {
        await stopRoutingPoliciesPolling();

        state.pollingRequest = getRoutingPolicies();

        await state.pollingRequest;
      } finally {
        state.pollingRequest = null;
        state.pollingTimeout = window.setTimeout(
          startRoutingPoliciesPolling,
          5000,
        );
      }
    }

    async function stopRoutingPoliciesPolling() {
      let error: Error | null = null;

      if (state.pollingRequest) {
        try {
          await state.pollingRequest;
        } catch (e) {
          error = e as Error;
        } finally {
          state.pollingRequest = null;
        }
      }

      if (!state.pollingTimeout) {
        return;
      }

      clearTimeout(state.pollingTimeout);
      state.pollingTimeout = null;

      if (error) {
        throw error;
      }
    }

    async function initRoutingPoliciesPage() {
      state.isLoading = true;

      try {
        await startRoutingPoliciesPolling();

        state.hasError = false;
      } catch {
        state.hasError = true;
        await stopRoutingPoliciesPolling();
      } finally {
        state.isLoading = false;
      }
    }

    const pagination = computed<DataTablePaginationObject>(() => ({
      page: state.page,
      pageSize: state.pageSize,
      showSizePicker: true,
      pageSizes: [...PAGE_SIZES],
      pageCount: Math.ceil(
        (filteredUserRoutingPolicies.value.length +
          filteredBucketRoutingPolicies.value.length) /
          state.pageSize,
      ),
      itemCount:
        filteredUserRoutingPolicies.value.length +
        filteredBucketRoutingPolicies.value.length,
      prefix({ itemCount }) {
        if (state.isLoading || state.hasError) {
          return '';
        }

        if (isFiltered.value) {
          return `Filtered: ${
            filteredUserRoutingPolicies.value.length +
            filteredBucketRoutingPolicies.value.length
          } /
            Total: ${computedRoutingPolicies.value.length}`;
        }

        return `Total: ${itemCount}`;
      },
    }));

    const selectedRoutingPoliciesCount = computed(
      () => state.userRoutingPolicies.length,
    );

    const isAnyRoutingPolicySelected = computed(
      () => state.selectedRoutingPolicyIds.length !== 0,
    );

    const selectedRoutingPolicies = computed<ChorusRoutingPolicy[]>(() =>
      computedRoutingPolicies.value.filter((routingPolicy) =>
        state.selectedRoutingPolicyIds.includes(routingPolicy.id),
      ),
    );

    const isSelectedProcessing = computed(
      () =>
        state.isResumeSelectedProcessing ||
        state.isPauseSelectedProcessing ||
        state.isDeleteSelectedProcessing,
    );

    async function $reset() {
      try {
        await stopRoutingPoliciesPolling();
      } finally {
        Object.assign(state, getInitialState());
      }
    }

    return {
      ...toRefs(state),
      hasNoData,
      pagination,
      computedRoutingPolicies,
      initRoutingPoliciesPage,
      selectedRoutingPoliciesCount,
      isAnyRoutingPolicySelected,
      selectedRoutingPolicies,
      isSelectedProcessing,
      isFiltered,
      clearFilters,
      $reset,
    };
  },
);
