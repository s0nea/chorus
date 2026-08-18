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

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRoute } from 'vue-router';
import { useChorusDiffReportEntriesStore } from '@/stores/chorusDiffReportEntriesStore';
import { useChorusDiffReportDetailStore } from '@/stores/chorusDiffReportDetailStore';
import { apiClient } from '@/http';
import type { DiffReportEntry } from '@/utils/types/chorus';

const testEntries: DiffReportEntry[] = [
  {
    object: 'file-a.jpg',
    versionIdx: '1',
    size: '1024',
    etag: 'abc',
    storageEntries: [{ storage: 'main', versionId: 'v1', bucket: 'photos' }],
  },
  {
    object: 'file-b.png',
    versionIdx: '1',
    size: '2048',
    etag: 'def',
    storageEntries: [{ storage: 'main', versionId: 'v1', bucket: 'photos' }],
  },
];

describe('chorusDiffReportEntriesStore', () => {
  beforeEach(() => {
    vi.mocked(useRoute).mockReturnValue({
      query: { from: 'main:photos', to: 'replica:photos-copy' },
      params: {},
      path: '/',
      name: '',
    } as never);
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('getReportEntries', () => {
    it('fetches entries when locations are valid', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { entries: testEntries, cursor: '' },
      });

      const detailStore = useChorusDiffReportDetailStore();

      detailStore.locations = [
        { storage: 'main', bucket: 'photos' },
        { storage: 'replica', bucket: 'photos-copy' },
      ];

      const store = useChorusDiffReportEntriesStore();

      await store.getReportEntries();

      expect(store.entries).toEqual(testEntries);
      expect(store.isLoading).toBe(false);
    });

    it('skips fetch when less than 2 locations', async () => {
      const detailStore = useChorusDiffReportDetailStore();

      detailStore.locations = [{ storage: 'main', bucket: 'photos' }];

      const store = useChorusDiffReportEntriesStore();

      await store.getReportEntries();

      expect(store.entries).toEqual([]);
      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('sets hasError on failure', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('fail'));

      const detailStore = useChorusDiffReportDetailStore();

      detailStore.locations = [
        { storage: 'main', bucket: 'photos' },
        { storage: 'replica', bucket: 'photos-copy' },
      ];

      const store = useChorusDiffReportEntriesStore();

      await store.getReportEntries();

      expect(store.hasError).toBe(true);
    });
  });

  describe('inconsistentObjectsCount', () => {
    it('returns entries length', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { entries: testEntries, cursor: '' },
      });

      const detailStore = useChorusDiffReportDetailStore();

      detailStore.locations = [
        { storage: 'main', bucket: 'photos' },
        { storage: 'replica', bucket: 'photos-copy' },
      ];

      const store = useChorusDiffReportEntriesStore();

      await store.getReportEntries();

      expect(store.inconsistentObjectsCount).toBe(2);
    });
  });

  describe('computedReportObjects', () => {
    it('filters by object name', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { entries: testEntries, cursor: '' },
      });

      const detailStore = useChorusDiffReportDetailStore();

      detailStore.locations = [
        { storage: 'main', bucket: 'photos' },
        { storage: 'replica', bucket: 'photos-copy' },
      ];

      const store = useChorusDiffReportEntriesStore();

      await store.getReportEntries();

      store.filterObjectName = 'file-a';

      expect(store.computedReportObjects).toHaveLength(1);
    });
  });
});
