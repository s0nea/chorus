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
import { I18nLocale } from '@clyso/clyso-ui-kit';
import { useI18nStore } from '@/stores/i18nStore';
import { i18n } from '@/i18n';
import { LocalStorageItem } from '@/utils/types/localStorage';

describe('i18nStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    i18n.global.locale.value = I18nLocale.EN;
    vi.clearAllMocks();
  });

  describe('setLocale', () => {
    it('updates the i18n locale value', () => {
      const store = useI18nStore();

      store.setLocale(I18nLocale.DE);

      expect(i18n.global.locale.value).toBe('de');
    });

    it('persists locale to localStorage', () => {
      const store = useI18nStore();

      store.setLocale(I18nLocale.DE);

      expect(window.localStorage.getItem(LocalStorageItem.I18N_LOCALE)).toBe(
        'de',
      );
    });
  });

  describe('initLocale', () => {
    it('restores locale from localStorage when valid', () => {
      window.localStorage.setItem(LocalStorageItem.I18N_LOCALE, 'de');
      const store = useI18nStore();

      store.initLocale();

      expect(i18n.global.locale.value).toBe('de');
    });

    it('falls back to default for invalid localStorage value', () => {
      window.localStorage.setItem(LocalStorageItem.I18N_LOCALE, 'invalid');
      const store = useI18nStore();

      store.initLocale();

      expect(i18n.global.locale.value).toBe('en');
    });
  });

  describe('localeList', () => {
    it('returns all I18nLocale enum values', () => {
      const store = useI18nStore();

      expect(store.localeList).toEqual(Object.values(I18nLocale));
    });
  });
});
