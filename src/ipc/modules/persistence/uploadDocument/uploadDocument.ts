import { copyFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { DocumentTarget } from '../../../utils/persistence/documentTarget';
import getAppDataDirectory from '../../../utils/persistence/getAppDataDirectory';

/**
 * Copies the selected file to the documents
 * @param uploadedFile File that should be copied to the documents
 * @param fileName Filename the copied document should have
 * @param target Target to which the document is linked to
 * @returns id of the uploaded file
 */
function uploadDocument(uploadedFile: string, target: DocumentTarget): string {
  const destinationDir = path.join(
    getAppDataDirectory(),
    'documents',
    getTargetDirectory(target),
  );

  if (!existsSync(destinationDir)) {
    mkdirSync(destinationDir, { recursive: true });
  }

  const documentId = uuid();
  const fileEnding = uploadedFile.split('.').pop();
  const destinationFile = path.join(
    destinationDir,
    `${documentId}.${fileEnding}`,
  );

  copyFileSync(uploadedFile, destinationFile);

  return documentId;
}

/**
 * Returns the directory for the specified document target
 * @param target target to which the document should be linked
 * @returns target directory
 */
function getTargetDirectory(target: DocumentTarget): string {
  const type = target.type;
  switch (type) {
    case 'resident':
      return `residents/${target.residentId}`;
    case 'incidentals':
      return `incidentals/${target.incidentalsId}`;
    default:
      const typeNever: never = type;
      throw new Error(`Missing case for target type ${typeNever}`);
  }
}

export default uploadDocument;
