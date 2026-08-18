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

import { describe, it, expect } from 'vitest';
import { DiffReportsHelper } from '@/utils/helpers/DiffReportsHelper';
import {
  DiffReportStatusFilter,
  type DiffReport,
  type DiffReportLocation,
} from '@/utils/types/chorus';

function makeReport(overrides: Partial<DiffReport> = {}): DiffReport {
  return {
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
    ...overrides,
  };
}

describe('DiffReportsHelper', () => {
  describe('getDiffReportId', () => {
    it('joins locations as "storage:bucket" with pipe separator', () => {
      expect(DiffReportsHelper.getDiffReportId(makeReport().locations)).toBe(
        'main:photos|replica:photos-copy',
      );
    });
  });

  describe('getBucketPair', () => {
    it('returns "from → to" for two-location reports', () => {
      expect(DiffReportsHelper.getBucketPair(makeReport())).toBe(
        'photos → photos-copy',
      );
    });

    it('returns empty string for non-two-location reports', () => {
      const report = makeReport({
        locations: [{ storage: 'a', bucket: 'b' }],
      });

      expect(DiffReportsHelper.getBucketPair(report)).toBe('');
    });
  });

  describe('getDirectionPair', () => {
    it('returns "from → to" for two-location reports', () => {
      expect(DiffReportsHelper.getDirectionPair(makeReport())).toBe(
        'main → replica',
      );
    });

    it('returns empty string for non-two-location reports', () => {
      const report = makeReport({
        locations: [{ storage: 'a', bucket: 'b' }],
      });

      expect(DiffReportsHelper.getDirectionPair(report)).toBe('');
    });
  });

  describe('isDiffReportStatusMatched', () => {
    it('CHECKING matches when not ready', () => {
      const report = makeReport({ ready: false });

      expect(
        DiffReportsHelper.isDiffReportStatusMatched(
          report,
          DiffReportStatusFilter.CHECKING,
        ),
      ).toBe(true);
    });

    it('CONSISTENT matches when ready and consistent', () => {
      const report = makeReport({ ready: true, consistent: true });

      expect(
        DiffReportsHelper.isDiffReportStatusMatched(
          report,
          DiffReportStatusFilter.CONSISTENT,
        ),
      ).toBe(true);
    });

    it('INCONSISTENT matches when ready and not consistent', () => {
      const report = makeReport({ ready: true, consistent: false });

      expect(
        DiffReportsHelper.isDiffReportStatusMatched(
          report,
          DiffReportStatusFilter.INCONSISTENT,
        ),
      ).toBe(true);
    });
  });

  describe('isTwoLocationReport', () => {
    it('returns true for two locations', () => {
      expect(DiffReportsHelper.isTwoLocationReport(makeReport())).toBe(true);
    });

    it('returns false for one location', () => {
      const report = makeReport({
        locations: [{ storage: 'a', bucket: 'b' }],
      });

      expect(DiffReportsHelper.isTwoLocationReport(report)).toBe(false);
    });
  });

  describe('getStatusSortOrder', () => {
    it('returns 0 for checking (not ready)', () => {
      expect(
        DiffReportsHelper.getStatusSortOrder(makeReport({ ready: false })),
      ).toBe(0);
    });

    it('returns 1 for consistent', () => {
      expect(
        DiffReportsHelper.getStatusSortOrder(
          makeReport({ ready: true, consistent: true }),
        ),
      ).toBe(1);
    });

    it('returns 2 for inconsistent', () => {
      expect(
        DiffReportsHelper.getStatusSortOrder(
          makeReport({ ready: true, consistent: false }),
        ),
      ).toBe(2);
    });
  });

  describe('parseLocationFromQuery / formatLocationForQuery', () => {
    it('round-trips location through query format', () => {
      const location: DiffReportLocation = {
        storage: 'main',
        bucket: 'data',
      };
      const query = DiffReportsHelper.formatLocationForQuery(location);

      expect(query).toBe('main:data');
      expect(DiffReportsHelper.parseLocationFromQuery(query)).toEqual(location);
    });

    it('returns null for invalid query param', () => {
      expect(DiffReportsHelper.parseLocationFromQuery('invalid')).toBeNull();
    });
  });

  describe('parseQueryParamsToLocations', () => {
    it('parses multiple query params into locations', () => {
      const result = DiffReportsHelper.parseQueryParamsToLocations(
        'main:photos',
        'replica:photos-copy',
      );

      expect(result).toEqual([
        { storage: 'main', bucket: 'photos' },
        { storage: 'replica', bucket: 'photos-copy' },
      ]);
    });

    it('filters out null and invalid params', () => {
      const result = DiffReportsHelper.parseQueryParamsToLocations(
        'valid:bucket',
        null,
        undefined,
        'invalid',
      );

      expect(result).toEqual([{ storage: 'valid', bucket: 'bucket' }]);
    });

    it('flattens arrays', () => {
      const result = DiffReportsHelper.parseQueryParamsToLocations([
        'a:b',
        'c:d',
      ]);

      expect(result).toHaveLength(2);
    });
  });
});
