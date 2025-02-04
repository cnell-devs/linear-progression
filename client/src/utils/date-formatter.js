export const formatDate = (time) => {
  time = new Date(time);
  return time
    .toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(" ", "")
    .split(",");
};



export const convertUtcToDateFormat = (isoString) => {
  const date = new Date(isoString); // Parse the ISO string (UTC time)

  // Get the month, day, and year in UTC
  const month = date.getUTCMonth() + 1; // Months are 0-indexed, so add 1
  const day = date.getUTCDate(); // Get the UTC day of the month
  const year = date.getUTCFullYear(); // Get the UTC year

  // Format as M/DD/YYYY
  return `${month}/${day}/${year}`;
};

export const convertUTCToLocalUTC = (utcString) => {
  // Get user's detected time zone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Parse the UTC string
  const utcDate = new Date(utcString);

  // Get the local time zone offset in minutes for the detected time zone
  const localDate = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(utcDate);

  // Extract parts
  const year = localDate.find((part) => part.type === "year").value;
  const month = localDate.find((part) => part.type === "month").value;
  const day = localDate.find((part) => part.type === "day").value;
  const hour = localDate.find((part) => part.type === "hour").value;
  const minute = localDate.find((part) => part.type === "minute").value;
  const second = localDate.find((part) => part.type === "second").value;

  // Construct the new UTC-like format with local time
  return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
};