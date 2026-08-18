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
import { ReplicationsHelper } from '@/utils/helpers/ReplicationsHelper';
import {
  ReplicationStatusFilter,
  ReplicationType,
  type ChorusReplication,
} from '@/utils/types/chorus';
import type { AddId } from '@/utils/types/helper';

function makeReplication(
  overrides: Partial<ChorusReplication> = {},
): AddId<ChorusReplication> {
  return {
    idStr: '1',
    id: {
      user: 'user1',
      fromStorage: 'storage-a',
      toStorage: 'storage-b',
      fromBucket: 'bucket-a',
      toBucket: 'bucket-b',
    },
    opts: { agentUrl: '' },
    createdAt: '2026-01-15T10:00:00Z',
    isPaused: false,
    isInitDone: true,
    initObjListed: '100',
    initObjDone: '100',
    events: '50',
    eventsDone: '50',
    eventLag: '0',
    hasSwitch: false,
    isArchived: false,
    archivedAt: '',
    switchInfo: {} as ChorusReplication['switchInfo'],
    replicationType: ReplicationType.BUCKET,
    ...overrides,
  };
}

describe('ReplicationsHelper', () => {
  describe('getLiveReplicationEventsDifference', () => {
    it('returns 0 when events is falsy', () => {
      const r = makeReplication({ events: '', eventsDone: '10' });

      expect(ReplicationsHelper.getLiveReplicationEventsDifference(r)).toBe(0);
    });

    it('returns difference between events and eventsDone', () => {
      const r = makeReplication({ events: '100', eventsDone: '40' });

      expect(ReplicationsHelper.getLiveReplicationEventsDifference(r)).toBe(60);
    });

    it('returns 0 when events equal eventsDone', () => {
      const r = makeReplication({ events: '50', eventsDone: '50' });

      expect(ReplicationsHelper.getLiveReplicationEventsDifference(r)).toBe(0);
    });
  });

  describe('isLiveReplicationBehind', () => {
    it('returns true when events > eventsDone', () => {
      const r = makeReplication({ events: '10', eventsDone: '5' });

      expect(ReplicationsHelper.isLiveReplicationBehind(r)).toBe(true);
    });

    it('returns false when caught up', () => {
      const r = makeReplication({ events: '10', eventsDone: '10' });

      expect(ReplicationsHelper.isLiveReplicationBehind(r)).toBe(false);
    });
  });

  describe('isReplicationStatusMatched', () => {
    it('ACTIVE matches non-paused replications', () => {
      const r = makeReplication({ isPaused: false });

      expect(
        ReplicationsHelper.isReplicationStatusMatched(
          r,
          ReplicationStatusFilter.ACTIVE,
        ),
      ).toBe(true);
    });

    it('PAUSED matches paused replications', () => {
      const r = makeReplication({ isPaused: true });

      expect(
        ReplicationsHelper.isReplicationStatusMatched(
          r,
          ReplicationStatusFilter.PAUSED,
        ),
      ).toBe(true);
    });

    it('INITIAL_IN_PROGRESS matches when init not done', () => {
      const r = makeReplication({ isInitDone: false });

      expect(
        ReplicationsHelper.isReplicationStatusMatched(
          r,
          ReplicationStatusFilter.INITIAL_IN_PROGRESS,
        ),
      ).toBe(true);
    });

    it('INITIAL_DONE matches when init is done', () => {
      const r = makeReplication({ isInitDone: true });

      expect(
        ReplicationsHelper.isReplicationStatusMatched(
          r,
          ReplicationStatusFilter.INITIAL_DONE,
        ),
      ).toBe(true);
    });

    it('LIVE_UP_TO_DATE matches when init done and events caught up', () => {
      const r = makeReplication({
        isInitDone: true,
        events: '10',
        eventsDone: '10',
      });

      expect(
        ReplicationsHelper.isReplicationStatusMatched(
          r,
          ReplicationStatusFilter.LIVE_UP_TO_DATE,
        ),
      ).toBe(true);
    });

    it('LIVE_BEHIND matches when init done and events behind', () => {
      const r = makeReplication({
        isInitDone: true,
        events: '20',
        eventsDone: '10',
      });

      expect(
        ReplicationsHelper.isReplicationStatusMatched(
          r,
          ReplicationStatusFilter.LIVE_BEHIND,
        ),
      ).toBe(true);
    });
  });

  describe('isReplicationCreateAtMatched', () => {
    it('returns true when createdAt is within range', () => {
      const r = makeReplication({ createdAt: '2026-06-15T12:00:00Z' });
      const start = new Date('2026-06-01').getTime();
      const end = new Date('2026-06-30').getTime();

      expect(
        ReplicationsHelper.isReplicationCreateAtMatched(r, [start, end]),
      ).toBe(true);
    });

    it('returns false when createdAt is outside range', () => {
      const r = makeReplication({ createdAt: '2026-07-15T12:00:00Z' });
      const start = new Date('2026-06-01').getTime();
      const end = new Date('2026-06-30').getTime();

      expect(
        ReplicationsHelper.isReplicationCreateAtMatched(r, [start, end]),
      ).toBe(false);
    });
  });

  describe('getDirectionPairString', () => {
    it('returns "from → to" format', () => {
      const r = makeReplication();

      expect(ReplicationsHelper.getDirectionPairString(r)).toBe(
        'storage-a → storage-b',
      );
    });
  });

  describe('getBucketPairString', () => {
    it('returns bucket pair for BUCKET replication', () => {
      const r = makeReplication({ replicationType: ReplicationType.BUCKET });

      expect(ReplicationsHelper.getBucketPairString(r)).toBe(
        'bucket-a → bucket-b',
      );
    });

    it('returns empty string for USER replication', () => {
      const r = makeReplication({ replicationType: ReplicationType.USER });

      expect(ReplicationsHelper.getBucketPairString(r)).toBe('');
    });
  });
});
