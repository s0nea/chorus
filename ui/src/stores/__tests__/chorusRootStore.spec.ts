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
import { useChorusRootStore } from '@/stores/chorusRootStore';
import { apiClient } from '@/http';
import type { ChorusProxyCredentials } from '@/utils/types/chorus';

const testProxy: ChorusProxyCredentials = {
  address: 'https://proxy.example.com',
  credentials: [{ alias: 'default', accessKey: 'ak', secretKey: 'sk' }],
};

describe('chorusRootStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('getProxy', () => {
    it('fetches and stores proxy credentials', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: testProxy });
      const store = useChorusRootStore();

      await store.getProxy();

      expect(store.proxy).toEqual(testProxy);
    });

    it('starts with null proxy', () => {
      const store = useChorusRootStore();

      expect(store.proxy).toBeNull();
    });
  });
});
