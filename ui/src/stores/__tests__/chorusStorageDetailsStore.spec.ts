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
import { useRouter } from 'vue-router';
import { useChorusStorageDetailsStore } from '@/stores/chorusStorageDetailsStore';
import { apiClient } from '@/http';
import { StorageProvider, type ChorusStorage } from '@/utils/types/chorus';

const testStorages: ChorusStorage[] = [
  {
    name: 'main-storage',
    isMain: true,
    address: 'https://main.example.com',
    provider: StorageProvider.S3,
    credentials: [
      { alias: 'admin', accessKey: 'ak1', secretKey: 'sk1' },
      { alias: 'user1', accessKey: 'ak2', secretKey: 'sk2' },
      { alias: 'user2', accessKey: 'ak3', secretKey: 'sk3' },
    ],
  },
  {
    name: 'follower',
    isMain: false,
    address: 'https://follower.example.com',
    provider: StorageProvider.S3,
    credentials: [],
  },
];

describe('chorusStorageDetailsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initStorageDetails', () => {
    it('loads the matching storage by name', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { storages: testStorages },
      });
      const store = useChorusStorageDetailsStore();

      await store.initStorageDetails('main-storage');

      expect(store.storage?.name).toBe('main-storage');
      expect(store.isLoading).toBe(false);
      expect(store.hasError).toBe(false);
    });

    it('redirects when storage not found', async () => {
      const mockPush = vi.fn();

      vi.mocked(useRouter).mockReturnValue({ push: mockPush } as never);
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { storages: testStorages },
      });
      const store = useChorusStorageDetailsStore();

      await store.initStorageDetails('nonexistent');

      expect(store.storage).toBeNull();
      expect(mockPush).toHaveBeenCalled();
    });

    it('sets hasError on failure', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('fail'));
      const store = useChorusStorageDetailsStore();

      await store.initStorageDetails('main-storage');

      expect(store.hasError).toBe(true);
    });
  });

  describe('credentialsList', () => {
    it('returns credentials from loaded storage', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { storages: testStorages },
      });
      const store = useChorusStorageDetailsStore();

      await store.initStorageDetails('main-storage');

      expect(store.credentialsList).toHaveLength(3);
    });

    it('returns empty array when no storage loaded', () => {
      const store = useChorusStorageDetailsStore();

      expect(store.credentialsList).toEqual([]);
    });
  });

  describe('computedCredentials', () => {
    it('paginates credentials', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { storages: testStorages },
      });
      const store = useChorusStorageDetailsStore();

      await store.initStorageDetails('main-storage');

      store.credentialsPageSize = 2;

      expect(store.computedCredentials).toHaveLength(2);
    });
  });

  describe('$reset', () => {
    it('resets to initial state', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { storages: testStorages },
      });
      const store = useChorusStorageDetailsStore();

      await store.initStorageDetails('main-storage');

      store.$reset();

      expect(store.storage).toBeNull();
      expect(store.credentialsList).toEqual([]);
    });
  });
});
