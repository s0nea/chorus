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
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { GeneralHelper } from '@/utils/helpers/GeneralHelper';

describe('GeneralHelper', () => {
  describe('mergeWithCustom', () => {
    it('concatenates arrays instead of overwriting', () => {
      const a = { tags: ['one'] };
      const b = { tags: ['two'] };
      const result = GeneralHelper.mergeWithCustom([a, b]);

      expect(result.tags).toEqual(['one', 'two']);
    });

    it('merges non-array properties normally', () => {
      const a = { name: 'a', count: 1 };
      const b = { name: 'b', count: 2 };
      const result = GeneralHelper.mergeWithCustom([a, b]);

      expect(result.name).toBe('b');
      expect(result.count).toBe(2);
    });
  });

  describe('formatBytes', () => {
    it('returns "0 Bytes" for 0', () => {
      expect(GeneralHelper.formatBytes(0)).toBe('0 Bytes');
    });

    it('formats kilobytes', () => {
      expect(GeneralHelper.formatBytes(1024)).toBe('1 KB');
    });

    it('formats megabytes with decimals', () => {
      expect(GeneralHelper.formatBytes(1048576)).toBe('1 MB');
    });

    it('formats gigabytes', () => {
      expect(GeneralHelper.formatBytes(1073741824)).toBe('1 GB');
    });

    it('respects custom decimals', () => {
      expect(GeneralHelper.formatBytes(1536, 1)).toBe('1.5 KB');
    });
  });

  describe('date formatting', () => {
    beforeEach(() => {
      setActivePinia(createTestingPinia({ createSpy: vi.fn }));
    });

    it('formatDate returns a formatted date string', () => {
      const result = GeneralHelper.formatDate('2026-06-15T12:00:00Z');

      expect(result).toBe('15 Jun 2026');
    });

    it('formatDate accepts Date objects', () => {
      const result = GeneralHelper.formatDate(new Date('2026-06-15T00:00:00Z'));

      expect(result).toBe('15 Jun 2026');
    });

    it('formatDateTime includes time components', () => {
      const result = GeneralHelper.formatDateTime('2026-06-15T14:30:45Z');

      expect(result).toMatch(/15 Jun 2026.*\d{2}:\d{2}/);
    });

    it('formatDateDistance returns human-readable distance', () => {
      const result = GeneralHelper.formatDateDistance(
        '2026-06-15T12:00:00Z',
        '2026-06-15T13:00:00Z',
      );

      expect(result).toBe('1 hour');
    });

    it('formatDurationSeconds parses seconds string', () => {
      const result = GeneralHelper.formatDurationSeconds('3661s');

      expect(result).toMatch(/1 hour/);
    });

    it('formatDurationSeconds returns "-" for invalid input', () => {
      expect(GeneralHelper.formatDurationSeconds('abc')).toBe('-');
    });
  });
});
