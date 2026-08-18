# Testing Strategy

Unit testing guide for the Chorus UI project.

## Quick Start

```bash
# Run all tests
yarn test:unit

# Run tests in watch mode
yarn test:unit --watch

# Run a specific test file
yarn test:unit src/utils/helpers/__tests__/ReplicationsHelper.spec.ts

# Run tests with coverage
yarn test:coverage
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Vitest](https://vitest.dev/) | Test runner |
| [@vue/test-utils](https://test-utils.vuejs.org/) | Vue component mounting |
| [jsdom](https://github.com/jsdom/jsdom) | DOM environment |
| [@pinia/testing](https://pinia.vuejs.org/cookbook/testing.html) | Store testing |

## File Conventions

Tests live next to the code they test, inside a `__tests__` directory:

```
src/
  utils/helpers/
    ReplicationsHelper.ts
    __tests__/
      ReplicationsHelper.spec.ts
  stores/
    chorusStoragesStore.ts
    __tests__/
      chorusStoragesStore.spec.ts
  components/chorus/common/ChorusWizard/
    ChorusWizard.vue
    __tests__/
      ChorusWizard.spec.ts
```

File naming: `<ModuleName>.spec.ts`

## What to Test

### Helpers (pure functions)

Test inputs and outputs directly. No framework setup needed.

```typescript
import { describe, it, expect } from 'vitest'
import { ReplicationsHelper } from '@/utils/helpers/ReplicationsHelper'

describe('ReplicationsHelper', () => {
  describe('getDirectionPairString', () => {
    it('formats direction as "from > to"', () => {
      const replication = { from: 'storage-a', to: 'storage-b' } as ChorusReplication
      expect(ReplicationsHelper.getDirectionPairString(replication)).toBe('storage-a → storage-b')
    })
  })
})
```

### Composables

Simple composables (no lifecycle hooks): call directly, assert returned values.

Complex composables (use `useRouter`, lifecycle hooks, provide/inject): wrap in a host component.

```typescript
import { describe, it, expect } from 'vitest'
import { useChorusNotification } from '@/utils/composables/useChorusNotification'

// useNotification from @clyso/clyso-ui-kit is globally mocked in test-setup.ts

describe('useChorusNotification', () => {
  it('tracks active notification IDs', () => {
    const { createNotification, activeNotificationIds } = useChorusNotification()
    createNotification({ /* config */ })
    expect(activeNotificationIds.value).toHaveLength(1)
  })
})
```

### Stores

Use `@pinia/testing` and mock the HTTP layer (apiClient). Call real service methods — only the network call is intercepted.

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChorusStoragesStore } from '@/stores/chorusStoragesStore'
import apiClient from '@/http/apiClient'

// apiClient is globally mocked in test-setup.ts

describe('chorusStoragesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('populates storages from API', async () => {
    const mockStorages = [{ name: 'main', ... }, { name: 'follower', ... }]
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { storages: mockStorages } })

    const store = useChorusStoragesStore()
    await store.initStorages()

    expect(store.storages).toEqual(mockStorages)
    expect(store.isLoading).toBe(false)
  })

  it('sets error state on API failure', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'))

    const store = useChorusStoragesStore()
    await store.initStorages()

    expect(store.hasError).toBe(true)
  })
})
```

### Components

Pre-populate stores with test data. No HTTP mocking needed — the store is already in the desired state.

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ChorusWizard from '@/components/chorus/common/ChorusWizard/ChorusWizard.vue'

describe('ChorusWizard', () => {
  it('emits submit on last step', async () => {
    const wrapper = mount(ChorusWizard, {
      props: {
        steps: [{ name: 'step1' }, { name: 'step2' }],
        currentStep: 1,  // last step (0-indexed)
      },
      global: {
        plugins: [createTestingPinia()],
      },
    })

    await wrapper.find('[data-testid="wizard-submit"]').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})
```

## Mocking Rules

### Global mocks (test-setup.ts)

These are mocked once in `src/test-setup.ts` and available in every test — no inline `vi.mock` needed:

- `@/http/apiClient` — all HTTP methods (`get`, `post`, `put`, `patch`, `delete`, `request`)
- `@/i18n` — minimal i18n instance with `locale: 'en'`
- `vue-router` — `useRouter` (with `push`, `replace`, `back`) and `useRoute`
- `vue-i18n` — `useI18n` (with `t` passthrough and `locale: 'en'`)
- `@clyso/clyso-ui-kit` — `I18nLocale`, `I18N_DEFAULT_LOCALE`, `ColorScheme`, `useNotification`
- `window.matchMedia` — stub returning `matches: false`
- `window.localStorage` — in-memory `Map`-backed stub

### DO mock

- **HTTP layer**: `vi.mock('@/http/apiClient')` — intercepts all API calls
- **Browser APIs**: `localStorage`, `navigator.clipboard`, etc.
- **Third-party composables**: `useNotification` from clyso-ui-kit (composable, not component)
- **Timers**: `vi.useFakeTimers()` when testing debounced/throttled behavior

### DON'T mock

- **Vue framework**: `ref`, `computed`, `watch`, lifecycle hooks
- **Clyso UI Kit components**: `CButton`, `CInput`, etc. — render them for real
- **Service classes**: `ChorusService`, `PrometheusService` — let them run, mock the HTTP layer underneath
- **Own models/types/interfaces**: use real objects
- **Simple utilities**: `GeneralHelper.formatBytes`, etc. — too trivial to mock, and they're under test themselves

## Testing Behaviors, Not Internals

Focus on what the code **does**, not how it does it:

- **Good**: "when the user clicks delete, the item is removed from the list"
- **Bad**: "the `handleDelete` method calls `splice` on the internal array"

- **Good**: "submitting with an empty name shows a validation error"
- **Bad**: "the `validationRules` computed property contains a `required` rule for `name`"

- **Good**: "after fetching, the store contains the API response data"
- **Bad**: "the store calls `apiClient.get` with URL `/api/v1/storages`"

## Adding a New Test

1. Create `__tests__/<ModuleName>.spec.ts` next to the module
2. Follow the pattern for the module type (helper / composable / store / component) shown above
3. Run `yarn test:unit` to verify
4. The test is automatically picked up by vitest — no registration needed

## What NOT to Test

- Polling mechanics (`setTimeout` cycles) — test the fetch logic only
- Vuelidate internals — test through store actions (valid input succeeds, invalid input stops)
- Pure layout components with no logic
- Framework behavior (Vue reactivity, router navigation guards working)
- Lodash/date-fns functions we re-export without wrapping
