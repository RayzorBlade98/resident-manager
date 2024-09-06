import {
  convertAddressToCityString,
  convertAddressToStreetString,
} from '../../../../utils/address/address.utils';
import { convertNameToString } from '../../../../utils/name/name.utils';
import addressHeaderTemplate from '_/assets/templates/addressHeader/addressHeaderTemplate.md';
import Address from '_/models/address';
import Name from '_/models/name';

export type AddressHeaderEntity = {
  names: Name[];
  address: Address;
};

const placeholderLabels = {
  receiverName: 'RECEIVER_NAME',
  receiverStreet: 'RECEIVER_STREET',
  receiverCity: 'RECEIVER_CITY',
  senderName: 'SENDER_NAME',
  senderStreet: 'SENDER_STREET',
  senderCity: 'SENDER_CITY',
} satisfies Record<string, string>;

/**
 * Generates a markdown string representing an adress header for mailed documents
 * @param sender information of the sender
 * @param receiver information of the receiver
 * @returns generated markdown string
 */
export function generateAddressHeaderMarkdown(
  sender: AddressHeaderEntity,
  receiver: AddressHeaderEntity,
) {
  let header = addressHeaderTemplate;

  const replacements: Record<string, string> = {
    [placeholderLabels.receiverName]: convertNames(receiver.names),
    [placeholderLabels.receiverStreet]: convertAddressToStreetString(
      receiver.address,
    ),
    [placeholderLabels.receiverCity]: convertAddressToCityString(
      receiver.address,
    ),
    [placeholderLabels.senderName]: convertNames(sender.names),
    [placeholderLabels.senderStreet]: convertAddressToStreetString(
      sender.address,
    ),
    [placeholderLabels.senderCity]: convertAddressToCityString(sender.address),
  };

  Object.entries(replacements).forEach(([label, replacement]) => {
    header = header.replaceAll(`{{${label}}}`, replacement);
  });

  return header;
}

function convertNames(names: Name[]): string {
  return names.map((name) => convertNameToString(name)).join('<br>');
}
