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
import { AxiosError } from 'axios';
import { ErrorHelper } from '@/utils/helpers/ErrorHelper';

function makeAxiosError(responseData?: unknown, status?: number): AxiosError {
  const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');

  error.response = {
    data: responseData ?? {},
    status: status ?? 400,
    statusText: 'Bad Request',
    headers: {},
    config: { headers: {} } as never,
  };

  if (status) {
    error.status = status;
  }

  return error;
}

describe('ErrorHelper', () => {
  describe('getReason', () => {
    it('returns null for non-axios errors', () => {
      expect(ErrorHelper.getReason(new Error('fail'))).toBeNull();
    });

    it('returns "name - message" when details is not an array', () => {
      const error = makeAxiosError({ message: 'bad' });

      expect(ErrorHelper.getReason(error)).toBe(
        `${error.name} - ${error.message}`,
      );
    });

    it('returns reason from Google RPC ErrorInfo', () => {
      const error = makeAxiosError({
        details: [
          {
            '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
            reason: 'STORAGE_NOT_FOUND',
          },
        ],
      });

      expect(ErrorHelper.getReason(error)).toBe('STORAGE_NOT_FOUND');
    });

    it('returns undefined when ErrorInfo detail is absent', () => {
      const error = makeAxiosError({
        details: [{ '@type': 'some.other.Type' }],
      });

      expect(ErrorHelper.getReason(error)).toBeUndefined();
    });
  });

  describe('getStatusCode', () => {
    it('returns null for non-axios errors', () => {
      expect(ErrorHelper.getStatusCode(new Error('fail'))).toBeNull();
    });

    it('returns status code from axios error', () => {
      const error = makeAxiosError({}, 404);

      expect(ErrorHelper.getStatusCode(error)).toBe(404);
    });
  });

  describe('getValidationErrorMessage', () => {
    it('returns empty string when no errors', () => {
      expect(ErrorHelper.getValidationErrorMessage({ $errors: [] })).toBe('');
    });

    it('returns first error message', () => {
      const field = {
        $errors: [{ $message: 'Field is required' }],
      };

      expect(ErrorHelper.getValidationErrorMessage(field)).toBe(
        'Field is required',
      );
    });

    it('returns fallback when message is falsy', () => {
      const field = { $errors: [{ $message: '' }] };

      expect(
        ErrorHelper.getValidationErrorMessage(field, 'Unknown error'),
      ).toBe('Unknown error');
    });
  });
});
