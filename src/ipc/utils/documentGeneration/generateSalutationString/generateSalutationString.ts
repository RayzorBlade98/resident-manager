import { convertNameToString } from '../../../../utils/name/name.utils';
import { Salutation } from '_/models/name';
import { ContractResident } from '_/models/resident/contractResident';
import { Resident } from '_/models/resident/resident';

/**
 * Generates the salutation string that starts the correspondence with a resident addressing every contract resident
 * @param resident Resident that should be saluted
 * @returns generated salutation string
 */
export function generateSalutationString(resident: Resident): string {
  return resident.contractResidents
    .map(generateSingleSalutationString)
    .map((salutation, i) => (i !== 0
      ? salutation.charAt(0).toLowerCase() + salutation.slice(1)
      : salutation))
    .join(', ');
}

function generateSingleSalutationString(resident: ContractResident): string {
  const dearString = `geehrte${resident.name.salutation === Salutation.Male ? 'r' : ''}`;
  const formattedName = convertNameToString(resident.name, {
    includeSalutation: true,
    excludeFirstName: true,
  });
  return `Sehr ${dearString} ${formattedName}`;
}
