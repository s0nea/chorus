<!--
  - Copyright © 2026 Clyso GmbH
  -
  -  Licensed under the GNU Affero General Public License, Version 3.0 (the "License");
  -  you may not use this file except in compliance with the License.
  -  You may obtain a copy of the License at
  -
  -  https://www.gnu.org/licenses/agpl-3.0.html
  -
  -  Unless required by applicable law or agreed to in writing, software
  -  distributed under the License is distributed on an "AS IS" BASIS,
  -  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  -  See the License for the specific language governing permissions and
  -  limitations under the License.
  -->

<script setup lang="ts">
  import { CTile, CButton, CInput, CFormField } from '@clyso/clyso-ui-kit';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  import { computed } from 'vue';
  import i18nSetCredential from '../i18nSetCredential';
  import SetCredentialConfirmDialog from '../SetCredentialConfirmDialog/SetCredentialConfirmDialog.vue';
  import { useChorusSetCredentialStore } from '@/stores/chorusSetCredentialStore';

  defineProps<{
    isEditMode: boolean;
  }>();

  const {
    isS3,
    isSwift,
    user,
    accessKey,
    secretKey,
    username,
    password,
    domainName,
    tenantName,
    isConfirmDialogOpen,
    isSubmitting,
    validator,
  } = storeToRefs(useChorusSetCredentialStore());

  const { t } = useI18n({
    messages: i18nSetCredential,
  });

  const userErrorMessage = computed(() => {
    const errors = validator.value.user?.$errors;

    return errors?.length ? errors[0]?.$message : '';
  });

  const accessKeyErrorMessage = computed(() => {
    const errors = validator.value.accessKey?.$errors;

    return errors?.length ? errors[0].$message : '';
  });

  const secretKeyErrorMessage = computed(() => {
    const errors = validator.value.secretKey?.$errors;

    return errors?.length ? errors[0].$message : '';
  });

  const usernameErrorMessage = computed(() => {
    const errors = validator.value.username?.$errors;

    return errors?.length ? errors[0].$message : '';
  });

  const passwordErrorMessage = computed(() => {
    const errors = validator.value.password?.$errors;

    return errors?.length ? errors[0].$message : '';
  });

  const domainNameErrorMessage = computed(() => {
    const errors = validator.value.domainName?.$errors;

    return errors?.length ? errors[0].$message : '';
  });

  const tenantNameErrorMessage = computed(() => {
    const errors = validator.value.tenantName?.$errors;

    return errors?.length ? errors[0].$message : '';
  });

  async function openConfirmDialog() {
    validator.value.$touch();

    const isValid = await validator.value.$validate();

    if (isValid) {
      isConfirmDialogOpen.value = true;
    }
  }
</script>

