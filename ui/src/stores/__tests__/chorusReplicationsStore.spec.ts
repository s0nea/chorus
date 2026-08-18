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
import { useChorusReplicationsStore } from '@/stores/chorusReplicationsStore';
import { apiClient } from '@/http';
import {
  ReplicationStatusFilter,
  ReplicationType,
  type ChorusReplication,
} from '@/utils/types/chorus';

function makeApiReplication(
  overrides: Partial<ChorusReplication> = {},
): ChorusReplication {
  return {
    id: {
      user: 'user1',
      fromStorage: 'main',
      toStorage: 'replica',
      fromBucket: 'src',
      toBucket: 'dst',
    },
    idStr: '',
    opts: { agentUrl: '' },
    createdAt: '2026-01-15T10:00:00Z',
    isPaused: false,
    isInitDone: true,
    initObjListed: '100',
    initObjDone: '100',
    events: '50',
    eventsDone: '50',
    eventLag: '0',
    hasSwitch: false,
    isArchived: false,
    archivedAt: '',
    switchInfo: {} as ChorusReplication['switchInfo'],
    replicationType: ReplicationType.BUCKET,
    ...overrides,
  };
}

const testReplications: ChorusReplication[] = [
  makeApiReplication(),
  makeApiReplication({
    id: {
      user: 'user2',
      fromStorage: 'main',
      toStorage: 'backup',
      fromBucket: 'data',
      toBucket: 'data-copy',
    },
    isPaused: true,
  }),
  makeApiReplication({
    id: {
      user: 'user1',
      fromStorage: 'primary',
      toStorage: 'secondary',
    },
    isInitDone: false,
  }),
];

describe('chorusReplicationsStore', () => {
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
      data: { replications: testReplications },
    });
    const store = useChorusReplicationsStore();

    await store.initReplicationsPage();

    return store;
  }

  describe('initReplicationsPage', () => {
    it('fetches and transforms replications', async () => {
      const store = await initWithTestData();

      expect(store.replications).toHaveLength(3);
      expect(store.replications[0]!.idStr).toBeTruthy();
      expect(store.replications[0]!.replicationType).toBe(
        ReplicationType.BUCKET,
      );
      expect(store.replications[1]!.idStr).toBeTruthy();
      expect(store.replications[2]!.idStr).toBeTruthy();
      expect(store.replications[2]!.replicationType).toBe(ReplicationType.USER);
      expect(store.isLoading).toBe(false);
    });

    it('sets hasError on failure', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('fail'));
      const store = useChorusReplicationsStore();

      await store.initReplicationsPage();

      expect(store.hasError).toBe(true);
    });
  });

  describe('filteredReplications', () => {
    it('filters by user', async () => {
      const store = await initWithTestData();

      store.filterUsers = ['user2'];

      expect(store.computedReplications).toHaveLength(1);
    });

    it('filters by status (PAUSED)', async () => {
      const store = await initWithTestData();

      store.filterStatuses = [ReplicationStatusFilter.PAUSED];

      expect(store.computedReplications).toHaveLength(1);
    });

    it('filters by direction', async () => {
      const store = await initWithTestData();

      store.filterDirections = ['main → replica'];

      expect(store.computedReplications).toHaveLength(1);
    });
  });

  describe('clearFilters', () => {
    it('resets all filters', async () => {
      const store = await initWithTestData();

      store.filterUsers = ['user1'];
      store.filterStatuses = [ReplicationStatusFilter.ACTIVE];

      store.clearFilters();

      expect(store.isFiltered).toBe(false);
      expect(store.computedReplications).toHaveLength(3);
    });
  });

  describe('selectedReplications', () => {
    it('returns replications matching selected ids', async () => {
      const store = await initWithTestData();

      store.selectedReplicationIds = [store.replications[0]!.idStr as string];

      expect(store.selectedReplications).toHaveLength(1);
      expect(store.isAnyReplicationsSelected).toBe(true);
    });
  });

  describe('hasNoData', () => {
    it('returns true when empty', () => {
      const store = useChorusReplicationsStore();

      expect(store.hasNoData).toBe(true);
    });

    it('returns false when replications exist', async () => {
      const store = await initWithTestData();

      expect(store.hasNoData).toBe(false);
    });
  });

  describe('deleteReplications', () => {
    it('calls delete API for each replication', async () => {
      const store = await initWithTestData();

      vi.mocked(apiClient.put).mockResolvedValue({});

      await store.deleteReplications([store.replications[0]!]);

      expect(apiClient.put).toHaveBeenCalled();
    });
  });
});
