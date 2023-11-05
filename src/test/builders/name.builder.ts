import Name, { Salutation } from '_/models/name';

class NameBuilder {
  private name: Name;

  constructor() {
    this.name = {
      salutation: Salutation.Male,
      firstName: 'Max',
      lastName: 'Mustermann',
    };
  }

  public withFirstName(firstName: string): NameBuilder {
    this.name.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): NameBuilder {
    this.name.lastName = lastName;
    return this;
  }

  public withSalutation(salutation: Salutation): NameBuilder {
    this.name.salutation = salutation;
    return this;
  }

  public build(): Name {
    return this.name;
  }
}

export default NameBuilder;
