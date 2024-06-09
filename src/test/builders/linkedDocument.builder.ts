import { v4 as uuid } from 'uuid';
import { DocumentType, LinkedDocument } from '_/models/resident/document';

class LinkedDocumentBuilder {
  private document: LinkedDocument = {
    id: uuid(),
    name: 'test.txt',
    date: new Date(2024, 5, 9),
    type: DocumentType.Contract,
  };

  public build(): LinkedDocument {
    return this.document;
  }

  public withDate(date: Date): LinkedDocumentBuilder {
    this.document.date = date;
    return this;
  }

  public withName(name: string): LinkedDocumentBuilder {
    this.document.name = name;
    return this;
  }
}

export default LinkedDocumentBuilder;
