
export function getYear(string) {
    const yearRegex = /\b(?:20|19)\d{2}\b/;
    const yearMatch = string.match(yearRegex);
    if (yearMatch) {
        return yearMatch[0];
    }
    return null;
}

export function getDate(string) {
    const dateRegex = /\b\d{2}\/\d{2}\/\d{4}\b/;
    const dateMatch = string.match(dateRegex);
    if (dateMatch) {
        return dateMatch[0];
    }
    return null;
}

export function isDateMoreThanOneYearAway(dateString) {
  const date = new Date(dateString);
  const currentDate = new Date();
  const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
  return date - currentDate > oneYearInMilliseconds;
}
