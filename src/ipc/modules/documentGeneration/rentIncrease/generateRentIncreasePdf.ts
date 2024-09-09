import path from 'path';
import { directories } from '../../../utils/persistence/directories';
import { GenerateRentIncreasePdfArgs } from './GenerateRentIncreasePdfArgs';
import { generateRentIncreaseMarkdown } from './generateRentIncreaseMarkdown';
import { uploadMarkdownAsPdf } from '_/ipc/utils/persistence/uploadMarkdownAsPdf/uploadMarkdownAsPdf';
import Imported from '_/types/Imported';

/**
 * Generates the rent increase notification with the provided arguments and uploads it to the app data
 * @returns id of the generated document
 */
export function generateRentIncreasePdf(
  args: Imported<GenerateRentIncreasePdfArgs>,
) {
  return uploadMarkdownAsPdf({
    markdownContent: generateRentIncreaseMarkdown(args),
    target: {
      type: 'resident',
      residentId: args.resident.id,
    },
    mdToPdfOptions: {
      cssFiles: [
        path.join(directories.assets(), 'templates/rentIncrease/style.css'),
      ],
    },
  });
}
