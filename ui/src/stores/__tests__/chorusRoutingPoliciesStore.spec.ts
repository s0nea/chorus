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

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useChorusRoutingPoliciesStore } from '@/stores/chorusRoutingPoliciesStore';
import { apiClient } from '@/http';
import { RoutingPolicyStatusFilter } from '@/utils/types/chorus';

const testApiResponse = {
  main: 'main-storage',
  userRoutings: [
    { user: 'user1', toStorage: 'replica', isBlocked: false },
    { user: 'user2', toStorage: 'backup', isBlocked: true },
  ],
  bucketRoutings: [
    {
      user: 'user1',
      toStorage: 'replica',
      bucket: 'photos',
      isBlocked: false,
    },
  ],
};

describe('chorusRoutingPoliciesStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function initWithTestData() {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: testApiResponse,
    });
    const store = useChorusRoutingPoliciesStore();

    await store.initRoutingPoliciesPage();

    return store;
  }

  describe('initRoutingPoliciesPage', () => {
    it('transforms user and bucket routings into unified list', async () => {
      const store = await initWithTestData();

      expect(store.routingPolicies).toHaveLength(3);

      const userPolicy = store.routingPolicies.find(
        (p) => p.user === 'user1' && p.bucket === '*',
      );

      expect(userPolicy).toBeTruthy();
      expect(userPolicy!.type).toBe('User');

      const bucketPolicy = store.routingPolicies.find(
        (p) => p.bucket === 'photos',
      );

      expect(bucketPolicy).toBeTruthy();
      expect(bucketPolicy!.type).toBe('Bucket');
    });

    it('sets hasError on failure', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('fail'));
      const store = useChorusRoutingPoliciesStore();

      await store.initRoutingPoliciesPage();

      expect(store.hasError).toBe(true);
    });
  });

  describe('filteredRoutingPolicies', () => {
    it('filters by user', async () => {
      const store = await initWithTestData();

      store.filterUsers = ['user2'];

      expect(store.computedRoutingPolicies).toHaveLength(1);
    });

    it('filters by blocked status', async () => {
      const store = await initWithTestData();

      store.filterStatus = RoutingPolicyStatusFilter.BLOCKED;

      expect(store.computedRoutingPolicies).toHaveLength(1);
    });

    it('filters by storage', async () => {
      const store = await initWithTestData();

      store.filterStorages = ['backup'];

      expect(store.computedRoutingPolicies).toHaveLength(1);
    });
  });

  describe('clearFilters', () => {
    it('resets all filters', async () => {
      const store = await initWithTestData();

      store.filterUsers = ['user1'];
      store.filterStatus = RoutingPolicyStatusFilter.BLOCKED;

      store.clearFilters();

      expect(store.isFiltered).toBe(false);
    });
  });

  describe('hasNoData', () => {
    it('returns true when empty', () => {
      const store = useChorusRoutingPoliciesStore();

      expect(store.hasNoData).toBe(true);
    });

    it('returns false when policies exist', async () => {
      const store = await initWithTestData();

      expect(store.hasNoData).toBe(false);
    });
  });

  describe('deleteRoutingPolicies', () => {
    it('returns success and error lists', async () => {
      const store = await initWithTestData();

      vi.mocked(apiClient.put)
        .mockResolvedValueOnce({})
        .mockRejectedValueOnce(new Error('fail'));

      const toDelete = store.routingPolicies.slice(0, 2);
      const result = await store.deleteRoutingPolicies(toDelete);

      expect(result.successList).toHaveLength(1);
      expect(result.errorList).toHaveLength(1);
    });
  });
});
