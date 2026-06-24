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
    diffReportTitle: 'Diff Reports',
    columnBucket: 'Buckets Pair',
    columnDirection: 'Direction',
    columnProgress: 'Progress',
    columnStatus: 'Status',
    columnConfigs: 'Configs',
    columnVersioned: 'Versioned',
    columnActions: 'Actions',
    columnEtags: 'ETags',
    columnSizes: 'Sizes',
    statusChecking: 'Checking',
    statusConsistent: 'Consistent',
    statusInconsistent: 'Inconsistent',
    configVersioned: 'Versioned',
    configNotVersioned: 'Not versioned',
    configIgnoresEtags: 'Ignores ETags',
    configNotIgnoresEtags: 'Considers ETags',
    configIgnoresSizes: 'Ignores Sizes',
    configNotIgnoresSizes: 'Considers Sizes',
    diffReportFrom: 'the source of comparison',
    diffReportTo: 'comparison destination',
    diffReportStatusDetails: 'Diff Report Status Details',
    cliCheckWarning:
      'This check across more than two locations ({locations}) was created via CLI. For further details or actions, please use the CLI.',
    filterByDirectionPlaceholder: 'Filter by direction',
    filterByBucketPlaceholder: 'Filter by bucket',
    filterByStatusPlaceholder: 'Filter by status',
    filterStatusChecking: 'Checking',
    filterStatusConsistent: 'Consistent',
    filterStatusInconsistent: 'Inconsistent',
    noResultsTitle: 'No Diff Reports yet',
    noResultsText: 'There are no diff reports available at the moment.',
    errorTitle: 'Error',
    errorText:
      'An error occurred while getting the diff report list.\nPlease try one more time.',
    errorAction: 'Retry',

    deleteSuccessTitle: 'Deleted!',
    deleteSuccessContent: 'The following diff report has been deleted:',
    deleteErrorTitle: 'Deletion failed!',
    deleteErrorContent:
      'An error occurred when deleting the following diff report:',
    deleteErrorAction: 'Retry',
    deletionConfirmTitle: 'Delete Diff Report',
    deletionConfirmContent:
      'You are about to delete the following Diff Report:',
    deletionConfirmQuestion: 'Are you sure you want to proceed?',
    deletionConfirmAction: 'Delete Diff Report',
    actionDelete: 'Delete',
    deleteCancelAction: 'Cancel',

    actionDeleteSelected: 'Delete {total} selected',
    actionSelectedDeleteTitle: 'Delete Diff Reports',
    actionSelectedDeleteContent:
      'You are about to delete the following Diff Reports:',
    actionSelectedDeleteQuestion: 'Are you sure you want to proceed?',
    deleteSelectedSuccessTitle: 'Deleted!',
    deleteSelectedSuccessContent:
      'The following {total} diff reports have been deleted:',
    deleteSelectedErrorTitle: 'Deletion failed!',
    deleteSelectedErrorContent:
      'An error occurred while deleting the following {total} diff reports:',
    deleteSelectedErrorAction: 'Retry',
  },
  [I18nLocale.DE]: {
    diffReportTitle: 'Diff-Reports',
    columnBucket: 'Bucket Paare',
    columnDirection: 'Richtung',
    columnProgress: 'Fortschritt',
    columnStatus: 'Status',
    columnConfigs: 'Konfigurationen',
    columnVersioned: 'Versioniert',
    columnEtags: 'ETags',
    columnSizes: 'Dateigrößen',
    columnActions: 'Actions',
    statusChecking: 'Prüfung läuft',
    statusConsistent: 'Konsistent',
    statusInconsistent: 'Inkonsistent',
    configVersioned: 'Versioniert',
    configNotVersioned: 'Nicht versioniert',
    configIgnoresEtags: 'Ignoriert ETags',
    configNotIgnoresEtags: 'Ignoriert ETags nicht',
    configIgnoresSizes: 'Ignoriert Dateigrößen',
    configNotIgnoresSizes: 'Ignoriert Dateigrößen nicht',
    diffReportFrom: 'Quelle des Vergleichs',
    diffReportTo: 'Vergleichsziel',
    diffReportStatusDetails: 'Diff Report Status Details',
    cliCheckWarning:
      'Dieser Check für mehr als zwei Lokationen ({locations}) wurde über die CLI erstellt. Für weitere Details oder Aktionen verwenden Sie bitte die CLI.',
    filterByDirectionPlaceholder: 'Nach Richtung filtern',
    filterByBucketPlaceholder: 'Nach Bucket filtern',
    filterByStatusPlaceholder: 'Nach Status filtern',
    filterStatusChecking: 'Prüfung läuft',
    filterStatusConsistent: 'Konsistent',
    filterStatusInconsistent: 'Inkonsistent',
    noResultsTitle: 'Noch keine Diff-Reports',
    noResultsText: 'Derzeit sind keine Diff-Reports verfügbar.',
    errorTitle: 'Fehler',
    errorText:
      'Beim Abrufen der Diff-Report-Liste ist ein Fehler aufgetreten.\nBitte versuchen Sie es erneut.',
    errorAction: 'Erneut versuchen',

    deleteSuccessTitle: 'Gelöscht!',
    deleteSuccessContent: 'Der folgende Diff-Report wurde gelöscht:',
    deleteErrorTitle: 'Löschen fehlgeschlagen!',
    deleteErrorContent:
      'Beim Löschen des folgenden Diff-Reports ist ein Fehler aufgetreten:',
    deleteErrorAction: 'Erneut versuchen',
    deletionConfirmTitle: 'Diff-Report löschen',
    deletionConfirmContent:
      'Sie sind dabei, den folgenden Diff-Report zu löschen:',
    deletionConfirmQuestion: 'Sind Sie sicher, dass Sie fortfahren möchten?',
    deletionConfirmAction: 'Diff-Report löschen',
    actionDelete: 'Löschen',
    deleteCancelAction: 'Abbrechen',

    actionDeleteSelected: '{total} ausgewählte löschen',
    actionSelectedDeleteTitle: 'Diff-Reports löschen',
    actionSelectedDeleteContent:
      'Sie sind dabei, die folgenden Diff-Reports zu löschen:',
    actionSelectedDeleteQuestion:
      'Sind Sie sicher, dass Sie fortfahren möchten?',
    deleteSelectedSuccessTitle: 'Gelöscht!',
    deleteSelectedSuccessContent:
      'Die folgenden {total} Diff-Reports wurden gelöscht:',
    deleteSelectedErrorTitle: 'Löschen fehlgeschlagen!',
    deleteSelectedErrorContent:
      'Beim Löschen der folgenden {total} Diff-Reports ist ein Fehler aufgetreten:',
    deleteSelectedErrorAction: 'Erneut versuchen',
  },
};
