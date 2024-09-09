import { rm } from 'fs/promises';
import path from 'path';
import { mdToPdfFile } from 'electron-md-to-pdf';
import { v4 as uuid } from 'uuid';
import { directories } from '../directories';
import { DocumentTarget } from '../documentTarget';
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
  const tmpFile = path.join(directories.temporary(), `${uuid()}.pdf`);
  await mdToPdfFile(args.markdownContent, tmpFile, {
    ...args.mdToPdfOptions,
    showdownOptions: {
      simplifiedAutoLink: false,
    },
  });

  const documentId = uploadDocument(tmpFile, args.target);
  await rm(tmpFile);

  return documentId;
}
