import { copyFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { DocumentTarget } from './documentTarget';
import getAppDataDirectory from './getAppDataDirectory';

/**
 * Copies the selected file to the documents
 * @param uploadedFile File that should be copied to the documents
 * @param fileName Filename the copied document should have
 * @param target Target to which the document is linked to
 */
function uploadDocument(
  uploadedFile: string,
  fileName: string,
  target: DocumentTarget,
) {
  const destinationDir = path.join(
    getAppDataDirectory(),
    'documents',
    getTargetDirectory(target),
  );

  if (!existsSync(destinationDir)) {
    mkdirSync(destinationDir, { recursive: true });
  }

  const destinationFile = path.join(destinationDir, fileName);

  copyFileSync(uploadedFile, destinationFile);
}

/**
 * Returns the directory for the specified document target
 * @param target target to which the document should be linked
 * @returns target directory
 */
function getTargetDirectory(target: DocumentTarget): string {
  switch (target.type) {
    case 'resident':
      return `residents/${target.residentId}`;
    default:
      const type: never = target.type;
      throw new Error(`Missing case for target type ${type}`);
  }
}

export default uploadDocument;
