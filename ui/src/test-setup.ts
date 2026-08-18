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

import { vi, afterEach } from 'vitest';

// jsdom stubs: matchMedia + localStorage
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const localStorageMap = new Map<string, string>();

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: {
    getItem: (key: string) => localStorageMap.get(key) ?? null,
    setItem: (key: string, value: string) => localStorageMap.set(key, value),
    removeItem: (key: string) => localStorageMap.delete(key),
    clear: () => localStorageMap.clear(),
    get length() {
      return localStorageMap.size;
    },
    key: () => null,
  },
});

afterEach(() => {
  localStorageMap.clear();
});

vi.mock('@/http/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    request: vi.fn(),
  },
}));

vi.mock('@/i18n', () => ({
  i18n: {
    global: {
      locale: { value: 'en' },
      fallbackLocale: { value: 'en' },
    },
  },
}));

let notificationIdCounter = 0;

vi.mock('@clyso/clyso-ui-kit', () => ({
  I18nLocale: { EN: 'en', DE: 'de' },
  I18N_DEFAULT_LOCALE: 'en',
  ColorScheme: { DARK: 'DARK', LIGHT: 'LIGHT' },
  useNotification: vi.fn(() => ({
    createNotification: vi.fn(() => ({
      value: { id: `notif-${++notificationIdCounter}` },
    })),
    removeNotification: vi.fn(),
  })),
}));

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    query: {},
    params: {},
    path: '/',
    name: '',
  })),
}));

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: { value: 'en' },
  })),
}));
