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

import { describe, it, expect, vi } from 'vitest';
import { ApiHelper } from '@/utils/helpers/ApiHelper';
import { ApiVersion } from '@/utils/types/api';

vi.mock('@/utils/constants/env', () => ({
  API_BASE_URL: 'http://localhost:9671',
  API_PREFIX: '/api/v1',
}));

describe('ApiHelper', () => {
  describe('getChorusAPIUrl', () => {
    it('constructs URL from base, prefix, and resource path', () => {
      expect(ApiHelper.getChorusAPIUrl('/storages')).toBe(
        'http://localhost:9671/api/v1/storages',
      );
    });
  });

  describe('getPrometheusAPIUrl', () => {
    it('constructs prometheus URL with default version', () => {
      expect(ApiHelper.getPrometheusAPIUrl('/query_range')).toBe(
        'http://localhost:9671/prometheus/api/v1beta1/query_range',
      );
    });

    it('accepts custom API version', () => {
      expect(ApiHelper.getPrometheusAPIUrl('/query', ApiVersion.V1)).toBe(
        'http://localhost:9671/prometheus/api/v1/query',
      );
    });
  });
});
