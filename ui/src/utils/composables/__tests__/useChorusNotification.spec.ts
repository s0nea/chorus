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
import { useChorusNotification } from '@/utils/composables/useChorusNotification';

describe('useChorusNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createNotification', () => {
    it('returns an id and tracks it', () => {
      const { createNotification, activeNotificationIds } =
        useChorusNotification();

      const id = createNotification({ type: 'info', title: 'Test' });

      expect(id).toMatch(/^notif-\d+$/);
      expect(activeNotificationIds.value).toContain(id);
    });
  });

  describe('removeNotification', () => {
    it('removes tracked id', () => {
      const { createNotification, removeNotification, activeNotificationIds } =
        useChorusNotification();

      const id = createNotification({ type: 'info', title: 'Test' });

      removeNotification(id);

      expect(activeNotificationIds.value).not.toContain(id);
    });

    it('is a no-op for unknown ids', () => {
      const { removeNotification, activeNotificationIds } =
        useChorusNotification();

      removeNotification('unknown');

      expect(activeNotificationIds.value).toHaveLength(0);
    });
  });

  describe('createRetryNotification', () => {
    it('creates an error notification and tracks it', () => {
      const { createRetryNotification, activeNotificationIds } =
        useChorusNotification();

      const id = createRetryNotification({
        title: 'Retry',
        message: 'Something failed',
        error: new Error('timeout'),
        positiveText: 'Retry',
        positiveHandler: vi.fn(),
      });

      expect(id).toMatch(/^notif-\d+$/);
      expect(activeNotificationIds.value).toContain(id);
    });
  });

  describe('removeNotifications', () => {
    it('clears all tracked ids', () => {
      const { createNotification, removeNotifications, activeNotificationIds } =
        useChorusNotification();

      createNotification({ type: 'info', title: 'A' });
      createNotification({ type: 'info', title: 'B' });

      expect(activeNotificationIds.value).toHaveLength(2);

      removeNotifications();

      expect(activeNotificationIds.value).toHaveLength(0);
    });
  });
});
