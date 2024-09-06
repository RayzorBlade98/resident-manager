import { rm } from 'fs/promises';
import path from 'path';
import { mdToPdfFile } from 'electron-md-to-pdf';
import { v4 as uuid } from 'uuid';
import { DocumentTarget } from '../documentTarget';
import { getTmpDirectory } from '../getAppDataDirectory';
import uploadDocument from '_/ipc/modules/persistence/uploadDocument/uploadDocument';

type UploadMarkdownAsPdfArgs = {
  markdownContent: string;
  target: DocumentTarget;
  mdToPdfOptions?: Partial<{
    cssFiles: string[];
  }>;
};

/**
 * Converts the provided markdown to a pdf file and uploads it to the app data
 * @returns id of the generated document
 */
export async function uploadMarkdownAsPdf(
  args: UploadMarkdownAsPdfArgs,
): Promise<string> {
  const tmpFile = path.join(getTmpDirectory(), getRandomPdfFile().fileName);
  await mdToPdfFile(args.markdownContent, tmpFile, {
    ...args.mdToPdfOptions,
    showdownOptions: {
      simplifiedAutoLink: false,
    },
  });

  const { documentId, fileName } = getRandomPdfFile();
  uploadDocument(tmpFile, fileName, args.target);
  await rm(tmpFile);

  return documentId;
}

function getRandomPdfFile() {
  const documentId = uuid();
  const fileName = `${documentId}.pdf`;
  return { documentId, fileName };
}
