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

import useVuelidate from '@vuelidate/core';
import { defineStore } from 'pinia';
import { computed, reactive, toRefs } from 'vue';
import { helpers } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import {
  StorageProvider,
  type ChorusStorage,
  type UserCredentialSetRequest,
} from '@/utils/types/chorus';
import { ChorusService } from '@/services/ChorusService';
import { ErrorHelper } from '@/utils/helpers/ErrorHelper';
import i18nSetCredential from '@/components/chorus/set-credential/i18nSetCredential';

interface ChorusSetCredentialState {
  isLoading: boolean;
  hasError: boolean;
  isSubmitting: boolean;
  isConfirmDialogOpen: boolean;
  storage: ChorusStorage | null;
  isEditMode: boolean;

  // Common
  user: string;

  // S3
  accessKey: string;
  secretKey: string;

  // Swift
  username: string;
  password: string;
  domainName: string;
  tenantName: string;
}

function getInitialState(): ChorusSetCredentialState {
  return {
    isLoading: false,
    hasError: false,
    isSubmitting: false,
    isConfirmDialogOpen: false,
    storage: null,
    isEditMode: false,

    user: '',

    accessKey: '',
    secretKey: '',

    username: '',
    password: '',
    domainName: '',
    tenantName: '',
  };
}

export const useChorusSetCredentialStore = defineStore(
  'chorusSetCredential',
  () => {
    const state = reactive<ChorusSetCredentialState>(getInitialState());

    const { t } = useI18n({
      messages: i18nSetCredential,
    });

    const isS3 = computed(() => state.storage?.provider === StorageProvider.S3);

    const isSwift = computed(
      () => state.storage?.provider === StorageProvider.SWIFT,
    );

    async function initSetCredentialPage(storageName: string, alias?: string) {
      state.isLoading = true;
      state.hasError = false;

      try {
        const { storages } = await ChorusService.getStorages();

        state.storage =
          storages.find(({ name }) => storageName === name) ?? null;

        if (state.storage && alias) {
          state.isEditMode = true;
          state.user = alias;
        }
      } catch {
        state.hasError = true;
      } finally {
        state.isLoading = false;
      }
    }

    const requiredString = (value: string) => !!value.trim();

    const s3ValidationRules = computed(() => ({
      user: {
        required: helpers.withMessage(
          t('validationUserRequired'),
          requiredString,
        ),
      },
      accessKey: {
        required: helpers.withMessage(
          t('validationAccessKeyRequired'),
          requiredString,
        ),
      },
      secretKey: {
        required: helpers.withMessage(
          t('validationSecretKeyRequired'),
          requiredString,
        ),
      },
    }));

    const swiftValidationRules = computed(() => ({
      user: {
        required: helpers.withMessage(
          t('validationUserRequired'),
          requiredString,
        ),
      },
      username: {
        required: helpers.withMessage(
          t('validationUsernameRequired'),
          requiredString,
        ),
      },
      password: {
        required: helpers.withMessage(
          t('validationPasswordRequired'),
          requiredString,
        ),
      },
      domainName: {
        required: helpers.withMessage(
          t('validationDomainNameRequired'),
          requiredString,
        ),
      },
      tenantName: {
        required: helpers.withMessage(
          t('validationTenantNameRequired'),
          requiredString,
        ),
      },
    }));

    const validationRules = computed(() =>
      isSwift.value ? swiftValidationRules.value : s3ValidationRules.value,
    );

    const validator = useVuelidate(validationRules, state);

    async function submitCredential() {
      if (!state.storage) return;

      const payload: UserCredentialSetRequest = {
        storage: state.storage.name,
        user: state.user,
      };

      if (isS3.value) {
        payload.s3Cred = {
          accessKey: state.accessKey,
          secretKey: state.secretKey,
        };
      } else {
        payload.swiftCred = {
          username: state.username,
          password: state.password,
          domainName: state.domainName,
          tenantName: state.tenantName,
        };
      }

      try {
        state.isSubmitting = true;
        await ChorusService.setUserCredential(payload);
      } catch (error: unknown) {
        const reason =
          ErrorHelper.getReason(error) || t('submitCredentialErrorUnknown');

        throw new Error(reason);
      } finally {
        state.isSubmitting = false;
      }
    }

    async function $reset() {
      Object.assign(state, getInitialState());
      validator.value.$reset();
    }

    return {
      ...toRefs(state),
      isS3,
      isSwift,
      initSetCredentialPage,
      submitCredential,
      validator,
      $reset,
    };
  },
);
