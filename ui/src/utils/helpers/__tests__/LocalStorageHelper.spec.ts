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

import { describe, it, expect, beforeEach } from 'vitest';
import LocalStorageHelper from '@/utils/helpers/LocalStorageHelper';

// localStorage is globally mocked in test-setup.ts

describe('LocalStorageHelper', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('get', () => {
    it('returns null for missing keys', () => {
      expect(LocalStorageHelper.get('nonexistent')).toBeNull();
    });

    it('parses JSON objects', () => {
      window.localStorage.setItem('obj', '{"a":1}');
      expect(LocalStorageHelper.get('obj')).toEqual({ a: 1 });
    });

    it('parses JSON arrays', () => {
      window.localStorage.setItem('arr', '[1,2,3]');
      expect(LocalStorageHelper.get('arr')).toEqual([1, 2, 3]);
    });

    it('parses numeric strings as numbers', () => {
      window.localStorage.setItem('num', '42');
      expect(LocalStorageHelper.get('num')).toBe(42);
    });

    it('returns plain strings as-is', () => {
      window.localStorage.setItem('str', 'hello');
      expect(LocalStorageHelper.get('str')).toBe('hello');
    });

    it('throws on values matching JSON pattern but containing invalid JSON', () => {
      window.localStorage.setItem('bad', '{not-json}');
      expect(() => LocalStorageHelper.get('bad')).toThrow();
    });
  });

  describe('set', () => {
    it('stores strings directly', () => {
      LocalStorageHelper.set('key', 'value');
      expect(window.localStorage.getItem('key')).toBe('value');
    });

    it('serializes objects as JSON', () => {
      LocalStorageHelper.set('key', { a: 1 });
      expect(window.localStorage.getItem('key')).toBe('{"a":1}');
    });

    it('serializes numbers as JSON', () => {
      LocalStorageHelper.set('key', 42);
      expect(window.localStorage.getItem('key')).toBe('42');
    });
  });

  describe('remove', () => {
    it('removes the key from localStorage', () => {
      window.localStorage.setItem('key', 'value');
      LocalStorageHelper.remove('key');
      expect(window.localStorage.getItem('key')).toBeNull();
    });
  });
});
