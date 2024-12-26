export function localToUTC(localDate) {
  if (!(localDate instanceof Date)) {
    throw new Error("Invalid date: input must be a Date object");
  }

  const utcDate = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000,
  );
  return utcDate;
}

export function utcToLocal(utcDate) {
  if (!(utcDate instanceof Date)) {
    throw new Error("Invalid date: input must be a Date object");
  }

  const localDate = new Date(
    utcDate.getTime() + new Date().getTimezoneOffset() * 60000,
  );
  return localDate;
}

export function getTimeString(date) {
  const pad = (number) => String(number).padStart(2, "0");

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${hours}:${minutes}`;
}

export function combineDateAndTime(dateObj, timeObj) {
  dateObj.setHours(timeObj.hour);
  dateObj.setMinutes(timeObj.minute);
  dateObj.setSeconds(0);
  dateObj.setMilliseconds(0);

  return dateObj;
}

export function formatLocalDate(date, wTime = true) {
  const padZero = (num) => num.toString().padStart(2, "0");

  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

  return (
    `${day}/${month}/${year}` + (wTime === true ? ` ${hours}:${minutes}` : "")
  );
}

export function getLocalISOString(date) {
  const pad = (num) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}
