import { generateInvoiceMarkdown } from './generateInvoiceMarkdown';
import { generateInvoicePdfs } from './generateInvoicePdfs';
import { uploadMarkdownAsPdf } from '_/ipc/utils/persistence/uploadMarkdownAsPdf/uploadMarkdownAsPdf';
import Invoice from '_/models/invoice/invoice';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import ResidentInvoiceInformationBuilder from '_/test/builders/residentInvoiceInformation.builder';
import Imported from '_/types/Imported';

jest.mock('./generateInvoiceMarkdown', () => ({
  generateInvoiceMarkdown: jest.fn(),
}));

jest.mock(
  '../../../utils/persistence/uploadMarkdownAsPdf/uploadMarkdownAsPdf',
  () => ({
    uploadMarkdownAsPdf: jest.fn(),
  }),
);

describe('generateInvoicePdfs', () => {
  it('should generate invoice pdf and upload them successfully', async () => {
    // Arrange
    const resident1 = 'resident1';
    const resident2 = 'resident2';
    const resident3 = 'resident3';

    const invoice = new InvoiceBuilder()
      .withResident(
        new ResidentInvoiceInformationBuilder()
          .withResidentId(resident1)
          .build(),
      )
      .withResident(
        new ResidentInvoiceInformationBuilder()
          .withResidentId(resident2)
          .build(),
      )
      .withResident(
        new ResidentInvoiceInformationBuilder()
          .withResidentId(resident3)
          .build(),
      )
      .build();
    const invoiceImported = JSON.parse(
      JSON.stringify(invoice),
    ) as Imported<Invoice>;

    const markdown1 = 'markdown1';
    const markdown2 = 'markdown2';
    const markdown3 = 'markdown3';

    (generateInvoiceMarkdown as jest.Mock).mockImplementation(
      (_invoice: Invoice, residentId: string) => {
        expect(_invoice).toEqual(invoiceImported);

        switch (residentId) {
          case resident1:
            return markdown1;
          case resident2:
            return markdown2;
          case resident3:
            return markdown3;
          default:
            throw new Error();
        }
      },
    );

    const document1 = 'document1';
    const document2 = 'document2';
    const document3 = 'document3';

    (uploadMarkdownAsPdf as jest.Mock).mockImplementation(
      (args: { markdownContent: string; target: object }): Promise<string> => {
        const getExpectedTarget = (residentId: string) => ({
          type: 'resident',
          residentId,
        });

        switch (args.markdownContent) {
          case markdown1:
            expect(args.target).toEqual(getExpectedTarget(resident1));
            return Promise.resolve(document1);
          case markdown2:
            expect(args.target).toEqual(getExpectedTarget(resident2));
            return Promise.resolve(document2);
          case markdown3:
            expect(args.target).toEqual(getExpectedTarget(resident3));
            return Promise.resolve(document3);
          default:
            throw new Error();
        }
      },
    );

    const expectedDocumentIds = {
      [resident1]: document1,
      [resident2]: document2,
      [resident3]: document3,
    };

    // Act
    const documentIds = await generateInvoicePdfs(invoiceImported);

    // Assert
    expect(documentIds).toEqual(expectedDocumentIds);
  });
});
