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
  console.log(dateString);
  const currentDate = new Date();
  const comparisonDate = new Date(dateString);

  const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
  const currentTime = currentDate.getTime();
  const comparisonTime = comparisonDate.getTime();

  console.log(comparisonTime - currentTime < oneYearInMilliseconds);

  if (comparisonTime - currentTime < oneYearInMilliseconds) {
    return true;
  } else {
    return false;
  }
}

export function isValidYear(year) {
  var date = new Date(year, 0, 1);
  return date.getFullYear() === Number(year);
}

export function isValidDate(date) {
  let dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/([0-9]{4})$/;
  return dateRegex.test(date);
}
