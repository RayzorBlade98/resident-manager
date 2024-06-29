import { rm } from 'fs/promises';
import path from 'path';
import { mdToPdfFile } from 'electron-md-to-pdf';
import { v4 as uuid } from 'uuid';
import {
  ContractGenerationArgs,
  generateContractMarkdown,
} from '../contractGeneration';
import { getTmpDirectory } from '../persistence/getAppDataDirectory';
import uploadDocument from '../persistence/uploadDocument';
import Imported from '_/types/Imported';

async function generateContract(
  args: Imported<ContractGenerationArgs>,
): Promise<string> {
  const contract = generateContractMarkdown(args);

  const tmpFile = path.join(getTmpDirectory(), getRandomPdfFile().fileName);
  await mdToPdfFile(contract, tmpFile, {});

  const { documentId, fileName } = getRandomPdfFile();
  uploadDocument(tmpFile, fileName, {
    type: 'resident',
    residentId: args.resident.id,
  });
  await rm(tmpFile);

  return documentId;
}

function getRandomPdfFile() {
  const documentId = uuid();
  const fileName = `${documentId}.pdf`;
  return { documentId, fileName };
}

export default generateContract;
