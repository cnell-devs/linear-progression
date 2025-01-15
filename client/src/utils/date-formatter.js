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