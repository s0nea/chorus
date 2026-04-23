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
    breadcrumbAddCredential: 'Add Credential',
    breadcrumbEditCredential: 'Edit Credential',
    userRequired: 'Please enter a user alias.',
    accessKeyRequired: 'Please enter an access key.',
    secretKeyRequired: 'Please enter a secret key.',
    usernameRequired: 'Please enter a username.',
    passwordRequired: 'Please enter a password.',
    domainNameRequired: 'Please enter a domain name.',
    tenantNameRequired: 'Please enter a tenant name.',
    submitErrorUnknown:
      'An unknown error occurred while saving the credentials.',
  },
  [I18nLocale.DE]: {
    breadcrumbAddCredential: 'Zugangsdaten hinzufügen',
    breadcrumbEditCredential: 'Zugangsdaten bearbeiten',
    userRequired: 'Bitte geben Sie einen Benutzer-Alias ein.',
    accessKeyRequired: 'Bitte geben Sie einen Zugriffsschlüssel ein.',
    secretKeyRequired: 'Bitte geben Sie einen geheimen Schlüssel ein.',
    usernameRequired: 'Bitte geben Sie einen Benutzernamen ein.',
    passwordRequired: 'Bitte geben Sie ein Passwort ein.',
    domainNameRequired: 'Bitte geben Sie einen Domänennamen ein.',
    tenantNameRequired: 'Bitte geben Sie einen Mandantennamen ein.',
    submitErrorUnknown:
      'Beim Speichern der Zugangsdaten ist ein unbekannter Fehler aufgetreten.',
  },
};
