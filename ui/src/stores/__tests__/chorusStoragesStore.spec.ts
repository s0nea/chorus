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
import { useChorusStoragesStore } from '@/stores/chorusStoragesStore';
import { apiClient } from '@/http';
import type { ChorusStorage } from '@/utils/types/chorus';
import { StorageProvider } from '@/utils/types/chorus';

const testStorages: ChorusStorage[] = [
  {
    name: 'main-storage',
    isMain: true,
    address: 'https://main.example.com',
    provider: StorageProvider.S3,
    credentials: [],
  },
  {
    name: 'follower-1',
    isMain: false,
    address: 'https://follower1.example.com',
    provider: StorageProvider.S3,
    credentials: [],
  },
  {
    name: 'follower-2',
    isMain: false,
    address: 'https://follower2.example.com',
    provider: StorageProvider.SWIFT,
    credentials: [],
  },
];

describe('chorusStoragesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initStorages', () => {
    it('fetches and stores storages on success', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { storages: testStorages },
      });
      const store = useChorusStoragesStore();

      await store.initStorages();

      expect(store.storages).toEqual(testStorages);
      expect(store.isLoading).toBe(false);
      expect(store.hasError).toBe(false);
    });

    it('sets hasError on failure', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));
      const store = useChorusStoragesStore();

      await store.initStorages();

      expect(store.hasError).toBe(true);
      expect(store.isLoading).toBe(false);
      expect(store.storages).toEqual([]);
    });
  });

  describe('mainStorage', () => {
    it('returns the main storage', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { storages: testStorages },
      });
      const store = useChorusStoragesStore();

      await store.initStorages();

      expect(store.mainStorage?.name).toBe('main-storage');
    });

    it('returns undefined when no storages loaded', () => {
      const store = useChorusStoragesStore();

      expect(store.mainStorage).toBeUndefined();
    });
  });

  describe('followerStorages', () => {
    it('returns non-main storages', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { storages: testStorages },
      });
      const store = useChorusStoragesStore();

      await store.initStorages();

      expect(store.followerStorages).toHaveLength(2);
      expect(store.followerStorages.every((s) => !s.isMain)).toBe(true);
    });
  });

  describe('$reset', () => {
    it('resets to initial state', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { storages: testStorages },
      });
      const store = useChorusStoragesStore();

      await store.initStorages();

      store.$reset();

      expect(store.storages).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.hasError).toBe(false);
    });
  });
});
