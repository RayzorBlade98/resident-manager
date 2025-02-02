import { generateInvoiceMarkdown } from './generateInvoiceMarkdown';
import { uploadMarkdownAsPdf } from '_/ipc/utils/persistence/uploadMarkdownAsPdf/uploadMarkdownAsPdf';
import Invoice from '_/models/invoice/invoice';
import Imported from '_/types/Imported';

/**
 * Generates an invoice pdf for each resident included in the invoice
 * @param invoice Invoice for which the pdfs should be generated
 * @returns Object containing a mapping from resident id to the document id of the generated invoice pdf
 */
export async function generateInvoicePdfs(
  invoice: Imported<Invoice>,
): Promise<Record<string, string>> {
  const residentIds = Object.keys(invoice.residentInformation);
  const pdfGenerationPromises = residentIds.map((residentId) => generateInvoicePdf(invoice, residentId));
  const documentIdMappings = await Promise.all(pdfGenerationPromises);
  return Object.fromEntries(documentIdMappings);
}

/**
 * Generates an invoice pdf for the provided resident and invoice
 * @param invoice Invoice for which the pdfs should be generated
 * @param residentId Id of the resident for which the pdfs should be generated
 * @returns id of the resident and document id of the generated invoice pdf
 */
async function generateInvoicePdf(
  invoice: Imported<Invoice>,
  residentId: string,
): Promise<[string, string]> {
  const markdown = generateInvoiceMarkdown(invoice, residentId);
  const documentId = await uploadMarkdownAsPdf({
    markdownContent: markdown,
    target: {
      type: 'resident',
      residentId,
    },
  });
  return [residentId, documentId];
}
