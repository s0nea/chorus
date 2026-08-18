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
import { setActivePinia, createPinia } from 'pinia';
import { ColorScheme } from '@clyso/clyso-ui-kit';
import { useColorSchemeStore } from '@/stores/colorSchemeStore';
import { LocalStorageItem } from '@/utils/types/localStorage';

describe('colorSchemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    document.body.classList.remove('color-scheme-dark');
    vi.clearAllMocks();
  });

  describe('setColorScheme', () => {
    it('updates colorScheme and persists to localStorage', () => {
      const store = useColorSchemeStore();

      store.setColorScheme(ColorScheme.DARK);

      expect(store.colorScheme).toBe('DARK');
      expect(window.localStorage.getItem(LocalStorageItem.COLOR_SCHEME)).toBe(
        'DARK',
      );
    });

    it('adds dark class to body for dark scheme', () => {
      const store = useColorSchemeStore();

      store.setColorScheme(ColorScheme.DARK);

      expect(document.body.classList.contains('color-scheme-dark')).toBe(true);
    });

    it('removes dark class for light scheme', () => {
      const store = useColorSchemeStore();

      store.setColorScheme(ColorScheme.DARK);

      store.setColorScheme(ColorScheme.LIGHT);

      expect(document.body.classList.contains('color-scheme-dark')).toBe(false);
    });

    it('preserves current scheme when setting the same value', () => {
      const store = useColorSchemeStore();

      store.setColorScheme(ColorScheme.DARK);
      store.setColorScheme(ColorScheme.DARK);

      expect(store.colorScheme).toBe('DARK');
      expect(document.body.classList.contains('color-scheme-dark')).toBe(true);
    });
  });

  describe('setIsDark', () => {
    it('sets dark scheme when true', () => {
      const store = useColorSchemeStore();

      store.setIsDark(true);

      expect(store.colorScheme).toBe('DARK');
    });

    it('sets light scheme when false', () => {
      const store = useColorSchemeStore();

      store.setIsDark(false);

      expect(store.colorScheme).toBe('LIGHT');
    });
  });

  describe('isDark', () => {
    it('returns true when scheme is dark', () => {
      const store = useColorSchemeStore();

      store.setColorScheme(ColorScheme.DARK);

      expect(store.isDark).toBe(true);
    });

    it('returns false when scheme is light', () => {
      const store = useColorSchemeStore();

      store.setColorScheme(ColorScheme.LIGHT);

      expect(store.isDark).toBe(false);
    });
  });

  describe('initColorScheme', () => {
    it('restores scheme from localStorage when valid', () => {
      window.localStorage.setItem(LocalStorageItem.COLOR_SCHEME, 'DARK');
      const store = useColorSchemeStore();

      store.initColorScheme();

      expect(store.colorScheme).toBe('DARK');
    });

    it('uses default when localStorage is empty', () => {
      const store = useColorSchemeStore();

      store.initColorScheme(ColorScheme.LIGHT);

      expect(store.colorScheme).toBe('LIGHT');
    });
  });
});