<template>
  <CTile class="credential-form-tile">
    <template #title>
      {{
        isEditMode ? t('setCredentialTitleEdit') : t('setCredentialTitleAdd')
      }}
    </template>
    <template #header>
      {{ t('setCredentialHeader') }}
    </template>
    <div class="credential-form-tile__content">
      <CFormField
        field-id="credential-user-input"
        :has-error="validator.user?.$error"
      >
        <template #label>
          {{ t('fieldUserLabel') }}
        </template>

        <template #default="{ hasError, fieldId }">
          <CInput
            :id="fieldId"
            v-model:value="user"
            :placeholder="t('fieldUserPlaceholder')"
            :has-error="hasError"
            :readonly="isEditMode"
            @blur="validator.user?.$touch()"
          />
        </template>

        <template #errors>
          <template v-if="validator.user?.$error">
            {{ userErrorMessage }}
          </template>
        </template>
      </CFormField>

      <!-- S3 Fields -->
      <template v-if="isS3">
        <CFormField
          field-id="credential-access-key-input"
          :has-error="validator.accessKey?.$error"
        >
          <template #label>
            {{ t('fieldAccessKeyLabel') }}
          </template>

          <template #default="{ hasError, fieldId }">
            <CInput
              :id="fieldId"
              v-model:value="accessKey"
              :placeholder="t('fieldAccessKeyPlaceholder')"
              :has-error="hasError"
              @blur="validator.accessKey?.$touch()"
            />
          </template>

          <template #errors>
            <template v-if="validator.accessKey?.$error">
              {{ accessKeyErrorMessage }}
            </template>
          </template>
        </CFormField>

        <CFormField
          field-id="credential-secret-key-input"
          :has-error="validator.secretKey?.$error"
        >
          <template #label>
            {{ t('fieldSecretKeyLabel') }}
          </template>

          <template #default="{ hasError, fieldId }">
            <CInput
              :id="fieldId"
              v-model:value="secretKey"
              :placeholder="t('fieldSecretKeyPlaceholder')"
              :has-error="hasError"
              type="password"
              show-password-on="click"
              @blur="validator.secretKey?.$touch()"
            />
          </template>

          <template #errors>
            <template v-if="validator.secretKey?.$error">
              {{ secretKeyErrorMessage }}
            </template>
          </template>
        </CFormField>
      </template>

      <!-- Swift Fields -->
      <template v-if="isSwift">
        <CFormField
          field-id="credential-username-input"
          :has-error="validator.username?.$error"
        >
          <template #label>
            {{ t('fieldUsernameLabel') }}
          </template>

          <template #default="{ hasError, fieldId }">
            <CInput
              :id="fieldId"
              v-model:value="username"
              :placeholder="t('fieldUsernamePlaceholder')"
              :has-error="hasError"
              @blur="validator.username?.$touch()"
            />
          </template>

          <template #errors>
            <template v-if="validator.username?.$error">
              {{ usernameErrorMessage }}
            </template>
          </template>
        </CFormField>

        <CFormField
          field-id="credential-password-input"
          :has-error="validator.password?.$error"
        >
          <template #label>
            {{ t('fieldPasswordLabel') }}
          </template>

          <template #default="{ hasError, fieldId }">
            <CInput
              :id="fieldId"
              v-model:value="password"
              :placeholder="t('fieldPasswordPlaceholder')"
              :has-error="hasError"
              type="password"
              show-password-on="click"
              @blur="validator.password?.$touch()"
            />
          </template>

          <template #errors>
            <template v-if="validator.password?.$error">
              {{ passwordErrorMessage }}
            </template>
          </template>
        </CFormField>

        <CFormField
          field-id="credential-domain-name-input"
          :has-error="validator.domainName?.$error"
        >
          <template #label>
            {{ t('fieldDomainNameLabel') }}
          </template>

          <template #default="{ hasError, fieldId }">
            <CInput
              :id="fieldId"
              v-model:value="domainName"
              :placeholder="t('fieldDomainNamePlaceholder')"
              :has-error="hasError"
              @blur="validator.domainName?.$touch()"
            />
          </template>

          <template #errors>
            <template v-if="validator.domainName?.$error">
              {{ domainNameErrorMessage }}
            </template>
          </template>
        </CFormField>

        <CFormField
          field-id="credential-tenant-name-input"
          :has-error="validator.tenantName?.$error"
        >
          <template #label>
            {{ t('fieldTenantNameLabel') }}
          </template>

          <template #default="{ hasError, fieldId }">
            <CInput
              :id="fieldId"
              v-model:value="tenantName"
              :placeholder="t('fieldTenantNamePlaceholder')"
              :has-error="hasError"
              @blur="validator.tenantName?.$touch()"
            />
          </template>

          <template #errors>
            <template v-if="validator.tenantName?.$error">
              {{ tenantNameErrorMessage }}
            </template>
          </template>
        </CFormField>
      </template>

      <div class="credential-form-tile__actions">
        <CButton
          type="primary"
          size="large"
          :disabled="isSubmitting"
          @click="openConfirmDialog"
        >
          {{ t('actionSetCredential') }}
        </CButton>
      </div>
    </div>
  </CTile>
  <SetCredentialConfirmDialog v-model:is-shown="isConfirmDialogOpen" />
</template>

<style lang="scss" scoped>
  @use '@/styles/utils' as utils;

  .credential-form-tile {
    &__content {
      display: flex;
      flex-direction: column;
      gap: utils.unit(8);
    }

    &__actions {
      display: flex;
      justify-content: flex-start;
      padding-top: utils.unit(2);
    }
  }
</style>
