export function parseNameParts(fullName) {
  const spaceIndex = fullName.indexOf(' ');
  if (spaceIndex === -1) {
    return { first: fullName, middle: '', lastInitial: '', lastRest: '' };
  }

  const firstName = fullName.slice(0, spaceIndex);
  const lastName = fullName.slice(spaceIndex + 1);

  return {
    first: firstName[0] ?? '',
    middle: firstName.slice(1) + ' ',
    lastInitial: lastName[0] ?? '',
    lastRest: lastName.slice(1),
  };
}
