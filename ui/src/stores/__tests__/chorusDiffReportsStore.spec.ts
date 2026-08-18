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
import { useChorusDiffReportsStore } from '@/stores/chorusDiffReportsStore';
import { apiClient } from '@/http';
import { DiffReportStatusFilter, type DiffReport } from '@/utils/types/chorus';

const makeReport = (
  from: string,
  to: string,
  overrides: Partial<DiffReport> = {},
): DiffReport => ({
  locations: [
    { storage: from, bucket: `${from}-bucket` },
    { storage: to, bucket: `${to}-bucket` },
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
  ...overrides,
});

const testReports: DiffReport[] = [
  makeReport('main', 'replica'),
  makeReport('main', 'backup', { ready: false }),
  makeReport('primary', 'secondary', { ready: true, consistent: false }),
];

describe('chorusDiffReportsStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function initWithTestData() {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { checks: testReports },
    });
    const store = useChorusDiffReportsStore();

    await store.initDiffReportPage();

    return store;
  }

  describe('initDiffReportPage', () => {
    it('fetches and transforms reports with idStr', async () => {
      const store = await initWithTestData();

      expect(store.reports).toHaveLength(3);
      expect(store.reports[0]!.idStr).toBeTruthy();
      expect(store.isLoading).toBe(false);
      expect(store.hasError).toBe(false);
    });

    it('sets hasError on failure', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('fail'));
      const store = useChorusDiffReportsStore();

      await store.initDiffReportPage();

      expect(store.hasError).toBe(true);
    });
  });

  describe('filteredReports', () => {
    it('returns all reports when no filters', async () => {
      const store = await initWithTestData();

      expect(store.computedReports).toHaveLength(3);
    });

    it('filters by status', async () => {
      const store = await initWithTestData();

      store.filterStatuses = [DiffReportStatusFilter.INCONSISTENT];

      expect(store.computedReports).toHaveLength(1);
    });

    it('filters by direction', async () => {
      const store = await initWithTestData();

      store.filterDirections = ['main → replica'];

      expect(store.computedReports).toHaveLength(1);
    });
  });

  describe('clearFilters', () => {
    it('resets all filters', async () => {
      const store = await initWithTestData();

      store.filterStatuses = [DiffReportStatusFilter.CHECKING];
      store.filterDirections = ['main → replica'];

      store.clearFilters();

      expect(store.isFiltered).toBe(false);
      expect(store.computedReports).toHaveLength(3);
    });
  });

  describe('deleteDiffReports', () => {
    it('returns success and error lists', async () => {
      const store = await initWithTestData();

      vi.mocked(apiClient.put)
        .mockResolvedValueOnce({}) // first succeeds
        .mockRejectedValueOnce(new Error('fail')); // second fails

      const reports = store.reports.slice(0, 2);
      const result = await store.deleteDiffReports(reports);

      expect(result.successList).toHaveLength(1);
      expect(result.errorList).toHaveLength(1);
    });

    it('calls delete API for each report', async () => {
      const store = await initWithTestData();

      vi.mocked(apiClient.put).mockResolvedValue({});

      const toDelete = [store.reports[0]!];
      const result = await store.deleteDiffReports(toDelete);

      expect(result.successList).toHaveLength(1);
      expect(apiClient.put).toHaveBeenCalled();
    });
  });

  describe('restartDiffReports', () => {
    it('returns success and error lists', async () => {
      const store = await initWithTestData();

      vi.mocked(apiClient.put).mockResolvedValue({});

      const result = await store.restartDiffReports(store.reports);

      expect(result.successList).toHaveLength(3);
      expect(result.errorList).toHaveLength(0);
    });
  });

  describe('hasNoData', () => {
    it('returns true when no reports', () => {
      const store = useChorusDiffReportsStore();

      expect(store.hasNoData).toBe(true);
    });

    it('returns false when reports exist', async () => {
      const store = await initWithTestData();

      expect(store.hasNoData).toBe(false);
    });
  });
});
