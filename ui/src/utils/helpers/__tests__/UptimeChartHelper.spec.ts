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
import { UptimeChartHelper } from '@/utils/helpers/UptimeChartHelper';
import { UptimeStatus } from '@/utils/types/uptimeChart';
import type { PrometheusUptimeDataItem } from '@/utils/types/prometheus';

describe('UptimeChartHelper', () => {
  describe('isPrometheusDataItemUp', () => {
    it('returns true when count > 0', () => {
      expect(UptimeChartHelper.isPrometheusDataItemUp([1000, '1'])).toBe(true);
    });

    it('returns false when count is 0', () => {
      expect(UptimeChartHelper.isPrometheusDataItemUp([1000, '0'])).toBe(false);
    });
  });

  describe('isUptimeChartItemUp', () => {
    it('returns true for UP status', () => {
      expect(
        UptimeChartHelper.isUptimeChartItemUp({ y: UptimeStatus.UP }),
      ).toBe(true);
    });

    it('returns false for DOWN status', () => {
      expect(
        UptimeChartHelper.isUptimeChartItemUp({ y: UptimeStatus.DOWN }),
      ).toBe(false);
    });
  });

  describe('getTimestamp', () => {
    it('returns milliseconds from Date', () => {
      const date = new Date('2026-01-01T00:00:00Z');

      expect(UptimeChartHelper.getTimestamp(date)).toBe(date.getTime());
    });
  });

  describe('getRawChartData', () => {
    const jan1_0h = new Date('2026-01-01T00:00:00Z').getTime() / 1000;
    const jan1_12h = new Date('2026-01-01T12:00:00Z').getTime() / 1000;
    const jan2_0h = new Date('2026-01-02T00:00:00Z').getTime() / 1000;

    it('groups prometheus data by day', () => {
      const data: PrometheusUptimeDataItem[] = [
        [jan1_0h, '1'],
        [jan1_12h, '1'],
      ];

      const result = UptimeChartHelper.getRawChartData(data);

      expect(result).toHaveLength(1);

      if (result[0]) expect(result[0].y).toBe(UptimeStatus.UP);
    });

    it('marks day as DOWN if any data point is down', () => {
      const data: PrometheusUptimeDataItem[] = [
        [jan1_0h, '1'],
        [jan1_12h, '0'],
      ];

      const result = UptimeChartHelper.getRawChartData(data);

      expect(result).toHaveLength(1);

      if (result[0]) expect(result[0].y).toBe(UptimeStatus.DOWN);
    });

    it('collects down timestamps in meta', () => {
      const data: PrometheusUptimeDataItem[] = [
        [jan1_0h, '0'],
        [jan1_12h, '0'],
      ];

      const result = UptimeChartHelper.getRawChartData(data);

      if (result[0]) expect(result[0].meta.downTimestamps).toHaveLength(2);
    });

    it('separates data points into different days', () => {
      const data: PrometheusUptimeDataItem[] = [
        [jan1_0h, '1'],
        [jan2_0h, '1'],
      ];

      const result = UptimeChartHelper.getRawChartData(data);

      expect(result).toHaveLength(2);
    });
  });
});
