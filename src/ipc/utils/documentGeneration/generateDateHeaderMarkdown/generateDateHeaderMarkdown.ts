import dateHeaderTemplate from '_/assets/templates/dateHeader/dateHeaderTemplate.md';

/**
 * Generates a markdown string representing an date header for todays date
 * @returns generated markdown string
 */
export function generateDateHeaderMarkdown(): string {
  let header = dateHeaderTemplate;
  header = header.replaceAll('{{DATE}}', new Date().toPreferredString());
  return header;
}
