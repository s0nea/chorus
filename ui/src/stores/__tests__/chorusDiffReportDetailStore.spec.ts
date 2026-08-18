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
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';
import { useChorusDiffReportDetailStore } from '@/stores/chorusDiffReportDetailStore';
import { apiClient } from '@/http';
import type { DiffReport } from '@/utils/types/chorus';

const testReport: DiffReport = {
  locations: [
    { storage: 'main', bucket: 'photos' },
    { storage: 'replica', bucket: 'photos-copy' },
  ],
  queued: '2026-01-01T00:00:00Z',
  completed: '2026-01-01T00:01:00Z',
  ready: true,
  consistent: true,
  versioned: false,
  ignoreSizes: false,
  ignoreEtags: false,
  fixQueued: '',
  fixCompleted: '',
  fixReady: false,
};

describe('chorusDiffReportDetailStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function setupWithRouteQuery(from: string, to: string) {
    vi.mocked(useRoute).mockReturnValue({
      query: { from, to },
      params: {},
      path: '/',
      name: '',
    } as never);
    setActivePinia(createPinia());
  }

  describe('initDiffReportDetailsPage', () => {
    it('fetches report when route has two valid locations', async () => {
      setupWithRouteQuery('main:photos', 'replica:photos-copy');
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { check: testReport },
      });
      const store = useChorusDiffReportDetailStore();

      await store.initDiffReportDetailsPage();

      expect(store.report).toEqual(testReport);
      expect(store.isLoading).toBe(false);
      expect(store.hasError).toBe(false);
    });

    it('does nothing when locations are incomplete', async () => {
      setupWithRouteQuery('main:photos', '');
      const store = useChorusDiffReportDetailStore();

      await store.initDiffReportDetailsPage();

      expect(store.report).toBeNull();
    });

    it('sets hasError on failure', async () => {
      setupWithRouteQuery('main:photos', 'replica:photos-copy');
      vi.mocked(apiClient.post).mockRejectedValue(new Error('fail'));
      const store = useChorusDiffReportDetailStore();

      await store.initDiffReportDetailsPage();

      expect(store.hasError).toBe(true);
    });

    it('sets isNotFound on 404', async () => {
      setupWithRouteQuery('main:photos', 'replica:photos-copy');
      const error = new AxiosError('Not found', '404');

      error.status = 404;
      vi.mocked(apiClient.post).mockRejectedValue(error);
      const store = useChorusDiffReportDetailStore();

      await store.initDiffReportDetailsPage();

      expect(store.isNotFound).toBe(true);
      expect(store.hasError).toBe(false);
    });
  });

  describe('hasFixActivity', () => {
    it('returns false when no report', () => {
      setupWithRouteQuery('main:photos', 'replica:photos-copy');
      const store = useChorusDiffReportDetailStore();

      expect(store.hasFixActivity).toBe(false);
    });

    it('returns true when inconsistent with fix activity', async () => {
      setupWithRouteQuery('main:photos', 'replica:photos-copy');
      const reportWithFix = {
        ...testReport,
        consistent: false,
        fixQueued: '1',
      };

      vi.mocked(apiClient.post).mockResolvedValue({
        data: { check: reportWithFix },
      });
      const store = useChorusDiffReportDetailStore();

      await store.initDiffReportDetailsPage();

      expect(store.hasFixActivity).toBe(true);
    });
  });

  describe('$reset', () => {
    it('clears report and locations', async () => {
      setupWithRouteQuery('main:photos', 'replica:photos-copy');
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { check: testReport },
      });
      const store = useChorusDiffReportDetailStore();

      await store.initDiffReportDetailsPage();

      store.$reset();

      expect(store.report).toBeNull();
      expect(store.locations).toEqual([]);
    });
  });
});
