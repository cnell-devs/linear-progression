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
