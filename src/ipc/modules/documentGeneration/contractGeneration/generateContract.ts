import path from 'path';
import {
  ContractGenerationArgs,
  generateContractMarkdown,
} from './generateContractMarkdown';
import { getAssetDirectory } from '_/ipc/utils/persistence/getAppDataDirectory';
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
      cssFiles: [path.join(getAssetDirectory(), 'contract/style.css')],
    },
  });
}

export default generateContract;
