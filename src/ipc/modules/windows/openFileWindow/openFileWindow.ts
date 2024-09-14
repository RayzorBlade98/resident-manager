import { readdir } from 'fs/promises';
import path from 'path';
import { createFileWindow } from '../../../../electron/windows';
import { directories } from '../../../utils/persistence/directories';
import { DocumentTarget } from '_/ipc/utils/persistence/documentTarget';

/**
 * Opens a new application window that displays the specified document
 * @param documentId Id of the document that should be displayed
 * @param target Target to which the document is linked to
 */
export async function openDocumentWindow(
  documentId: string,
  target: DocumentTarget,
) {
  const targetDir = directories.documents(target);
  const files = await readdir(targetDir);
  const targetFile = files.find((f) => f.startsWith(documentId));

  if (!targetFile) {
    return;
  }

  createFileWindow(path.join(targetDir, targetFile));
}
