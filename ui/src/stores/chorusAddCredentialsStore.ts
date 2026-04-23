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
  type UserCredentialsSetRequest,
} from '@/utils/types/chorus';
import { ChorusService } from '@/services/ChorusService';
import { ErrorHelper } from '@/utils/helpers/ErrorHelper';
import i18nAddCredential from '@/components/chorus/add-credential/i18nAddCredential';

interface ChorusAddCredentialState {
  isSubmitting: boolean;
  storageName: string;
  provider: StorageProvider | null;
  isConfirmDialogOpen: boolean;
  user: string;
  accessKey: string;
  secretKey: string;
  username: string;
  password: string;
  domainName: string;
  tenantName: string;
}

function getInitialState(): ChorusAddCredentialState {
  return {
    isSubmitting: false,
    storageName: '',
    provider: null,
    isConfirmDialogOpen: false,
    user: '',
    accessKey: '',
    secretKey: '',
    username: '',
    password: '',
    domainName: '',
    tenantName: '',
  };
}

export const useChorusAddCredentialsStore = defineStore(
  'chorusAddCredential',
  () => {
    const state = reactive<ChorusAddCredentialState>(getInitialState());

    const { t } = useI18n({
      messages: i18nAddCredential,
    });

    const isS3 = computed(() => state.provider === StorageProvider.S3);
    const isSwift = computed(() => state.provider === StorageProvider.SWIFT);

    const validationRules = computed(() => ({
      user: {
        required: helpers.withMessage(
          t('userRequired'),
          (value: string) => !!value.trim(),
        ),
      },
      accessKey: {
        required: helpers.withMessage(
          t('accessKeyRequired'),
          (value: string) => !isS3.value || !!value.trim(),
        ),
      },
      secretKey: {
        required: helpers.withMessage(
          t('secretKeyRequired'),
          (value: string) => !isS3.value || !!value.trim(),
        ),
      },
      username: {
        required: helpers.withMessage(
          t('usernameRequired'),
          (value: string) => !isSwift.value || !!value.trim(),
        ),
      },
      password: {
        required: helpers.withMessage(
          t('passwordRequired'),
          (value: string) => !isSwift.value || !!value.trim(),
        ),
      },
      domainName: {
        required: helpers.withMessage(
          t('domainNameRequired'),
          (value: string) => !isSwift.value || !!value.trim(),
        ),
      },
      tenantName: {
        required: helpers.withMessage(
          t('tenantNameRequired'),
          (value: string) => !isSwift.value || !!value.trim(),
        ),
      },
    }));

    const validator = useVuelidate(validationRules, state);

    function initCredentialForm(
      storageName: string,
      provider: StorageProvider,
      alias?: string,
    ) {
      state.storageName = storageName;
      state.provider = provider;

      if (alias) {
        state.user = alias;
      }
    }

    async function submitCredentials() {
      state.isSubmitting = true;

      try {
        const payload: UserCredentialsSetRequest = {
          storage: state.storageName,
          user: state.user,
        };

        if (isS3.value) {
          payload.s3Cred = {
            accessKey: state.accessKey,
            secretKey: state.secretKey,
          };
        } else if (isSwift.value) {
          payload.swiftCred = {
            username: state.username,
            password: state.password,
            domainName: state.domainName,
            tenantName: state.tenantName,
          };
        }

        await ChorusService.setUserCredentials(payload);
      } catch (error: unknown) {
        const reason = ErrorHelper.getReason(error) || t('submitErrorUnknown');

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
      initCredentialForm,
      submitCredentials,
      validator,
      $reset,
    };
  },
);
