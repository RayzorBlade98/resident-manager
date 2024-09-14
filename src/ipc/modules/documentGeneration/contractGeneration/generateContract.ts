import path from 'path';
import { directories } from '../../../utils/persistence/directories';
import {
  ContractGenerationArgs,
  generateContractMarkdown,
} from './generateContractMarkdown';
import { uploadMarkdownAsPdf } from '_/ipc/utils/persistence/uploadMarkdownAsPdf/uploadMarkdownAsPdf';
import Imported from '_/types/Imported';

/**
 * Generates the contract with the provided arguments and uploads it to the app data
 * @returns id of the generated document
 */
async function generateContract(
  args: Imported<ContractGenerationArgs>,
): Promise<string> {
  return uploadMarkdownAsPdf({
    markdownContent: generateContractMarkdown(args),
    target: {
      type: 'resident',
      residentId: args.resident.id,
    },
    mdToPdfOptions: {
      cssFiles: [
        path.join(directories.assets(), 'templates/contract/style.css'),
      ],
    },
  });
}

export default generateContract;
