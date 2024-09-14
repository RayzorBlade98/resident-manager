import { v4 as uuid } from 'uuid';
import { LinkedDocument, DocumentType } from '_/models/resident/document';

class LinkedDocumentBuilder {
  private document: LinkedDocument = {
    id: uuid(),
    name: 'test.txt',
    creationDate: new Date(2024, 5, 9),
    subjectDate: new Date(2024, 5, 9),
    type: DocumentType.Contract,
  };

  public build(): LinkedDocument {
    return this.document;
  }

  public withSubjectDate(date: Date): LinkedDocumentBuilder {
    this.document.subjectDate = date;
    return this;
  }

  public withCreationDate(date: Date): LinkedDocumentBuilder {
    this.document.creationDate = date;
    return this;
  }

  public withName(name: string): LinkedDocumentBuilder {
    this.document.name = name;
    return this;
  }
}

export default LinkedDocumentBuilder;
