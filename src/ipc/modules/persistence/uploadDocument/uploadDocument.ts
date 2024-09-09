import { copyFileSync } from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { directories } from '../../../utils/persistence/directories';
import { DocumentTarget } from '../../../utils/persistence/documentTarget';

/**
 * Copies the selected file to the documents
 * @param uploadedFile File that should be copied to the documents
 * @param fileName Filename the copied document should have
 * @param target Target to which the document is linked to
 * @returns id of the uploaded file
 */
function uploadDocument(uploadedFile: string, target: DocumentTarget): string {
  const documentId = uuid();
  const fileEnding = uploadedFile.split('.').pop();
  const destinationFile = path.join(
    directories.documents(target),
    `${documentId}.${fileEnding}`,
  );

  copyFileSync(uploadedFile, destinationFile);

  return documentId;
}

export default uploadDocument;
