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

import { I18nLocale, type I18nMessages } from '@clyso/clyso-ui-kit';

export default <I18nMessages>{
  [I18nLocale.EN]: {
    setCredentialTitleAdd: 'Add Credential',
    setCredentialTitleEdit: 'Edit Credential',
    setCredentialHeader:
      'Provide the credential details for the selected storage.',
    fieldUserLabel: 'User',
    fieldUserPlaceholder: 'Enter user alias',
    fieldAccessKeyLabel: 'Access Key',
    fieldAccessKeyPlaceholder: 'Enter access key',
    fieldSecretKeyLabel: 'Secret Key',
    fieldSecretKeyPlaceholder: 'Enter secret key',
    fieldUsernameLabel: 'Username',
    fieldUsernamePlaceholder: 'Enter username',
    fieldPasswordLabel: 'Password',
    fieldPasswordPlaceholder: 'Enter password',
    fieldDomainNameLabel: 'Domain Name',
    fieldDomainNamePlaceholder: 'Enter domain name',
    fieldTenantNameLabel: 'Tenant Name',
    fieldTenantNamePlaceholder: 'Enter tenant name',
    actionSetCredential: 'Set Credential',
    validationUserRequired: 'User is required',
    validationAccessKeyRequired: 'Access Key is required',
    validationSecretKeyRequired: 'Secret Key is required',
    validationUsernameRequired: 'Username is required',
    validationPasswordRequired: 'Password is required',
    validationDomainNameRequired: 'Domain Name is required',
    validationTenantNameRequired: 'Tenant Name is required',
    confirmSetCredentialTitle: 'Confirm Credential',
    confirmSetCredentialDescription:
      "You're about to set the password for the selected user. Do you want to proceed?",
    confirmSetCredentialPositive: 'Set Credential',
    confirmSetCredentialNegative: 'Cancel',
    setCredentialSuccessTitle: 'Credential set!',
    setCredentialSuccessContent: 'Credential has been set successfully.',
    setCredentialErrorTitle: 'Credential not set!',
    setCredentialErrorContent:
      'An error occurred while setting the credential:',
    setCredentialErrorRetry: 'Retry',
    submitCredentialErrorUnknown: 'Failed to set credential',
    breadcrumbStorages: 'Storages',
    breadcrumbAddCredential: 'Add Credential',
    breadcrumbEditCredential: 'Edit Credential',
  },
  [I18nLocale.DE]: {
    setCredentialTitleAdd: 'Zugangsdaten hinzufügen',
    setCredentialTitleEdit: 'Zugangsdaten bearbeiten',
    setCredentialHeader:
      'Geben Sie die Zugangsdaten für den ausgewählten Speicher ein.',
    fieldUserLabel: 'Benutzer',
    fieldUserPlaceholder: 'Benutzeralias eingeben',
    fieldAccessKeyLabel: 'Zugriffsschlüssel',
    fieldAccessKeyPlaceholder: 'Zugriffsschlüssel eingeben',
    fieldSecretKeyLabel: 'Geheimschlüssel',
    fieldSecretKeyPlaceholder: 'Geheimschlüssel eingeben',
    fieldUsernameLabel: 'Benutzername',
    fieldUsernamePlaceholder: 'Benutzername eingeben',
    fieldPasswordLabel: 'Passwort',
    fieldPasswordPlaceholder: 'Passwort eingeben',
    fieldDomainNameLabel: 'Domainname',
    fieldDomainNamePlaceholder: 'Domainname eingeben',
    fieldTenantNameLabel: 'Mandantenname',
    fieldTenantNamePlaceholder: 'Mandantenname eingeben',
    actionSetCredential: 'Zugangsdaten setzen',
    validationUserRequired: 'Benutzer ist erforderlich',
    validationAccessKeyRequired: 'Zugriffsschlüssel ist erforderlich',
    validationSecretKeyRequired: 'Geheimschlüssel ist erforderlich',
    validationUsernameRequired: 'Benutzername ist erforderlich',
    validationPasswordRequired: 'Passwort ist erforderlich',
    validationDomainNameRequired: 'Domainname ist erforderlich',
    validationTenantNameRequired: 'Mandantenname ist erforderlich',
    confirmSetCredentialTitle: 'Zugangsdaten bestätigen',
    confirmSetCredentialDescription:
      'Sie sind dabei, das Passwort für den ausgewählten Benutzer zu setzen. Möchten Sie fortfahren?',
    confirmSetCredentialPositive: 'Zugangsdaten setzen',
    confirmSetCredentialNegative: 'Abbrechen',
    setCredentialSuccessTitle: 'Zugangsdaten gesetzt!',
    setCredentialSuccessContent: 'Zugangsdaten wurden erfolgreich gesetzt.',
    setCredentialErrorTitle: 'Zugangsdaten nicht gesetzt!',
    setCredentialErrorContent:
      'Beim Setzen der Zugangsdaten ist ein Fehler aufgetreten:',
    setCredentialErrorRetry: 'Erneut versuchen',
    submitCredentialErrorUnknown: 'Zugangsdaten konnten nicht gesetzt werden',
    breadcrumbStorages: 'Speicher',
    breadcrumbAddCredential: 'Zugangsdaten hinzufügen',
    breadcrumbEditCredential: 'Zugangsdaten bearbeiten',
  },
};
